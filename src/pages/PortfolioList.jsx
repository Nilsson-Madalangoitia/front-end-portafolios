import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal";

const apiUrl = import.meta.env.VITE_API_URL;

function PortfolioList() {
  const navigate = useNavigate();
  const rol = localStorage.getItem("rol");
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId"); // <-- ID del usuario logueado

  // Estados
  const [portfolios, setPortfolios] = useState([]);
  const [newPortfolioName, setNewPortfolioName] = useState("");
  const [newYear, setNewYear] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterName, setFilterName] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Obtiene y filtra portafolios al cargar
  const fetchPortfolios = async () => {
    try {
      const res = await fetch(`${apiUrl}/portafolio`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();

      // - Admin ve todos
      // - Docente solo ve los que creó él (por id)
      const filteredByUser = data.data.filter((p) =>
        rol === "ADMINISTRADOR"
          ? true
          : (
              (typeof p.creadoPor === "string" && p.creadoPor === userId) ||
              (typeof p.creadoPor === "object" && p.creadoPor?.id === userId) ||
              (p.usuario && p.usuario._id === userId)
            )
      );
      setPortfolios(filteredByUser);
    } catch (err) {
      console.error("❌ Error al obtener portafolios:", err);
    }
  };

  useEffect(() => {
    fetchPortfolios();
    // eslint-disable-next-line
  }, []);

  // Crear portafolio nuevo
  const handleAddPortfolio = async () => {
    if (!newPortfolioName.trim() || !newYear.trim()) {
      alert("⚠️ Por favor ingresa un nombre y año para el portafolio.");
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/portafolio`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: newPortfolioName,
          periodo: newYear,
          creadoPor: userId, // importante!
        }),
      });

      if (!res.ok) throw new Error(await res.text());

      await fetchPortfolios();

      setNewPortfolioName("");
      setNewYear("");
    } catch (err) {
      console.error("❌ Error al crear portafolio:", err);
    }
  };

  // Editar nombre del portafolio
  const handleEditPortfolio = async (id) => {
    try {
      const res = await fetch(`${apiUrl}/portafolio/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre: editingName }),
      });

      if (!res.ok) throw new Error(await res.text());

      await fetchPortfolios();
      setEditingId(null);
    } catch (err) {
      console.error("❌ Error al editar portafolio:", err);
    }
  };

  // Eliminar portafolio
  const handleDeletePortfolio = async () => {
    try {
      const res = await fetch(`${apiUrl}/portafolio/${deleteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(await res.text());

      await fetchPortfolios();
      setDeleteId(null);
      setShowConfirm(false);
    } catch (err) {
      console.error("❌ Error al eliminar portafolio:", err);
    }
  };

  // Filtro por nombre y año
  const filteredPortfolios = portfolios.filter(
    (p) =>
      (!filterYear || p.periodo === filterYear) &&
      (!filterName || p.nombre.toLowerCase().includes(filterName.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 relative">
      <div className="absolute top-4 right-4 z-50 flex items-center gap-4">
        {rol === "ADMINISTRADOR" && (
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full shadow hover:bg-blue-700 transition"
          >
            ⬅ Panel Admin
          </button>
        )}
      </div>

      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-6 space-y-8">
        {rol === "ADMINISTRADOR" && (
          <div className="max-w-xl mx-auto bg-yellow-50 border border-yellow-300 text-yellow-800 text-sm rounded-md py-2 px-4 shadow-sm text-center mb-4">
            Estás visualizando el sistema como <span className="font-semibold">Administrador</span>.
          </div>
        )}

        <h1 className="text-3xl font-bold text-gray-800 text-center">Mis Portafolios</h1>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Filtrar por nombre"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="Filtrar por periodo"
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* Formulario de nuevo portafolio */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">Agregar nuevo portafolio</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <input
              type="text"
              placeholder="Nombre del portafolio"
              value={newPortfolioName}
              onChange={(e) => setNewPortfolioName(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              placeholder="Año (Ej: 2025-I)"
              value={newYear}
              onChange={(e) => setNewYear(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-400"
            />
            <button
              onClick={handleAddPortfolio}
              className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Crear
            </button>
          </div>
        </div>

        {/* Lista de portafolios */}
        {filteredPortfolios.length === 0 ? (
          <p className="text-center text-gray-500 mt-6">Aún no tienes portafolios creados.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {filteredPortfolios.map((portfolio) => (
              <div
                key={portfolio._id}
                className="flex flex-col justify-between border p-4 rounded-xl bg-gray-100 hover:bg-gray-200 transition cursor-pointer"
              >
                {editingId === portfolio.id ? (
                  <>
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="px-3 py-2 border rounded-lg mb-2"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditPortfolio(portfolio.id)}
                        className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="flex-1 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                      >
                        Cancelar
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      onClick={() => navigate(`/portfolio/${portfolio.id}`)}
                      className="text-lg font-semibold text-gray-700 mb-1 truncate"
                    >
                      {portfolio.nombre}
                    </div>
                    <div className="text-sm text-gray-500 mb-1">{portfolio.periodo}</div>
                    {rol === "ADMINISTRADOR" && portfolio.usuario?.email && (
                      <div className="text-xs text-gray-500 italic mb-2">
                        Docente: {portfolio.usuario.email}
                      </div>
                    )}
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setEditingId(portfolio.id);
                          setEditingName(portfolio.nombre);
                        }}
                        className="text-orange-600 hover:underline text-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => {
                          setDeleteId(portfolio.id);
                          setShowConfirm(true);
                        }}
                        className="text-red-600 hover:underline text-sm"
                      >
                        Eliminar
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de confirmación para eliminar */}
      {showConfirm && (
        <ConfirmModal
          message="¿Estás seguro de eliminar este portafolio?"
          onConfirm={handleDeletePortfolio}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}

export default PortfolioList;
