import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function MyPortfolios() {
  const navigate = useNavigate();
  const rol = localStorage.getItem("rol");
  const token = localStorage.getItem("token");

  const [portfolios, setPortfolios] = useState([]);
  const [newPortfolio, setNewPortfolio] = useState({ nombre: "", periodo: "2025-I" });
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({ nombre: "", periodo: "2025-I" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [portfolioToDelete, setPortfolioToDelete] = useState(null);

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
      setPortfolios(data.data);
    } catch (err) {
      console.error("❌ Error al obtener portafolios:", err);
    }
  };

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const handleCreate = async () => {
    if (!newPortfolio.nombre.trim()) {
      alert("⚠️ El nombre del portafolio es obligatorio.");
      return;
    }

    try {
      const res = await fetch("https://bkportafolio.fly.dev/api/portafolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          descripcion: newPortfolio.nombre,
          anio: newPortfolio.periodo,
          nombre: newPortfolio.nombre,
          
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setNewPortfolio({ nombre: "", periodo: "2025-I" });
        fetchPortfolios();
      } else {
        alert(data.message || "❌ Error al crear portafolio.");
      }
    } catch (error) {
      console.error("❌ Error al crear portafolio:", error);
    }
  };

  const handleEditClick = (portfolio) => {
    setEditingId(portfolio.id);
    setEditingData({  nombre: portfolio.descripcion, periodo: portfolio.anio });
  };

  const handleSaveEdit = async (id) => {
    if (!editingData.nombre.trim()) {
      alert("⚠️ El nombre del portafolio no puede estar vacío.");
      return;
    }

    try {
      const res = await fetch(`https://bkportafolio.fly.dev/api/portafolio/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          descripcion: editingData.nombre,
          nombre: editingData.nombre,
          anio: editingData.periodo,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Error ${res.status}: ${err}`);
      }

      fetchPortfolios();
      setEditingId(null);
    } catch (error) {
      console.error("❌ Error al editar portafolio:", error);
    }
  };

  const handleDelete = async () => {
    try {
      console.log(portfolioToDelete) 
      const res = await fetch(
        `https://bkportafolio.fly.dev/api/portafolio/${portfolioToDelete}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Error ${res.status}: ${err}`);
      }

      fetchPortfolios();
      setShowDeleteModal(false);
    } catch (error) {
      console.error("❌ Error al eliminar portafolio:", error);
    }
  };

  const handleGoToPortfolio = (id) => {
    navigate(`/portfolio/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 p-8">
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

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 space-y-8 border border-gray-200">
        {rol === "ADMINISTRADOR" && (
          <div className="max-w-xl mx-auto bg-yellow-50 border border-yellow-300 text-yellow-800 text-sm rounded-md py-2 px-4 shadow-sm text-center mb-4">
            Estás visualizando el sistema como <span className="font-semibold">Administrador</span>.
          </div>
        )}

        <h1 className="text-3xl font-bold text-center text-gray-800">Mis Portafolios</h1>

        <div className="border-b pb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Agregar nuevo portafolio</h2>
          <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
            <input
              type="text"
              placeholder="Nombre del portafolio"
              value={newPortfolio.nombre}
              onChange={(e) =>
                setNewPortfolio({ ...newPortfolio, nombre: e.target.value })
              }
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              value={newPortfolio.periodo}
              onChange={(e) =>
                setNewPortfolio({ ...newPortfolio, periodo: e.target.value })
              }
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-400"
            />
            <button
              onClick={handleCreate}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Crear
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {portfolios.length === 0 ? (
            <p className="text-gray-500 text-center">Aún no tienes portafolios creados.</p>
          ) : (
            portfolios.map((p) => (
              <div
                key={p.id}
                className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg bg-blue-50 hover:shadow-md transition"
              >
                {editingId === p.id ? (
                  <div className="flex-1 flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <input
                      type="text"
                      value={editingData.nombre}
                      onChange={(e) =>
                        setEditingData({ ...editingData, nombre: e.target.value })
                      }
                      className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 flex-1"
                    />
                    <input
                      type="text"
                      value={editingData.periodo}
                      onChange={(e) =>
                        setEditingData({ ...editingData, periodo: e.target.value })
                      }
                      className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-400"
                    />
                  </div>
                ) : (
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => handleGoToPortfolio(p.id)}
                  >
                    <p className="font-semibold text-blue-800">{p.descripcion}</p>
                    <p className="text-sm text-gray-500">{p.anio}</p>
                  </div>
                )}

                <div className="flex space-x-2 mt-4 md:mt-0">
                  {editingId === p.id ? (
                    <>
                      <button
                        onClick={() => handleSaveEdit(p.id)}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditClick(p)}
                        className="px-4 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => {
                          setPortfolioToDelete(p.id);
                          setShowDeleteModal(true);
                        }}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      >
                        Eliminar
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-center text-gray-800">
              ¿Seguro que deseas eliminar este portafolio?
            </h3>
            <div className="flex justify-center space-x-4 mt-4">
              <button
                onClick={handleDelete}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Eliminar
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyPortfolios;
