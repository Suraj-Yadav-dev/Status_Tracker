import React, { useState } from 'react';
import RoadContainer from './components/road/RoadContainer';
import { ProjectProvider, ACCESS_CONTROL } from './context/ProjectContext'; 
import './App.css';

// Define your list of plants here
const PLANT_LIST = [
  "SDL SIKRI",
  "VAPL SIKRI-2",
  "SHANKAR FORGE",
  "RICO BAWAL",
  "SUNBEAM TAPUKHERA",
  "POLYPLASTIC-BHIWADI",
  "BHUNIT PALWAL",
  "VICTORA DHATIR",
  "SKH MANESER PLANT 2",
  "VAPL BAWAL-1",
  "MATJET",
  "CUTTING EDGE DHATIR",
  "VICTORA BAWAL",
  "BHAGWATI TECHNO",
  "NIROTECH",
  "SKH-1",
  "SATA VIKAS",
  "MT AUTOCRAFT ROHTAK",
  "SUNBEAM BAWAL",
  "KML",
  "POLYPLASTIC-TAMIL NAIDU",
  "VAPL PRITHLA",
  "VAPL PATHREDI",
  "VAPL DHATIR B.O.P",
  "VIBRO CAUSTIC",
  "NOIDA GLOBAL",
  "SKH-4",
  "PANCHKULA STEEL",
  "JRG"
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

    // Check if email is valid AND if they selected a plant
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
      <div className="flex items-center justify-center min-h-screen bg-[#0f172a] font-sans relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/10 rounded-full blur-[120px]" />
        
        <div className="relative z-10 w-full max-w-md px-6">
          <div className="bg-white/95 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20">
            
            {/* Logo Section */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg shadow-blue-200 mb-6 rotate-3 hover:rotate-0 transition-transform duration-300 overflow-hidden">
                <img 
                  src="/kp.jpg" 
                  alt="KP Logo" 
                  className="w-full h-full object-contain" 
                />
              </div>
              <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">
                Reliable Technique
              </h1>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mt-3">
                India Private Limited
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              
              {/* Plant Selection Dropdown */}
              <div className="relative">
                <label className="text-[10px] font-black text-blue-400 uppercase ml-4 mb-1 block tracking-widest">
                  Plant Selection
                </label>
                <div className="relative">
                  <select 
                    required
                    className="w-full p-4 bg-slate-100/50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-slate-700 uppercase appearance-none cursor-pointer"
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
                  {/* Custom Arrow Icon */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    ▼
                  </div>
                </div>
              </div>

              {/* Email Input */}
              <div className="relative">
                <label className="text-[10px] font-black text-blue-400 uppercase ml-4 mb-1 block tracking-widest">
                  Identity Verification
                </label>
                <input 
                  type="email" 
                  required
                  placeholder="department@plant.com"
className={`w-full p-4 bg-slate-100/50 border-2 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-slate-700 placeholder:text-slate-300 ${
  error ? 'border-red-400 bg-red-50' : 'border-slate-300 focus:border-blue-500'
}`}
                  value={tempEmail}
                  onChange={(e) => setTempEmail(e.target.value)}
                />
                {error && (
                  <div className="flex items-center gap-2 mt-2 ml-2">
                    <span className="text-red-500 text-[10px] font-black uppercase tracking-tighter animate-bounce">
                      ⚠️ {error}
                    </span>
                  </div>
                )}
              </div>

              <button 
                type="submit"
                className="w-full py-4 mt-2 bg-slate-900 hover:bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-3 group"
              >
                Authenticate
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </form>

            {/* Department Badges UI */}
            <div className="mt-10 pt-8 border-t border-slate-100">
              <p className="text-[9px] font-black text-slate-400 uppercase text-center mb-4 tracking-widest">
                Active Access Nodes
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {['HR', 'QR', 'FINANCE', 'ADMIN'].map((dept) => (
                  <span key={dept} className="px-3 py-1 bg-slate-100 text-slate-500 text-[9px] font-black rounded-full border border-slate-200">
                    {dept}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <p className="text-center mt-8 text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] opacity-50">
            Secure Terminal 2026-X4
          </p>
        </div>
      </div>
    );
  }

  return (
    // Pass plantName to the provider so it loads the correct data
    <ProjectProvider userEmail={userEmail} setUserEmail={setUserEmail} plantName={plantName}>
      <div className="app-container min-h-screen bg-[#f8fafc]">
        {/* Navigation Header */}
        <header className="flex justify-between items-center px-8 py-5 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)] sticky top-0 z-50">
          
          {/* Left: App Logo & Dept */}
          <div className="flex items-center gap-4 w-1/3">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-xl">P</div>
            <div>
              <h1 className="text-lg font-black text-slate-800 uppercase tracking-tight">Plant Tracker</h1>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Live: {ACCESS_CONTROL[userEmail]}</p>
              </div>
            </div>
          </div>

          {/* Center: Plant Name Display */}
          <div className="w-1/3 flex justify-center text-center">
            <div className="bg-blue-50 border border-blue-100 px-6 py-2 rounded-2xl shadow-sm">
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-0.5">
                Active Facility
              </p>
              <h2 className="text-xl font-black text-blue-900 uppercase tracking-tight">
                {plantName}
              </h2>
            </div>
          </div>

          {/* Right: User Info & Logout */}
          <div className="flex items-center justify-end gap-6 w-1/3">
            <div className="hidden md:block text-right">
              <p className="text-[9px] font-black text-slate-400 uppercase">Operator ID</p>
              <p className="text-xs font-bold text-slate-700">{userEmail}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-200 border border-red-100 hover:border-red-500"
            >
              Log Out
            </button>
          </div>
        </header>

        <main className="p-6 md:p-10">
          <RoadContainer userEmail={userEmail} />
        </main>
        
        <footer className="p-8 text-center bg-white border-t border-slate-100">
          <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.4em]">
            Internal Use Only • Restricted Access
          </p>
        </footer>
      </div>
    </ProjectProvider>
  );
}

export default App;