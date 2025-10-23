import React from 'react';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onLogout: () => void;
}

const SidebarIcon: React.FC<{ icon: string; isActive: boolean }> = ({ icon, isActive }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 mr-3 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
    </svg>
);

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, isOpen, setIsOpen, onLogout }) => {
  const handleNavigation = (view: string) => {
    setCurrentView(view);
    setIsOpen(false);
  };
    
  const navItems = [
    { name: 'Dashboard', icon: "M4 6h16M4 12h16M4 18h7" },
    { name: 'Orders', icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" },
    { name: 'Produk', icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
    { name: 'Shipment', icon: "M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM2 17h3l2.67-5H15l2.67 5h3M6 12h12" },
    { name: 'Clients', icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
    { name: 'Vendors', icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
    { name: 'Reports', icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  ];

  return (
    <>
      <div className={`fixed inset-0 bg-black/60 z-20 md:hidden ${isOpen ? 'block' : 'hidden'}`} onClick={() => setIsOpen(false)}></div>
      <aside className={`fixed inset-y-0 left-0 bg-gray-800 text-white flex flex-col w-64 transform transition-transform duration-300 ease-in-out z-30
                         md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-20 flex items-center justify-center border-b border-gray-700 flex-shrink-0 px-6">
           <div className="text-center">
            <h1 className="text-2xl font-bold tracking-wider text-white">MEERA</h1>
            <p className="text-xs uppercase tracking-widest text-gray-400">Apparel</p>
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-between overflow-y-auto">
            <nav className="px-4 py-6">
            <ul>
                {navItems.map((item) => (
                <li key={item.name}>
                    <button
                    onClick={() => handleNavigation(item.name)}
                    className={`w-full flex items-center px-4 py-3 my-1 rounded-lg transition-colors duration-200 group ${
                        currentView === item.name
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                    >
                    <SidebarIcon icon={item.icon} isActive={currentView === item.name} />
                    <span className="font-medium">{item.name}</span>
                    </button>
                </li>
                ))}
            </ul>
            </nav>
            <div className="px-4 py-4 border-t border-gray-700">
                <button
                    onClick={onLogout}
                    className="w-full flex items-center px-4 py-3 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white group transition-colors duration-200"
                >
                    <SidebarIcon icon="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" isActive={false} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;