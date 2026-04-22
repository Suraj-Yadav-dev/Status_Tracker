import React, { useState } from "react";
import { useProject } from "../../context/ProjectContext";

const SubStageNode = ({ sub, stageId, isLastSubstage, parentStage }) => {
  const { updateStatus, updateDates, updateRemark } = useProject();
  
  // --- NEW: State for the Remark Modal ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempRemark, setTempRemark] = useState(sub.remark || "");

  // --- UPGRADED VALIDATION LOGIC (UNCHANGED) ---
  const validateDates = () => {
    if (!sub.startDate || !sub.endDate) return { hasError: false };

    const start = new Date(sub.startDate);
    const end = new Date(sub.endDate);

    if (end < start) {
      return { hasError: true, type: "INVALID", message: "End date is before Start date" };
    }

    if (parentStage) {
      const parentStart = new Date(parentStage.startDate);
      const parentEnd = new Date(parentStage.endDate);
      
      if (start < parentStart || end > parentEnd) {
        return { hasError: true, type: "OUT_OF_BOUNDS", message: "Dates fall outside parent stage timeline" };
      }
    }

    if (sub.day) {
      const diffTime = end.getTime() - start.getTime();
      const actualDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 
      
      const requiredDays = parseFloat(sub.day.replace(/[^\d.]/g, ""));

      if (actualDays > requiredDays) {
        return { hasError: true, type: "DELAY", message: `+${(actualDays - requiredDays).toFixed(1)} Days Over` };
      }
    }

    return { hasError: false };
  };

  const validation = validateDates();
  // -------------------------

  // --- Status Classes ---
  const statusClasses = {
    Active: "bg-yellow-200 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]",
    Completed: "bg-green-200 border-green-500",
    Inactive: "bg-red-200 border-red-500 opacity-80",
    Null: "bg-slate-200 border-slate-400 border-dashed opacity-60 text-slate-500",
    Accepted: "bg-emerald-200 border-emerald-600 text-emerald-900 shadow-[0_0_15px_rgba(16,185,129,0.3)]",
    Rejected: "bg-rose-300 border-rose-600 text-rose-900",
    OnHold: "bg-orange-200 border-orange-500 border-dashed text-orange-900 opacity-90",
  };

  const isActive = sub.currentStatus === "Active" || sub.currentStatus === "Accepted";

  // --- Modal Handlers ---
  const handleOpenModal = () => {
    setTempRemark(sub.remark || "");
    setIsModalOpen(true);
  };

  const handleSaveRemark = () => {
    updateRemark(stageId, sub.id, tempRemark);
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div 
        className={`
          relative w-full p-4 rounded-xl border-2 transition-all duration-300 z-10
          ${statusClasses[sub.currentStatus] || "bg-slate-100 border-slate-300"}
          ${validation.hasError ? "border-red-600 ring-2 ring-red-300" : ""} 
        `}
      >
        <div className="relative z-20">
          
          <div className="flex justify-between items-start gap-2 mb-3">
            <div>
              <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wide">
                {sub.name}
              </h4>
              {sub.targetDate && (
                <div className="text-[10px] font-bold text-slate-500 mt-1">
                  🎯 Expected By: <span className="text-blue-600 bg-blue-50 px-1 py-0.5 rounded">{sub.targetDate}</span>
                </div>
              )}
            </div>
            
            {sub.day && (
              <span className="shrink-0 px-2 py-0.5 bg-white/70 text-slate-800 text-[10px] font-black rounded border border-black/10 shadow-sm whitespace-nowrap">
                {sub.day}
              </span>
            )}
          </div>

          {/* DYNAMIC ALERT UI */}
          {validation.hasError && (
            <div className="mb-3 p-2 bg-red-600 text-white text-[10px] font-bold rounded animate-pulse flex items-center justify-between">
              <span>{validation.type === "DELAY" ? "⚠️ DELAY DETECTED" : "⚠️ DATE ERROR"}</span>
              <span>{validation.message}</span>
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
            className="w-full p-2 text-xs font-bold rounded border border-black/10 bg-white cursor-pointer transition-colors focus:ring-2 focus:ring-blue-400 outline-none mb-3"
          >
            {sub.id === "1.4" ? (
              <>
                <option value="Inactive">🔴 Inactive</option>
                <option value="Accepted">✅ Accepted</option>
                <option value="Rejected">❌ Rejected</option>
                <option value="OnHold">⏸️ On Hold</option>
                <option value="Completed">✅ Completed</option>
                <option value="Active">🟡 Active</option>
              </>
            ) : (
              <>
                <option value="Inactive">🔴 Inactive</option>
                <option value="Active">🟡 Active</option>
                <option value="Completed">🟢 Completed</option>
                <option value="Null">⚪ Null</option> 
              </>
            )}
          </select>

          {/* --- Display Remark on Card --- */}
          {sub.remark && (
            <div className="mb-2 p-2 bg-white/80 border border-slate-200 rounded-md text-[10px] text-slate-700 shadow-sm">
              <span className="font-bold text-[8px] uppercase tracking-widest text-slate-400 block mb-0.5">Remarks</span>
              <p className="italic leading-relaxed">{sub.remark}</p>
            </div>
          )}

          {/* --- Button to trigger Modal --- */}
          <button
            onClick={handleOpenModal}
            className="w-full py-1.5 bg-white/60 hover:bg-white text-slate-600 border border-slate-300 rounded text-[10px] font-bold transition-colors shadow-sm uppercase tracking-wider"
          >
            {sub.remark ? "Edit Remark ✏️" : "+ Add Remark"}
          </button>

        </div>
      </div>

      {/* --- Visual Timeline Connector --- */}
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

      {/* --- Remarks Popup Modal --- */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-white w-full max-w-sm rounded-2xl shadow-xl p-6"
            onClick={(e) => e.stopPropagation()} // Prevents clicks inside modal from closing it
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Substage Remark</h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-slate-400 hover:text-red-500 text-3xl leading-none transition-colors"
              >
                &times;
              </button>
            </div>
            
            <textarea
              value={tempRemark}
              onChange={(e) => setTempRemark(e.target.value)}
              placeholder="Enter reasons for delay, special notes, or updates here..."
              rows="4"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none resize-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all mb-4"
            />
            
            <button 
              onClick={handleSaveRemark}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold uppercase tracking-widest shadow-md transition-all"
            >
              Save Remark
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default SubStageNode;