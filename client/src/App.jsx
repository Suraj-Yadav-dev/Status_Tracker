import React, { useState } from 'react';
import RoadContainer from './components/road/RoadContainer';
import { ProjectProvider, ACCESS_CONTROL } from './context/ProjectContext'; 
import './App.css';

const PLANT_LIST = [
  "SDL SIKRI", "VAPL SIKRI-2", "SHANKAR FORGE", "RICO BAWAL",
  "SUNBEAM TAPUKHERA", "POLYPLASTIC-BHIWADI", "BHUNIT PALWAL",
  "VICTORA DHATIR", "SKH MANESER PLANT 2", "VAPL BAWAL-1",
  "MATJET", "CUTTING EDGE DHATIR", "VICTORA BAWAL", "BHAGWATI TECHNO",
  "NIROTECH", "SKH-1", "SATA VIKAS", "MT AUTOCRAFT ROHTAK",
  "SUNBEAM BAWAL", "KML", "POLYPLASTIC-TAMIL NAIDU", "VAPL PRITHLA",
  "VAPL PATHREDI", "VAPL DHATIR B.O.P", "VIBRO CAUSTIC",
  "NOIDA GLOBAL", "SKH-4", "PANCHKULA STEEL", "JRG"
];

function App() {
  const [userEmail, setUserEmail] = useState("");
  const [tempEmail, setTempEmail] = useState("");
  const [plantName, setPlantName] = useState("");
  const [tempPlantName, setTempPlantName] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    const emailToValidate = tempEmail.toLowerCase().trim();

    if (ACCESS_CONTROL.hasOwnProperty(emailToValidate)) {
      if (!tempPlantName.trim()) {
        setError("System Denied: Please select a Plant");
        return;
      }
      setUserEmail(emailToValidate);
      setPlantName(tempPlantName.trim()); 
      setError("");
    } else {
      setError("System Denied: Unrecognized Department Email");
    }
  };

  const handleLogout = () => {
    setUserEmail("");
    setTempEmail("");
    setPlantName("");
    setTempPlantName("");
  };

  if (!userEmail) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0f172a] font-sans relative overflow-hidden p-4">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] sm:w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[100px] sm:blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] sm:w-[40%] h-[40%] bg-emerald-600/10 rounded-full blur-[100px] sm:blur-[120px]" />
        
        <div className="relative z-10 w-full max-w-md">
          <div className="bg-white/95 backdrop-blur-xl p-6 sm:p-10 rounded-3xl sm:rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20">
            <div className="text-center mb-8 sm:mb-10">
              <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-2xl shadow-lg shadow-blue-200 mb-4 sm:mb-6 rotate-3 hover:rotate-0 transition-transform duration-300 overflow-hidden">
                <img src="/kp.jpg" alt="KP Logo" className="w-full h-full object-contain" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">
                Reliable Technique
              </h1>
              <p className="text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] mt-2 sm:mt-3">
                India Private Limited
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
              <div className="relative">
                <label className="text-[9px] sm:text-[10px] font-black text-blue-400 uppercase ml-3 sm:ml-4 mb-1 block tracking-widest">
                  Plant Selection
                </label>
                <div className="relative">
                  <select 
                    required
                    className="w-full p-3 sm:p-4 bg-slate-100/50 border-2 border-transparent focus:border-blue-500 rounded-xl sm:rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-xs sm:text-sm font-bold text-slate-700 uppercase appearance-none cursor-pointer"
                    value={tempPlantName}
                    onChange={(e) => setTempPlantName(e.target.value)}
                  >
                    <option value="" disabled>-- Select Plant --</option>
                    {PLANT_LIST.map((plant) => (
                      <option key={plant} value={plant}>
                        {plant}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">▼</div>
                </div>
              </div>

              <div className="relative">
                <label className="text-[9px] sm:text-[10px] font-black text-blue-400 uppercase ml-3 sm:ml-4 mb-1 block tracking-widest">
                  Identity Verification
                </label>
                <input 
                  type="email" 
                  required
                  placeholder="department@plant.com"
                  className={`w-full p-3 sm:p-4 bg-slate-100/50 border-2 rounded-xl sm:rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-xs sm:text-sm font-bold text-slate-700 placeholder:text-slate-300 ${
                    error ? 'border-red-400 bg-red-50' : 'border-slate-300 focus:border-blue-500'
                  }`}
                  value={tempEmail}
                  onChange={(e) => setTempEmail(e.target.value)}
                />
                {error && (
                  <div className="flex items-center gap-2 mt-2 ml-2">
                    <span className="text-red-500 text-[9px] sm:text-[10px] font-black uppercase tracking-tighter animate-bounce">
                      ⚠️ {error}
                    </span>
                  </div>
                )}
              </div>

              <button 
                type="submit"
                className="w-full py-3.5 sm:py-4 mt-2 bg-slate-900 hover:bg-blue-600 text-white rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black uppercase tracking-widest shadow-xl transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 sm:gap-3 group"
              >
                Authenticate
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </form>

            <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-slate-100">
              <p className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase text-center mb-3 sm:mb-4 tracking-widest">
                Active Access Nodes
              </p>
              <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
                {['HR', 'QR', 'FINANCE', 'ADMIN'].map((dept) => (
                  <span key={dept} className="px-2.5 py-1 sm:px-3 sm:py-1 bg-slate-100 text-slate-500 text-[8px] sm:text-[9px] font-black rounded-full border border-slate-200">
                    {dept}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <p className="text-center mt-6 sm:mt-8 text-slate-500 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.3em] opacity-50">
            Secure Terminal 2026-X4
          </p>
        </div>
      </div>
    );
  }

  return (
    <ProjectProvider userEmail={userEmail} setUserEmail={setUserEmail} plantName={plantName}>
      <div className="app-container min-h-screen bg-[#f8fafc]">
        
        {/* --- UPGRADED AWESOME HEADER --- */}
        <header className="flex flex-col md:flex-row justify-between items-center px-4 sm:px-8 py-4 bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200/80 sticky top-0 z-50 gap-4 md:gap-0 transition-all">
          
          {/* Left: Logo & Live Indicator */}
          <div className="flex items-center justify-between w-full md:w-1/3">
            <div className="flex items-center gap-3 sm:gap-4 group cursor-default">
{/* Upgraded Logo Box */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-slate-200 border border-slate-200 group-hover:scale-105 transition-transform overflow-hidden p-1">
                <img 
                  src="/kp.jpg" 
                  alt="KP Logo" 
                  className="w-full h-full object-contain" 
                />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-black text-slate-800 uppercase tracking-tight leading-tight">
                  Plant Tracker
                </h1>
                {/* Upgraded Live Pill */}
                <div className="flex items-center gap-1.5 mt-0.5 w-fit px-2 py-0.5 bg-emerald-50 rounded-md border border-emerald-100/50">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                  <p className="text-[8px] sm:text-[9px] font-black text-emerald-600 uppercase tracking-widest truncate">
                    {ACCESS_CONTROL[userEmail]} LIVE
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile Logout Button (Visible only on small screens) */}
            <button 
              onClick={handleLogout}
              className="md:hidden flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-red-100 active:bg-red-500 active:text-white transition-colors group"
            >
              Exit
              <svg className="w-3 h-3 group-active:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>

          {/* Center: Premium Glowing Plant Name Display */}
          <div className="w-full md:w-1/3 flex justify-center text-center order-last md:order-none">
            <div className="relative group w-full sm:w-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
              <div className="relative bg-white border border-slate-100 px-5 sm:px-8 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl shadow-sm flex flex-col items-center">
                <p className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5">
                  Active Facility
                </p>
                <h2 className="text-lg sm:text-xl font-black bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent uppercase tracking-tight truncate max-w-[280px] sm:max-w-[400px]">
                  {plantName}
                </h2>
              </div>
            </div>
          </div>

          {/* Right: User Info & Awesome Desktop Logout Button */}
          <div className="hidden md:flex items-center justify-end gap-5 w-1/3">
            <div className="text-right">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Operator ID</p>
              <p className="text-xs font-bold text-slate-700 truncate max-w-[150px]">{userEmail}</p>
            </div>
            
            {/* Awesome Logout Button */}
            <button 
              onClick={handleLogout}
              className="group flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-50 to-rose-50 hover:from-red-500 hover:to-rose-600 text-red-600 hover:text-white rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 border border-red-100 hover:border-transparent hover:shadow-[0_8px_20px_rgba(225,29,72,0.25)] hover:-translate-y-0.5 shrink-0"
            >
              <span>Log Out</span>
              <svg 
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </header>
        {/* --- END OF UPGRADED HEADER --- */}

        <main className="p-4 sm:p-6 md:p-10">
          <RoadContainer userEmail={userEmail} />
        </main>
        
        <footer className="p-6 sm:p-8 text-center bg-white border-t border-slate-100 mt-auto">
          <p className="text-slate-400 text-[8px] sm:text-[9px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em]">
            Internal Use Only • Restricted Access
          </p>
        </footer>
      </div>
    </ProjectProvider>
  );
}

export default App;