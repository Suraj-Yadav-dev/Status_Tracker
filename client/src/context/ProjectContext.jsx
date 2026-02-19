import React, { createContext, useContext, useState, useEffect } from "react";
import { stages as initialStages } from "../data/stageConfig";

export const ProjectContext = createContext();

export const ProjectProvider = ({ children, userEmail }) => {
  // 1. Initialize State from LocalStorage or Default Config
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem("plant_master_data");
    if (saved) return JSON.parse(saved);

    // Default structure if no saved data exists
    return initialStages.map((stage) => ({
      ...stage,
      currentStatus: "Inactive",
      startDate: "",
      endDate: "",
      lastUpdatedBy: "", // Track which department updated last
      substages: stage.substages.map((sub) => ({
        ...sub,
        currentStatus: "Inactive",
        startDate: "",
        endDate: "",
      })),
    }));
  });

  // 2. Persist to LocalStorage whenever 'data' changes
  useEffect(() => {
    localStorage.setItem("plant_master_data", JSON.stringify(data));
  }, [data]);

  /* ================= AUTHORIZATION LOGIC ================= */
  const canEdit = (departmentString) => {
    if (!departmentString) return false;
    const allowedDepartments = departmentString.split(",").map((d) => d.trim());
    
    // Super-user access
    if (userEmail === "cs.ersurajyadav@gmail.com") return true;

    return allowedDepartments.some((dept) =>
      userEmail?.toLowerCase().includes(dept.toLowerCase())
    );
  };

  /* ================= STATUS & DEPT UPDATE ================= */
  // Added 'deptName' parameter to track who is saving the data
  const updateStatus = (stageId, substageId, newStatus, deptName = "System") => {
    setData((prev) =>
      prev.map((stage) => {
        if (stage.id !== stageId) return stage;

        // If updating a main stage
        if (substageId === null) {
          return { 
            ...stage, 
            currentStatus: newStatus, 
            lastUpdatedBy: deptName 
          };
        }

        // If updating a substage
        const updatedSubs = stage.substages.map((sub) =>
          sub.id === substageId
            ? { ...sub, currentStatus: newStatus }
            : sub
        );

        return { ...stage, substages: updatedSubs, lastUpdatedBy: deptName };
      })
    );
  };

  /* ================= DATE UPDATE ================= */
  const updateDates = (stageId, substageId, field, value) => {
    setData((prev) =>
      prev.map((stage) => {
        if (stage.id !== stageId) return stage;

        if (substageId === null) {
          return { ...stage, [field]: value };
        }

        const updatedSubs = stage.substages.map((sub) =>
          sub.id === substageId
            ? { ...sub, [field]: value }
            : sub
        );

        return { ...stage, substages: updatedSubs };
      })
    );
  };

  /* ================= DASHBOARD ANALYTICS ================= */
  // This helper helps the MD see the overall health of the plant
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

  /* ================= DEADLINE ALERT ================= */
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    data.forEach((stage) => {
      stage.substages.forEach((sub) => {
        if (sub.currentStatus !== "Completed" && sub.endDate && sub.endDate < today) {
          console.warn(`ALERT: Task "${sub.name}" is past deadline!`);
        }
      });
    });
  }, [data]);

  return (
    <ProjectContext.Provider
      value={{
        data,
        updateStatus,
        updateDates,
        canEdit,
        userEmail,
        getPlantStats, // New helper for MD dashboard
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject must be used within ProjectProvider");
  }
  return context;
};