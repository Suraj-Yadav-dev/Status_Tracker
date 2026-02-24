import React, { useState } from "react";
import { useProject } from "../../context/ProjectContext";
import SubStageNode from "./SubStageNode";

// Helper function to extract the number from "DAY 2.5"
const extractDayNumber = (dayStr) => {
  if (!dayStr) return 0;
  return parseFloat(dayStr.replace(/[^\d.]/g, ""));
};

// Helper function to add days to a date string (YYYY-MM-DD)
const addDaysToDate = (dateString, daysToAdd) => {
  const date = new Date(dateString);
  // Math.ceil handles partial days like "2.5" by rounding up to 3 for standard date logic
  date.setDate(date.getDate() + Math.ceil(daysToAdd));
  return date.toISOString().split("T")[0];
};

const StageNode = ({ stage, isLast }) => {
  const { updateStatus, updateDates, canEdit } = useProject();
  const [isOpen, setIsOpen] = useState(false);
  const [showUpdateBox, setShowUpdateBox] = useState(false);
  
  // Validation State
  const [validationError, setValidationError] = useState("");
  const [tempDept, setTempDept] = useState(stage.lastUpdatedBy || "");

  const isActive = stage.currentStatus === "Active";
  const isCompleted = stage.currentStatus === "Completed";
  const hasPermission = canEdit(stage.department);

  // --- ENHANCED: Validation Function ---
  const handleSave = () => {
    setValidationError("");

    // 1. Basic Validation for Completion
    if (stage.currentStatus === "Completed") {
      if (!tempDept) {
        setValidationError("Please select a Department before completing.");
        return;
      }
      if (!stage.startDate || !stage.endDate) {
        setValidationError("Start and End dates are required to complete this stage.");
        return;
      }
    }

    // 2. 17-Day Timeline Validation
    if (stage.startDate && stage.substages && stage.substages.length > 0) {
      // Find the starting "DAY" of this specific stage
      const stageBaseDay = Math.min(...stage.substages.map(s => extractDayNumber(s.day)));

      for (let i = 0; i < stage.substages.length; i++) {
        const sub = stage.substages[i];
        const subDayNum = extractDayNumber(sub.day);
        
        // Calculate the difference in days from the start of the stage
        const dayOffset = subDayNum - stageBaseDay; 
        const expectedDate = addDaysToDate(stage.startDate, dayOffset);

        // If a substage start date has been entered, validate it
        if (sub.startDate && sub.startDate !== expectedDate) {
          setValidationError(`Timeline Error: "${sub.name}" is scheduled for ${sub.day}. Based on the Stage Start Date (${stage.startDate}), it should start on ${expectedDate}.`);
          return; // Stop the save
        }
      }
    }

    // If all validations pass, proceed with sync
    updateStatus(stage.id, null, stage.currentStatus, tempDept);
    setShowUpdateBox(false);
  };

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

          {/* Substages List */}
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
          onClick={() => { setShowUpdateBox(false); setValidationError(""); }}
        >
          <div 
            className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 animate-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Sync Status</h2>
              <button 
                onClick={() => { setShowUpdateBox(false); setValidationError(""); }} 
                className="text-slate-300 hover:text-red-500 text-3xl transition-colors"
              >
                &times;
              </button>
            </div>
            
            {/* Display Immediate Validation Error */}
            {validationError && (
              <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-bold rounded animate-bounce">
                ⚠️ {validationError}
              </div>
            )}

            <div className="space-y-6">
              {/* Department Selector */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 tracking-widest">Reporting Department</label>
                <select 
                  className={`w-full p-3 bg-slate-50 border rounded-xl font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none
                  ${validationError && !tempDept ? "border-red-500 bg-red-50" : "border-slate-200"}`}
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
                    className={`w-full p-3 border rounded-xl text-sm font-semibold outline-none
                    ${validationError && !stage.startDate ? "border-red-500" : "border-slate-200"}`} 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 tracking-widest">End Date</label>
                  <input 
                    type="date" 
                    value={stage.endDate || ""} 
                    onChange={(e) => updateDates(stage.id, null, "endDate", e.target.value)}
                    className={`w-full p-3 border rounded-xl text-sm font-semibold outline-none
                    ${validationError && !stage.endDate ? "border-red-500" : "border-slate-200"}`} 
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
                onClick={handleSave}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-lg transition-all"
              >
                Save & Sync Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StageNode;