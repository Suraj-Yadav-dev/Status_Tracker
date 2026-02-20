import React, { useState } from "react";
import { useProject } from "../../context/ProjectContext";
import SubStageNode from "./SubStageNode";

const StageNode = ({ stage, isLast }) => {
  const { updateStatus, updateDates, canEdit } = useProject();
  const [isOpen, setIsOpen] = useState(false);
  const [showUpdateBox, setShowUpdateBox] = useState(false);
  
  // Local state to track the department selected in the dropdown
  const [tempDept, setTempDept] = useState(stage.lastUpdatedBy || "");

  const isActive = stage.currentStatus === "Active";
  const isCompleted = stage.currentStatus === "Completed";

  // Check if the current logged-in user has permission to edit this stage
  const hasPermission = canEdit(stage.department);

  return (
    <div className="flex flex-col md:flex-row items-center">
      {/* --- Main Stage Card --- */}
      <div
        className={`relative w-full md:w-80 p-6 rounded-2xl border-2 transition-all duration-300 shadow-lg cursor-pointer
        ${isCompleted ? "bg-green-50 border-green-500" : "bg-white border-slate-200"}
        ${isActive ? "ring-4 ring-yellow-400/20 border-yellow-500 shadow-xl scale-[1.02]" : "hover:border-slate-300"}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-extrabold text-slate-800 tracking-tight uppercase leading-tight">
              {stage.name}
            </h3>
            <div 
              className="p-1 text-slate-400 transition-transform duration-300"
              style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
            >
              ▼
            </div>
          </div>

          {/* --- DATA DISPLAY SECTION (Always Visible for MD) --- */}
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 mb-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Department:</span>
              <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                {stage.lastUpdatedBy || "Pending"}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Timeline:</span>
              <span className="text-[11px] font-bold text-slate-700">
                {stage.startDate ? `${stage.startDate} → ${stage.endDate}` : "Dates not set"}
              </span>
            </div>

            <div className={`w-full py-1 text-center rounded-md text-[10px] font-black uppercase tracking-widest mt-1
              ${isActive ? "bg-yellow-400 text-yellow-900" : isCompleted ? "bg-green-500 text-white" : "bg-slate-200 text-slate-500"}`}>
              {stage.currentStatus}
            </div>
          </div>

          {/* --- AUTHENTICATED UPDATE BUTTON --- */}
          {hasPermission ? (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowUpdateBox(true);
              }}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-black tracking-widest transition-all shadow-md uppercase"
            >
              Update Data
            </button>
          ) : (
            <div className="w-full py-2.5 bg-slate-100 text-slate-400 rounded-lg text-[10px] font-bold text-center border border-dashed border-slate-300 uppercase">
              🔒 {stage.department} Access Only
            </div>
          )}

          {/* --- Substages List --- */}
          <div 
            onClick={(e) => e.stopPropagation()} 
            className={`transition-all duration-500 overflow-hidden ${isOpen ? "mt-6 max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}`}
          >
            <div className="border-t border-slate-100 pt-4 space-y-2">
              {stage.substages?.map((sub, index) => (
                <SubStageNode 
                  key={sub.id} 
                  sub={sub} 
                  stageId={stage.id} 
                  isLastSubstage={index === stage.substages.length - 1} 
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- Central Update Modal --- */}
      {showUpdateBox && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setShowUpdateBox(false)}
        >
          <div 
            className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 animate-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Sync Status</h2>
              <button 
                onClick={() => setShowUpdateBox(false)} 
                className="text-slate-300 hover:text-red-500 text-3xl transition-colors"
              >
                &times;
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Department Selector */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 tracking-widest">Reporting Department</label>
                <select 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={tempDept}
                  onChange={(e) => setTempDept(e.target.value)}
                >
                  <option value="">Select Department...</option>
                  <option value="HR">Human Resources (HR)</option>
                  <option value="QR">Quality & Reliability (QR)</option>
                  <option value="Accounts">Accounts/Finance</option>
                  <option value="MR">Management Rep (MR)</option>
                  <option value="Production">Production Team</option>
                </select>
              </div>

              {/* Date Inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 tracking-widest">Start Date</label>
                  <input 
                    type="date" 
                    value={stage.startDate || ""} 
                    onChange={(e) => updateDates(stage.id, null, "startDate", e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-xl text-sm font-semibold outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 tracking-widest">End Date</label>
                  <input 
                    type="date" 
                    value={stage.endDate || ""} 
                    onChange={(e) => updateDates(stage.id, null, "endDate", e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-xl text-sm font-semibold outline-none" 
                  />
                </div>
              </div>

              {/* Status Select */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 tracking-widest">Update Progress</label>
                <select 
                  value={stage.currentStatus} 
                  onChange={(e) => updateStatus(stage.id, null, e.target.value, tempDept)}
                  className="w-full p-3 border border-slate-200 rounded-xl font-bold bg-slate-50 outline-none"
                >
                  <option value="Inactive">🔴 Inactive</option>
                  <option value="Active">🟡 Active</option>
                  <option value="Completed">🟢 Completed</option>
                </select>
              </div>

              <button 
                onClick={() => {
                  updateStatus(stage.id, null, stage.currentStatus, tempDept);
                  setShowUpdateBox(false);
                }}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-lg transition-all"
              >
                Save & Sync Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Horizontal Road Connector --- */}
      {!isLast && (
        <div className={`transition-all duration-700 md:h-3 md:w-20 h-12 w-3 bg-[repeating-linear-gradient(to_right,#334155_0px,#334155_15px,#cbd5e1_15px,#cbd5e1_30px)]
          ${isActive ? "md:animate-[driveHorizontal_0.8s_linear_infinite] opacity-100" : "opacity-20"}`} 
        />
      )}
    </div>
  );
};

export default StageNode;