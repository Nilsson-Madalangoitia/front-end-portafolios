import { useNavigate } from "react-router-dom";
import AccountMenu from "../components/AccountMenu";

function DocenteDashboard() {
  const navigate = useNavigate();

  // 🔐 Cierra sesión limpiando localStorage
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // 👤 Redirige a gestión de cuenta (/profile)
  const handleManage = () => {
    navigate("/profile");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white p-6">
      {/* 🔝 Encabezado con título y menú de cuenta */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-800">Bienvenido Docente</h1>
        <AccountMenu onManage={handleManage} onLogout={handleLogout} />
      </div>

      {/* 📂 Opciones principales del docente */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 🔹 Botón para acceder a portafolios */}
        <div
          className="bg-white border-l-4 border-blue-500 shadow p-6 rounded-xl cursor-pointer hover:shadow-lg transition"
          onClick={() => navigate("/my-portfolios")}
        >
          <h2 className="text-xl font-semibold text-blue-700">Mis Portafolios</h2>
          <p className="text-sm text-gray-600 mt-2">
            Visualiza, crea y edita tus portafolios académicos.
          </p>
        </div>

        {/* 🔍 Botón para ir al buscador de archivos */}
        <div
          className="bg-white border-l-4 border-green-500 shadow p-6 rounded-xl cursor-pointer hover:shadow-lg transition"
          onClick={() => navigate("/home")}
        >
          <h2 className="text-xl font-semibold text-green-700">Consultas</h2>
          <p className="text-sm text-gray-600 mt-2">
            Realiza consultas en los portafolios.
          </p>
        </div>
      </div>
    </div>
  );
}

export default DocenteDashboard;
