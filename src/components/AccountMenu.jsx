import { useState, useRef, useEffect } from "react";

function AccountMenu({ onManage, onClear, onLogout }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
        onClick={() => setOpen(!open)}
      >
        <span className="font-semibold">Nilsson</span>
        <img
          src="https://ui-avatars.com/api/?name=N&background=0D8ABC&color=fff"
          alt="avatar"
          className="w-8 h-8 rounded-full"
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border shadow-lg rounded-md z-50">
          <button onClick={onManage} className="block w-full px-4 py-2 text-left hover:bg-gray-100">
            Gestionar cuenta
          </button>
          <button onClick={onLogout} className="block w-full px-4 py-2 text-left hover:bg-gray-100">
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}

export default AccountMenu;
