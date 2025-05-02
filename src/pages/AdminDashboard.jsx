import { useNavigate } from "react-router-dom";
import { useState } from "react";

function AdminDashboard() {
  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState([
    { id: 1, nombre: "Nilsson", apellido: "Madalangoitia", correo: "admin@email.com", contraseña: "123456", rol: "Administrador" },
    { id: 2, nombre: "Diego", apellido: "Ugaz", correo: "docente1@email.com", contraseña: "1234", rol: "Docente" },
  ]);

  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    contraseña: "",
    rol: "Docente",
  });

  const [editandoId, setEditandoId] = useState(null);

  const handleSalir = () => {
    localStorage.removeItem("correo");
    localStorage.removeItem("rol");
    navigate("/login");
  };

  const handleIrAlHome = () => {
    navigate("/");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoUsuario((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegistrar = (e) => {
    e.preventDefault();
    if (!nuevoUsuario.nombre || !nuevoUsuario.apellido || !nuevoUsuario.correo || !nuevoUsuario.contraseña) {
      alert("Por favor, llena todos los campos.");
      return;
    }
    const nuevoId = usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) + 1 : 1;
    const nuevo = { ...nuevoUsuario, id: nuevoId };
    setUsuarios([...usuarios, nuevo]);
    setNuevoUsuario({ nombre: "", apellido: "", correo: "", contraseña: "", rol: "Docente" });
  };

  const handleEditar = (id) => {
    const usuario = usuarios.find((u) => u.id === id);
    setNuevoUsuario(usuario);
    setEditandoId(id);
  };

  const handleActualizar = (e) => {
    e.preventDefault();
    setUsuarios(usuarios.map((u) => (u.id === editandoId ? { ...nuevoUsuario, id: editandoId } : u)));
    setNuevoUsuario({ nombre: "", apellido: "", correo: "", contraseña: "", rol: "Docente" });
    setEditandoId(null);
  };

  const handleEliminar = (id) => {
    if (confirm("¿Estás seguro que deseas eliminar este usuario?")) {
      setUsuarios(usuarios.filter((u) => u.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Título */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Panel de Administración</h1>
          <div className="flex gap-2">
            <button
              onClick={handleIrAlHome}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Ir al Home
            </button>
            <button
              onClick={handleSalir}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Cerrar sesión
            </button>
          </div>
        </div>

        {/* Formulario Registro / Edición */}
        <div className="bg-white shadow rounded-lg p-6 mb-10">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            {editandoId ? "Editar Docente" : "Registrar Docente"}
          </h2>
          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            onSubmit={editandoId ? handleActualizar : handleRegistrar}
          >
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={nuevoUsuario.nombre}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              type="text"
              name="apellido"
              placeholder="Apellido"
              value={nuevoUsuario.apellido}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              type="email"
              name="correo"
              placeholder="Correo"
              value={nuevoUsuario.correo}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              type="password"
              name="contraseña"
              placeholder="Contraseña"
              value={nuevoUsuario.contraseña}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <select
              name="rol"
              value={nuevoUsuario.rol}
              onChange={handleChange}
              className="border p-2 rounded"
              disabled
            >
              <option value="Docente">Docente</option>
              <option value="Administrador">Administrador</option>
            </select>
            <button
              type="submit"
              className="bg-blue-600 text-white rounded p-2 hover:bg-blue-700 transition"
            >
              {editandoId ? "Actualizar Docente" : "Registrar Docente"}
            </button>
          </form>
        </div>

        {/* Lista de Usuarios */}
        <div className="bg-white shadow rounded-lg p-6 mb-10">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Docentes Registrados</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">ID</th>
                  <th className="py-3 px-6 text-left">Nombre</th>
                  <th className="py-3 px-6 text-left">Apellido</th>
                  <th className="py-3 px-6 text-left">Correo</th>
                  <th className="py-3 px-6 text-center">Rol</th>
                  <th className="py-3 px-6 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm font-light">
                {usuarios
                  .sort((a, b) =>
                    a.rol === "Administrador" ? -1 : b.rol === "Administrador" ? 1 : 0
                  )
                  .map((usuario) => (
                    <tr key={usuario.id} className="border-b border-gray-200 hover:bg-gray-100">
                      <td className="py-3 px-6 text-left">{usuario.id}</td>
                      <td className="py-3 px-6 text-left">{usuario.nombre}</td>
                      <td className="py-3 px-6 text-left">{usuario.apellido}</td>
                      <td className="py-3 px-6 text-left">{usuario.correo}</td>
                      <td className="py-3 px-6 text-center">{usuario.rol}</td>
                      <td className="py-3 px-6 text-center space-x-2">
                        <button
                          onClick={() => handleEditar(usuario.id)}
                          className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                        >
                          Editar
                        </button>
                        {usuario.rol !== "Administrador" && (
                          <button
                            onClick={() => handleEliminar(usuario.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            Eliminar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
