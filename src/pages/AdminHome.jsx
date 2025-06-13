import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AccountMenu from "../components/AccountMenu"; // ✅ Mismo componente usado en otras vistas

function AdminHome() {
  const navigate = useNavigate();
  const rol = localStorage.getItem("rol");
  const token = localStorage.getItem("token");

  // ✅ Verificación de autenticación y rol
  useEffect(() => {
    if (!token || rol !== "ADMINISTRADOR") {
      navigate("/login");
    }
  }, [token, rol, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-100 p-8 relative">
      {/* 🔲 Barra superior con botones de cuenta y navegación */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-4">
        

        {/* ⚙️ Menú de cuenta (perfil y cerrar sesión) */}
        <AccountMenu
          onManage={() => navigate("/profile")} // 🔧 Editar perfil
          onLogout={() => {
            localStorage.clear();
            navigate("/login"); // 🔒 Cerrar sesión
          }}
        />
      </div>

      {/* 🟨 Mensaje de rol actual */}
      <div className="bg-yellow-100 text-yellow-800 border border-yellow-300 rounded px-4 py-2 text-center text-sm shadow max-w-md mx-auto mb-6">
        Estás visualizando el sistema como <strong>Administrador</strong>.
      </div>

      {/* 🧭 Título principal */}
      <h1 className="text-4xl font-bold text-gray-800 text-center mb-10">
        Panel del Administrador
      </h1>

      {/* 🧩 Accesos rápidos en tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mx-auto">
        {/* 👥 Gestión de usuarios */}
        <button
          onClick={() => navigate("/admin")}
          className="bg-white border border-gray-300 rounded-xl shadow p-6 hover:bg-blue-50 transition text-center"
        >
          <h2 className="text-2xl font-semibold text-blue-700 mb-2">👥 Gestionar Usuarios</h2>
          <p className="text-gray-600 text-sm">
            Registra, edita y elimina docentes desde esta sección.
          </p>
        </button>

        {/* 📁 Gestión de portafolios */}
        <button
          onClick={() => navigate("/my-portfolios")}
          className="bg-white border border-gray-300 rounded-xl shadow p-6 hover:bg-green-50 transition text-center"
        >
          <h2 className="text-2xl font-semibold text-green-700 mb-2">📁 Ver Portafolios</h2>
          <p className="text-gray-600 text-sm">
            Visualiza, crea y gestiona portafolios de todos los docentes.
          </p>
        </button>

        {/* 🔍 Consultas de archivos */}
        <button
          onClick={() => navigate("/home")}
          className="bg-white border border-gray-300 rounded-xl shadow p-6 hover:bg-orange-50 transition text-center"
        >
          <h2 className="text-2xl font-semibold text-orange-700 mb-2">🔍 Consultas</h2>
          <p className="text-gray-600 text-sm">
            Realiza búsquedas semánticas y accede a documentos cargados.
          </p>
        </button>
      </div>
    </div>
  );
}

export default AdminHome;
