import React, { createContext, useContext, useState, useEffect } from "react";
import { stages as initialStages } from "../data/stageConfig";

// 1. Define and EXPORT Access Control Mapping
// Exporting this allows App.jsx to validate emails before entering the dashboard
export const ACCESS_CONTROL = {
  "hr_head@plant.com": "HR",
  "quality_mgr@plant.com": "QR",
  "finance_lead@plant.com": "Accounts",
  "md_office@company.com": "ADMIN", // Full access for MD
  "cs.ersurajyadav@gmail.com": "ADMIN" // Developer bypass
};

export const ProjectContext = createContext();

export const ProjectProvider = ({ children, userEmail, setUserEmail }) => {
  // 2. Initialize State from LocalStorage or Default Config
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem("plant_master_data");
    if (saved) return JSON.parse(saved);

    // Default structure if no saved data exists
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

  // 3. Persist to LocalStorage whenever 'data' changes
  useEffect(() => {
    localStorage.setItem("plant_master_data", JSON.stringify(data));
  }, [data]);

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

        // Final safety check: block update if user tampered with UI
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

        // Date updates also check permission
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
    setUserEmail(""); // Resetting email triggers the login screen in App.jsx
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