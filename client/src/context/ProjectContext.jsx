import React, { createContext, useContext, useState, useEffect } from "react";
import { stages as initialStages } from "../data/stageConfig";

// 1. Define and EXPORT Access Control Mapping
export const ACCESS_CONTROL = {
  "marketing@reliable-aes.in": "MR",
  "kprtmarketing@reliable-aes.in":"MARKETING",
  "finance@reliable-aes.in":"ADMIN", // Full access for Finance
  "kandpal@reliable-aes.in":"",
   // Full access for MD
  "quality@reliable-aes.in":"QUALITY" ,
  "qarj@reliable-aes.in":"QUALITY",
  "accounts.raes@reliable-aes.in":"ACCOUNTS",
  "hr1@reliable-aes.in":"HR",
};

export const ProjectContext = createContext();

// Added plantName to props
export const ProjectProvider = ({ children, userEmail, setUserEmail, plantName }) => {
  
  // Create a unique key for LocalStorage based on the selected plant
  // Example: "plant_data_SDL_SIKRI"
  const STORAGE_KEY = plantName 
    ? `plant_data_${plantName.replace(/\s+/g, '_')}` 
    : "plant_master_data_default";

  // 2. Initialize State from LocalStorage using the UNIQUE KEY
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);

    // Default structure if no saved data exists for THIS SPECIFIC PLANT
    return initialStages.map((stage) => ({
      ...stage,
      currentStatus: "Inactive",
      startDate: "",
      endDate: "",
      lastUpdatedBy: "", 
      substages: stage.substages.map((sub) => ({
        ...sub,
        currentStatus: "Inactive",
        startDate: "",
        endDate: "",
      })),
    }));
  });

  // 3. Persist to LocalStorage using the UNIQUE KEY whenever 'data' changes
  useEffect(() => {
    if (plantName) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [data, STORAGE_KEY, plantName]);

  /* ================= AUTHORIZATION LOGIC ================= */
  const canEdit = (stageDepartment) => {
    if (!userEmail) return false;

    // Direct check from our exported mapping
    const userDept = ACCESS_CONTROL[userEmail.toLowerCase().trim()];
    
    // If the user's assigned department is ADMIN, they can edit everything
    if (userDept === "ADMIN") return true;

    // Check if the user's department matches the stage's required department
    // stageDepartment usually looks like "HR" or "QR, ADMIN"
    return userDept && stageDepartment.includes(userDept);
  };

  /* ================= STATUS & DEPT UPDATE ================= */
  const updateStatus = (stageId, substageId, newStatus, deptName = "System") => {
    setData((prev) =>
      prev.map((stage) => {
        if (stage.id !== stageId) return stage;

        if (!canEdit(stage.department)) {
            console.error("Access Denied: Unauthorized department.");
            alert("You do not have permission to update this department.");
            return stage;
        }

        if (substageId === null) {
          return { 
            ...stage, 
            currentStatus: newStatus, 
            lastUpdatedBy: deptName 
          };
        }

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

        if (!canEdit(stage.department)) return stage;

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

  /* ================= LOGOUT HELPER ================= */
  const logout = () => {
    setUserEmail(""); 
    // We don't need to manually clear 'data' here because 
    // when the user logs back in with a different plant, 
    // the STORAGE_KEY will change and load that plant's data.
  };

  return (
    <ProjectContext.Provider
      value={{
        data,
        updateStatus,
        updateDates,
        canEdit,
        userEmail,
        getPlantStats,
        logout
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