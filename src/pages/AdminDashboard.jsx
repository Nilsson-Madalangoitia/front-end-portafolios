import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AccountMenu from "../components/AccountMenu";
import * as bcrypt from "bcryptjs";

const apiUrl = import.meta.env.VITE_API_URL;

function AdminDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");

  // Redirigir si no hay token
  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchUsuarios();
    }
  }, []);

  // Estados principales
  const [usuarios, setUsuarios] = useState([]);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    rol: "680ec523f6bc85c713d73d5c", // ID del rol docente
  });
  const [editandoId, setEditandoId] = useState(null);

  // Obtener usuarios desde el backend
  const fetchUsuarios = async () => {
    try {
      const res = await fetch(`${apiUrl}/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setUsuarios(data.data);
    } catch (err) {
      console.error("❌ Error al obtener usuarios:", err);
    }
  };

  // Actualizar campos de formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoUsuario((prev) => ({ ...prev, [name]: value }));
  };

  // Registrar nuevo usuario
  const handleRegistrar = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${apiUrl}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(nuevoUsuario),
      });
      if (!res.ok) throw new Error(await res.text());
      setNuevoUsuario({
        nombre: "",
        apellido: "",
        email: "",
        password: "",
        rol: "680ec523f6bc85c713d73d5c",
      });
      fetchUsuarios();
    } catch (err) {
      console.error("❌ Error al registrar:", err);
    }
  };

  // Preparar edición de usuario
  const handleEditar = (usuario) => {
    setEditandoId(usuario.id);
    setNuevoUsuario({
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      password: "",
      rol: usuario.rol.id,
    });
  };

  // Actualizar usuario
  const handleActualizar = async (e) => {
    e.preventDefault();
    try {
      const data = {
        nombre: nuevoUsuario.nombre,
        apellido: nuevoUsuario.apellido,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol,
      };

      if (nuevoUsuario.password.trim() !== "") {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(nuevoUsuario.password, salt);
        data.password = hash;
      }

      const res = await fetch(`${apiUrl}/user/${editandoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error(await res.text());

      setEditandoId(null);
      setNuevoUsuario({
        nombre: "",
        apellido: "",
        email: "",
        password: "",
        rol: "",
      });
      fetchUsuarios();
    } catch (err) {
      console.error("❌ Error al actualizar:", err);
    }
  };

  // Eliminar usuario
  const handleEliminar = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este usuario?")) return;
    try {
      const res = await fetch(`${apiUrl}/user/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(await res.text());
      fetchUsuarios();
    } catch (err) {
      console.error("❌ Error al eliminar:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 relative">
      {/* 🔵 Botones superiores a la izquierda */}
     
      <div className="absolute top-4 right-4 z-50 flex items-center gap-4">
        <div className="flex gap-4">
        <button
          onClick={() => navigate("/home")}
          className="bg-blue-600 text-white px-4 py-2 rounded-full shadow hover:bg-blue-700 transition"
           >
          🔍 Ir a Buscador
        </button>
        <button
          onClick={() => navigate("/admin/home")}
          className="bg-orange-500 text-white px-4 py-2 rounded-full shadow hover:bg-orange-600 transition"
            >
          📂 Home de Admin
        </button>
      </div>
  
  {/* 🔒 Botones y menú de cuenta en la esquina superior derecha */}
  <AccountMenu
    onManage={() => navigate("/profile")}
    onLogout={() => {
      localStorage.clear();
      navigate("/login");
    }}
  />
</div>


      {/* Mensaje de rol */}
      {rol === "ADMINISTRADOR" && (
        <div className="max-w-sm mx-auto bg-yellow-50 border border-yellow-300 text-yellow-800 text-sm rounded-md py-2 px-4 shadow-sm text-center mb-6">
          Estás visualizando el sistema como <span className="font-semibold">Administrador</span>.
        </div>
      )}

      <div className="max-w-5xl mx-auto space-y-10">
        {/* 🟢 Formulario de registro / edición */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {editandoId ? "Editar Docente" : "Registrar Docente"}
          </h2>
          <form
            onSubmit={editandoId ? handleActualizar : handleRegistrar}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={nuevoUsuario.nombre}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              name="apellido"
              placeholder="Apellido"
              value={nuevoUsuario.apellido}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Correo"
              value={nuevoUsuario.email}
              onChange={handleChange}
              className="border p-2 rounded"
              required
              disabled={!!editandoId}
            />
            <input
              type="password"
              name="password"
              placeholder={editandoId ? "Nueva contraseña (opcional)" : "Contraseña"}
              value={nuevoUsuario.password}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white rounded p-2 hover:bg-blue-700 transition col-span-1 md:col-span-2"
            >
              {editandoId ? "Actualizar Docente" : "Registrar Docente"}
            </button>
          </form>
        </div>

        {/* 🗂 Lista de usuarios */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Docentes Registrados</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-3 text-left">Nombre</th>
                  <th className="p-3 text-left">Apellido</th>
                  <th className="p-3 text-left">Correo</th>
                  <th className="p-3 text-center">Rol</th>
                  <th className="p-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.id} className="border-t">
                    <td className="p-3">{u.nombre}</td>
                    <td className="p-3">{u.apellido}</td>
                    <td className="p-3">{u.email}</td>
                    <td className="p-3 text-center">{u.rol?.nombre}</td>
                    <td className="p-3 text-center space-x-2">
                      <button
                        onClick={() => handleEditar(u)}
                        className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                      >
                        Editar
                      </button>
                      {u.rol?.nombre !== "ADMINISTRADOR" && (
                        <button
                          onClick={() => handleEliminar(u.id)}
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
