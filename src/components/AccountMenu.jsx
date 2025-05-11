import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AccountMenu({ onManage, onLogout }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate();

  const nombre = localStorage.getItem("nombre") || "Usuario";
  const inicial = nombre.charAt(0).toUpperCase();

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
        onClick={() => setOpen(!open)}
        className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-full shadow hover:bg-blue-700 transition"
      >
        <span className="font-semibold">{nombre}</span>
        <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center text-white font-bold">
          {inicial}
        </div>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white border rounded-xl shadow-lg overflow-hidden z-50">
          <button
            onClick={() => {
              onManage();
              setOpen(false);
            }}
            className="w-full text-left px-4 py-3 text-blue-600 hover:bg-blue-50 font-semibold"
          >
            Gestionar cuenta
          </button>
          <button
            onClick={() => {
              navigate("/my-portfolios");
              setOpen(false);
            }}
            className="w-full text-left px-4 py-3 text-blue-600 hover:bg-blue-50 font-semibold"
          >
            Mis portafolios
          </button>
          <button
            onClick={() => {
              onLogout();
              setOpen(false);
            }}
            className="w-full text-left px-4 py-3 text-gray-500 hover:bg-gray-100 font-semibold"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}

export default AccountMenu;
