import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { stages as initialStages } from "../data/stageConfig";

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyVoSWl2mzgMi1kHsmbMHKbR3qXZ095gh89SVY0FsuYFTQG9rzLp7rPmvW-bfcF2rvY4g/exec";

export const ACCESS_CONTROL = {
  "marketing@reliable-aes.in": "MR",
  "kprtmarketing@reliable-aes.in": "MARKETING",
  "finance@reliable-aes.in": "ADMIN", 
  "kandpal@reliable-aes.in": "ADMIN",
  "quality@reliable-aes.in": "QUALITY",
  "qarj@reliable-aes.in": "QUALITY",
  "accounts.raes@reliable-aes.in": "ACCOUNTS",
  "hr1@reliable-aes.in": "HR",
};

export const ProjectContext = createContext();

export const ProjectProvider = ({ children, userEmail, setUserEmail, plantName }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [loading, setLoading] = useState(false);

  const getInitialStructure = useCallback(() => initialStages.map(stage => ({
    ...stage,
    currentStatus: "Inactive",
    startDate: "",
    endDate: "",
    lastUpdatedBy: "",
    substages: stage.substages.map(sub => ({
      ...sub,
      currentStatus: "Inactive",
      startDate: "",
      endDate: "",
    })),
  })), []);

  const [data, setData] = useState(getInitialStructure());

  useEffect(() => {
    if (!plantName) return;

    const fetchPlantData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${APPS_SCRIPT_URL}?plantName=${encodeURIComponent(plantName)}`, {
          method: "GET",
          redirect: "follow", 
        });
        const cloudMap = await response.json();

        if (cloudMap && Object.keys(cloudMap).length > 0) {
          const mergedData = initialStages.map(stage => {
            const stageKey = `${stage.id}_STAGE`;
            const cloudStage = cloudMap[stageKey];
            return {
              ...stage,
              currentStatus: cloudStage?.status || "Inactive",
              startDate: cloudStage?.start || "",
              endDate: cloudStage?.end || "",
              lastUpdatedBy: cloudStage?.user || "",
              substages: stage.substages.map(sub => {
                const subKey = `${stage.id}_${sub.id}`;
                const cloudSub = cloudMap[subKey];
                return {
                  ...sub,
                  currentStatus: cloudSub?.status || "Inactive",
                  startDate: cloudSub?.start || "",
                  endDate: cloudSub?.end || ""
                };
              })
            };
          });
          setData(mergedData);
        } else {
          setData(getInitialStructure());
        }
      } catch (error) {
        console.error("Cloud Fetch Error:", error);
        setData(getInitialStructure());
      } finally {
        setLoading(false);
      }
    };

    fetchPlantData();
  }, [plantName, getInitialStructure]);

  const syncToCloud = useCallback(async (updatedData) => {
    if (!plantName) return;
    setIsSyncing(true);
    try {
      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plantName,
          userEmail: userEmail || "Anonymous",
          data: updatedData
        }),
      });
      // Small timeout to allow the UI to show "Saved"
      setTimeout(() => setIsSyncing(false), 1500); 
    } catch (error) {
      console.error("Failed to sync:", error);
      setIsSyncing(false);
    }
  }, [plantName, userEmail]);

  const canEdit = (stageDepartment) => {
    if (!userEmail) return false;
    const emailKey = userEmail.toLowerCase().trim();
    const userDept = ACCESS_CONTROL[emailKey];
    if (userDept === "ADMIN") return true;
    return userDept && stageDepartment.includes(userDept);
  };

  const updateStatus = (stageId, substageId, newStatus, deptName = "System") => {
    setData((prev) => {
      const newData = prev.map((stage) => {
        if (stage.id !== stageId) return stage;
        if (!canEdit(stage.department)) {
          alert("Access Denied.");
          return stage;
        }

        if (substageId === null) {
          return { ...stage, currentStatus: newStatus, lastUpdatedBy: deptName };
        }

        const updatedSubs = stage.substages.map((sub) =>
          sub.id === substageId ? { ...sub, currentStatus: newStatus } : sub
        );
        return { ...stage, substages: updatedSubs, lastUpdatedBy: deptName };
      });
      
      syncToCloud(newData); 
      return newData;
    });
  };

  const updateDates = (stageId, substageId, field, value) => {
    setData((prev) => {
      const newData = prev.map((stage) => {
        if (stage.id !== stageId) return stage;
        if (!canEdit(stage.department)) return stage;

        if (substageId === null) {
          return { ...stage, [field]: value };
        }

        const updatedSubs = stage.substages.map((sub) =>
          sub.id === substageId ? { ...sub, [field]: value } : sub
        );
        return { ...stage, substages: updatedSubs };
      });

      syncToCloud(newData);
      return newData;
    });
  };

  const getPlantStats = () => {
    const total = data.length;
    const completed = data.filter(s => s.currentStatus === "Completed").length;
    const active = data.filter(s => s.currentStatus === "Active").length;
    return {
      percentage: Math.round((completed / total) * 100) || 0,
      completedCount: completed,
      activeCount: active,
      totalCount: total
    };
  };

  const logout = () => setUserEmail("");

  return (
    <ProjectContext.Provider
      value={{
        data, loading, isSyncing,
        updateStatus, updateDates,
        canEdit, userEmail, getPlantStats, logout
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) throw new Error("useProject must be used within ProjectProvider");
  return context;
};