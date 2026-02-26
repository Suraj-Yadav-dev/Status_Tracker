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
      // RESPONSIVE: Reduced mobile padding (p-4 instead of p-12)
      <div className="flex items-center justify-center min-h-screen bg-[#0f172a] font-sans relative overflow-hidden p-4 sm:p-12">
        {/* Background Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[40%] bg-blue-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[40%] bg-emerald-600/10 rounded-full blur-[100px]" />
        
        {/* RESPONSIVE: w-full and max-w-md ensures it stretches on phone but stays contained on desktop */}
        <div className="relative z-10 w-full max-w-md my-auto">
          {/* RESPONSIVE: Changed invalid p-26 to p-6 for mobile, sm:p-10 for desktop */}
          <div className="bg-white/95 backdrop-blur-xl p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20">
            <div className="text-center mb-10 sm:mb-12">
              <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-2xl shadow-lg shadow-blue-200 mb-6 rotate-3 hover:rotate-0 transition-transform duration-300 overflow-hidden">
                <img src="/kp.jpg" alt="KP Logo" className="w-full h-full object-contain" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">
                Reliable Technique
              </h1>
              <p className="text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] mt-3">
                India Private Limited
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
              <div>
                <label className="text-[10px] font-black text-blue-400 uppercase ml-2 sm:ml-4 mb-1 block tracking-widest">
                  Plant Selection
                </label>
                <div className="relative">
                  {/* RESPONSIVE: text-base prevents iOS Safari zoom bug, sm:text-sm for desktop */}
                  <select 
                    required
                    className="w-full p-3.5 sm:p-4 bg-slate-100/50 border-2 border-transparent focus:border-blue-500 rounded-xl sm:rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-base sm:text-sm font-bold text-slate-700 uppercase appearance-none cursor-pointer"
                    value={tempPlantName}
                    onChange={(e) => setTempPlantName(e.target.value)}
                  >
                    <option value="" disabled>-- Select Plant --</option>
                    {PLANT_LIST.map((plant) => (
                      <option key={plant} value={plant}>{plant}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-blue-400 uppercase ml-2 sm:ml-4 mb-1 block tracking-widest">
                  Identity Verification
                </label>
                {/* RESPONSIVE: text-base prevents iOS Safari zoom bug */}
                <input 
                  type="email" 
                  required
                  placeholder="department@plant.com"
                  className={`w-full p-3.5 sm:p-4 bg-slate-100/50 border-2 rounded-xl sm:rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-base sm:text-sm font-bold text-slate-700 ${
                    error ? 'border-red-400 bg-red-50' : 'border-slate-300 focus:border-blue-500'
                  }`}
                  value={tempEmail}
                  onChange={(e) => setTempEmail(e.target.value)}
                />
                {error && (
                  <p className="text-red-500 text-[10px] font-black uppercase tracking-tighter mt-2 ml-2 animate-pulse">
                    ⚠️ {error}
                  </p>
                )}
              </div>

              <button 
                type="submit"
                className="w-full py-3.5 sm:py-4 mt-2 bg-slate-900 hover:bg-blue-600 text-white rounded-xl sm:rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl transition-all duration-300 active:scale-95 group"
              >
                Authenticate <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </form>

            <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-slate-100 text-center">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Active Nodes</p>
              <div className="flex flex-wrap justify-center gap-2">
                {['HR', 'QR', 'FINANCE', 'ADMIN'].map((dept) => (
                  <span key={dept} className="px-3 py-1 bg-slate-100 text-slate-500 text-[9px] font-black rounded-full border border-slate-200">
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
      {/* RESPONSIVE: overflow-x-hidden prevents accidental horizontal scrolling on mobile */}
      <div className="app-container min-h-screen bg-[#f8fafc] overflow-x-hidden flex flex-col">
        
        {/* --- RESPONSIVE HEADER --- */}
        <header className="flex flex-col md:flex-row justify-between items-center px-3 py-3 md:px-10 md:py-5 bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50 gap-3 md:gap-4 w-full">
          
          {/* Logo Section */}
          <div className="flex items-center justify-between w-full md:w-auto md:gap-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl shadow-md border border-slate-100 p-1 shrink-0">
                <img src="/kp.jpg" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <div className="min-w-0"> {/* min-w-0 helps text truncation if needed */}
                <h1 className="text-sm md:text-lg font-black text-slate-800 uppercase leading-none truncate">Plant Tracker</h1>
                <div className="flex items-center gap-1 mt-1 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 w-fit">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shrink-0" />
                  <p className="text-[8px] md:text-[9px] font-black text-emerald-600 uppercase whitespace-nowrap">
                    {ACCESS_CONTROL[userEmail]} LIVE
                  </p>
                </div>
              </div>
            </div>
            {/* Logout for Mobile Only */}
            <button onClick={handleLogout} className="md:hidden p-2 text-red-500 bg-red-50 rounded-lg shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" /></svg>
            </button>
          </div>

          {/* Plant Name (Centered) */}
          <div className="bg-slate-50 border border-slate-100 px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-center w-full md:w-auto">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Facility</p>
            <h2 className="text-xs md:text-base font-black text-slate-800 uppercase truncate">{plantName}</h2>
          </div>

          {/* User Info & Desktop Logout */}
          <div className="hidden md:flex items-center gap-4 shrink-0">
            <div className="text-right">
              <p className="text-[9px] font-black text-slate-400 uppercase">Operator</p>
              <p className="text-xs font-bold text-slate-700">{userEmail}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white rounded-xl text-[10px] font-black uppercase transition-all"
            >
              Log Out
            </button>
          </div>
        </header>

        {/* RESPONSIVE: Reduced padding on mobile (p-2) to maximize space for the flowchart/RoadContainer */}
        <main className="p-2 sm:p-6 lg:p-10 flex-grow w-full">
          <RoadContainer userEmail={userEmail} />
        </main>
        
        <footer className="p-4 md:p-6 text-center bg-white border-t border-slate-100 mt-auto w-full">
          <p className="text-slate-400 text-[8px] md:text-[9px] font-black uppercase tracking-widest">
            Internal Use Only • Restricted Access
          </p>
        </footer>
      </div>
    </ProjectProvider>
  );
}

export default App;