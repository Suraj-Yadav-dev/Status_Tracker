import React from "react";
import { useProject } from "../../context/ProjectContext";

const SubStageNode = ({ sub, stageId, isLastSubstage }) => {
  const { updateStatus, updateDates } = useProject();

  const statusClasses = {
    Active: "bg-yellow-200 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]",
    Completed: "bg-green-200 border-green-500",
    Inactive: "bg-red-200 border-red-500 opacity-80",
  };

  const isActive = sub.currentStatus === "Active";

  return (
    <div className="flex flex-col items-center w-full">
      {/* Substage Box */}
      <div 
        className={`
          relative w-full p-4 rounded-xl border-2 transition-all duration-300 z-10
          ${statusClasses[sub.currentStatus] || "bg-slate-100 border-slate-300"}
        `}
      >
        <div className="relative z-20">
          
          {/* --- NEW: Title & Day Badge Container --- */}
          <div className="flex justify-between items-start gap-2 mb-3">
            <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wide">
              {sub.name}
            </h4>
            {/* Renders the Day if it exists in your stageConfig.js */}
            {sub.day && (
              <span className="shrink-0 px-2 py-0.5 bg-white/70 text-slate-800 text-[10px] font-black rounded border border-black/10 shadow-sm whitespace-nowrap">
                {sub.day}
              </span>
            )}
          </div>

          {/* Date Row */}
          <div className="flex gap-2 mb-3">
            <input 
              type="date" 
              value={sub.startDate || ""} 
              onChange={(e) => updateDates(stageId, sub.id, 'startDate', e.target.value)}
              className="w-full text-[10px] p-1.5 rounded border border-black/10 bg-white/60 outline-none focus:bg-white transition-colors"
            />
            <input 
              type="date" 
              value={sub.endDate || ""} 
              onChange={(e) => updateDates(stageId, sub.id, 'endDate', e.target.value)}
              className="w-full text-[10px] p-1.5 rounded border border-black/10 bg-white/60 outline-none focus:bg-white transition-colors"
            />
          </div>

          {/* Status Dropdown */}
          <select 
            value={sub.currentStatus || "Inactive"} 
            onChange={(e) => updateStatus(stageId, sub.id, e.target.value)}
            className="w-full p-2 text-xs font-bold rounded border border-black/10 bg-white cursor-pointer transition-colors focus:ring-2 focus:ring-blue-400 outline-none"
          >
            <option value="Inactive">🔴 Inactive</option>
            <option value="Active">🟡 Active</option>
            <option value="Completed">🟢 Completed</option>
            <option value="">Null</option>
          </select>
        </div>
      </div>

      {/* THE VERTICAL ROAD BETWEEN SUBSTAGES */}
      {!isLastSubstage && (
        <div className="relative w-full flex justify-center py-4">
          <div className={`
            w-2 h-10 rounded-full transition-all duration-500
            ${isActive 
              ? "bg-[repeating-linear-gradient(to_bottom,#22c55e_0px,#22c55e_10px,#ffffff_10px,#ffffff_20px)] animate-[driveVertical_0.5s_linear_infinite] shadow-[0_0_10px_#22c55e]" 
              : "bg-slate-200"}
          `} />
        </div>
      )}
    </div>
  );
};

export default SubStageNode;