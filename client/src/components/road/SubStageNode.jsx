import React from "react";
import { useProject } from "../../context/ProjectContext";

const SubStageNode = ({ sub, stageId, isLastSubstage }) => {
  const { updateStatus, updateDates } = useProject();

  // --- VALIDATION LOGIC ---
  const calculateDelay = () => {
    if (!sub.startDate || !sub.endDate || !sub.day) return null;

    const start = new Date(sub.startDate);
    const end = new Date(sub.endDate);
    
    // Calculate difference in days
    const diffTime = Math.abs(end - start);
    const actualDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include the start day

    // Extract number from "DAY 2.5" -> 2.5
    const requiredDays = parseFloat(sub.day.replace(/[^\d.]/g, ""));

    if (actualDays > requiredDays) {
      return (actualDays - requiredDays).toFixed(1);
    }
    return null;
  };

  const delay = calculateDelay();
  // -------------------------

  const statusClasses = {
    Active: "bg-yellow-200 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]",
    Completed: "bg-green-200 border-green-500",
    Inactive: "bg-red-200 border-red-500 opacity-80",
  };

  const isActive = sub.currentStatus === "Active";

  return (
    <div className="flex flex-col items-center w-full">
      <div 
        className={`
          relative w-full p-4 rounded-xl border-2 transition-all duration-300 z-10
          ${statusClasses[sub.currentStatus] || "bg-slate-100 border-slate-300"}
          ${delay ? "border-red-600 ring-2 ring-red-300" : ""} 
        `}
      >
        <div className="relative z-20">
          
          <div className="flex justify-between items-start gap-2 mb-3">
            <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wide">
              {sub.name}
            </h4>
            {sub.day && (
              <span className="shrink-0 px-2 py-0.5 bg-white/70 text-slate-800 text-[10px] font-black rounded border border-black/10 shadow-sm whitespace-nowrap">
                {sub.day}
              </span>
            )}
          </div>

          {/* DELAY ALERT UI */}
          {delay && (
            <div className="mb-3 p-2 bg-red-600 text-white text-[10px] font-bold rounded animate-pulse flex items-center justify-between">
              <span>⚠️ DELAY DETECTED</span>
              <span>+{delay} Days Over</span>
            </div>
          )}

          <div className="flex gap-2 mb-3">
            <div className="w-full">
               <label className="text-[9px] font-bold text-slate-500 ml-1">START</label>
               <input 
                type="date" 
                value={sub.startDate || ""} 
                onChange={(e) => updateDates(stageId, sub.id, 'startDate', e.target.value)}
                className="w-full text-[10px] p-1.5 rounded border border-black/10 bg-white/60 outline-none focus:bg-white transition-colors"
               />
            </div>
            <div className="w-full">
               <label className="text-[9px] font-bold text-slate-500 ml-1">END</label>
               <input 
                type="date" 
                value={sub.endDate || ""} 
                onChange={(e) => updateDates(stageId, sub.id, 'endDate', e.target.value)}
                className="w-full text-[10px] p-1.5 rounded border border-black/10 bg-white/60 outline-none focus:bg-white transition-colors"
               />
            </div>
          </div>

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