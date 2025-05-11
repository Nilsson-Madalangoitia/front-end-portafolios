import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal";

function PortfolioList() {
  const navigate = useNavigate();
  const rol = localStorage.getItem("rol");
  const token = localStorage.getItem("token");

  const [portfolios, setPortfolios] = useState([]);
  const [newPortfolioName, setNewPortfolioName] = useState("");
  const [newYear, setNewYear] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchPortfolios = async () => {
    try {
      const res = await fetch("https://bkportafolio.fly.dev/api/portafolio", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Error ${res.status}: ${err}`);
      }

      const data = await res.json();
      console.log("📁 Portafolios obtenidos:", data.data);
      setPortfolios(data.data);
    } catch (err) {
      console.error("❌ Error al obtener portafolios:", err);
    }
  };

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const handleAddPortfolio = async () => {
    if (!newPortfolioName.trim() || !newYear.trim()) {
      alert("⚠️ Por favor ingresa un nombre y año para el portafolio.");
      return;
    }

    console.log("🟢 Creando portafolio:", { nombre: newPortfolioName, periodo: newYear });

    try {
      const res = await fetch("https://bkportafolio.fly.dev/api/portafolio", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: newPortfolioName,
          periodo: newYear,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Error ${res.status}: ${err}`);
      }

      const data = await res.json();
      setPortfolios((prev) => [...prev, data]);
      setNewPortfolioName("");
      setNewYear("");
    } catch (err) {
      console.error("❌ Error al crear portafolio:", err);
    }
  };

  const handleEditPortfolio = async (id) => {
    console.log("✏️ Editando portafolio:", id, "Nuevo nombre:", editingName);
    try {
      const res = await fetch(`https://bkportafolio.fly.dev/api/portafolio/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre: editingName }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Error ${res.status}: ${err}`);
      }

      setPortfolios((prev) =>
        prev.map((p) => (p._id === id ? { ...p, nombre: editingName } : p))
      );
      setEditingId(null);
    } catch (err) {
      console.error("❌ Error al editar portafolio:", err);
    }
  };

  const handleDeletePortfolio = async () => {
    console.log("🗑️ Eliminando portafolio:", deleteId);
    try {
      const res = await fetch(`https://bkportafolio.fly.dev/api/portafolio/${deleteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Error ${res.status}: ${err}`);
      }

      setPortfolios((prev) => prev.filter((p) => p._id !== deleteId));
      setDeleteId(null);
      setShowConfirm(false);
    } catch (err) {
      console.error("❌ Error al eliminar portafolio:", err);
    }
  };

  const filteredPortfolios = filterYear
    ? portfolios.filter((p) => p.periodo === filterYear)
    : portfolios;

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

        {/* Crear nuevo portafolio */}
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
                {editingId === portfolio._id ? (
                  <>
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="px-3 py-2 border rounded-lg mb-2"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditPortfolio(portfolio._id)}
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
                      onClick={() => navigate(`/portfolio/${portfolio._id}`)}
                      className="text-lg font-semibold text-gray-700 mb-1 truncate"
                    >
                      {portfolio.nombre}
                    </div>
                    <div className="text-sm text-gray-500 mb-4">{portfolio.periodo}</div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setEditingId(portfolio._id);
                          setEditingName(portfolio.nombre);
                        }}
                        className="text-orange-600 hover:underline text-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => {
                          setDeleteId(portfolio._id);
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

      {/* Modal de confirmación */}
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
