import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal";
import AccountMenu from "../components/AccountMenu";

const apiUrl = import.meta.env.VITE_API_URL;

function MyPortfolios() {
  const navigate = useNavigate();
  const rol = localStorage.getItem("rol");
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  // Estados para crear y filtrar portafolios
  const [portfolios, setPortfolios] = useState([]);
  const [newPortfolioName, setNewPortfolioName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newYear, setNewYear] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const [editingYear, setEditingYear] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterName, setFilterName] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Obtiene y filtra portafolios según el usuario (Admin ve todos, docente ve solo los suyos)
  const fetchPortfolios = async () => {
    try {
      const res = await fetch(`${apiUrl}/portafolio`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();

      // Filtrar solo los portafolios con estado 'activo' o sin estado (compatibilidad hacia atrás)
      const filtered = data.data
        .filter(p => !("estado" in p) || p.estado === "activo")
        .filter((p) =>
          rol === "ADMINISTRADOR"
            ? true
            : (
                (typeof p.creadoPor === "string" && p.creadoPor === userId) ||
                (typeof p.creadoPor === "object" && p.creadoPor?.id === userId) ||
                (p.usuario && p.usuario._id === userId)
              )
        );

      setPortfolios(filtered);
    } catch (err) {
      console.error("❌ Error al obtener portafolios:", err);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
    fetchPortfolios();
    // eslint-disable-next-line
  }, []);

  // Crear portafolio nuevo
  const handleAddPortfolio = async () => {
    if (!newPortfolioName.trim() || !newDescription.trim() || !newYear.trim()) {
      alert("⚠️ Por favor ingresa nombre, descripción y año para el portafolio.");
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
          descripcion: newDescription,
          anio: newYear,
          creadoPor: userId,
        }),
      });

      if (!res.ok) throw new Error(await res.text());

      await fetchPortfolios();
      setNewPortfolioName("");
      setNewDescription("");
      setNewYear("");
    } catch (err) {
      console.error("❌ Error al crear portafolio:", err);
      alert("Error al crear portafolio: Verifica los campos. Todos son requeridos.");
    }
  };

  // Editar portafolio completo (nombre, descripción y año)
  const handleEditPortfolio = async (id) => {
    try {
      const res = await fetch(`${apiUrl}/portafolio/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: editingName,
          descripcion: editingDescription,
          anio: editingYear,
        }),
      });

      if (!res.ok) throw new Error(await res.text());

      await fetchPortfolios();
      setEditingId(null);
    } catch (err) {
      console.error("❌ Error al editar portafolio:", err);
    }
  };

  // Eliminar portafolio (soft delete)
  const handleDeletePortfolio = async () => {
    console.log("Ejecutando handleDeletePortfolio con deleteId:", deleteId);
    try {
      const res = await fetch(`${apiUrl}/portafolio/${deleteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
     console.log("Ejecutando handleDeletePortfolio con deleteId:", deleteId);
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
      (!filterYear || p.anio === filterYear) &&
      (!filterName || p.nombre.toLowerCase().includes(filterName.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 relative">
      {/* ESQUINA SUPERIOR DERECHA: Inicio + AccountMenu */}
      <div className="absolute top-4 right-4 z-50 flex gap-2">
        <button
          onClick={() => navigate("/docente/dashboard")}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full shadow hover:bg-blue-700 transition"
        >
          ⬅ Inicio
        </button>
        <AccountMenu />
      </div>

      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-6 space-y-8">
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
            placeholder="Filtrar por año"
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* Formulario de nuevo portafolio */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">Agregar nuevo portafolio</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <input
              type="text"
              placeholder="Nombre del portafolio"
              value={newPortfolioName}
              onChange={(e) => setNewPortfolioName(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              placeholder="Descripción"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-400"
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
                key={portfolio.id}
                className="flex flex-col justify-between border p-4 rounded-xl bg-gray-100 hover:bg-gray-200 transition cursor-pointer"
              >
                {/* Si se está editando este portafolio, muestra el formulario */}
                {editingId === portfolio.id ? (
                  <>
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="px-3 py-2 border rounded-lg mb-2"
                      placeholder="Nombre"
                    />
                    <input
                      type="text"
                      value={editingDescription}
                      onChange={(e) => setEditingDescription(e.target.value)}
                      className="px-3 py-2 border rounded-lg mb-2"
                      placeholder="Descripción"
                    />
                    <input
                      type="text"
                      value={editingYear}
                      onChange={(e) => setEditingYear(e.target.value)}
                      className="px-3 py-2 border rounded-lg mb-2"
                      placeholder="Año"
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
                    {/* Portafolio visualización */}
                    <div
                      onClick={() => navigate(`/portfolio/${portfolio.id}`)}
                      className="text-lg font-semibold text-gray-700 mb-1 truncate"
                    >
                      {portfolio.nombre}
                    </div>
                    <div className="text-sm text-gray-500 mb-1">{portfolio.anio}</div>
                    <div className="text-xs text-gray-600 mb-2 truncate">{portfolio.descripcion}</div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setEditingId(portfolio.id);
                          setEditingName(portfolio.nombre);
                          setEditingDescription(portfolio.descripcion || "");
                          setEditingYear(portfolio.anio || "");
                        }}
                        className="text-orange-600 hover:underline text-sm"
                      >
                        Editar
                      </button>
                     <button
                        onClick={() => {
                          console.log("Quiero eliminar", portfolio.id);
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
      isOpen={showConfirm} // ¡Prop correcto!
      title="Eliminar portafolio"
      message="¿Estás seguro de eliminar este portafolio?"
     onConfirm={handleDeletePortfolio}
     onCancel={() => setShowConfirm(false)}
     dangerLabel="Eliminar"
  />
)}

    </div>
  );
}

export default MyPortfolios;
