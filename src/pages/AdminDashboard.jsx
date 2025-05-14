import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AccountMenu from "../components/AccountMenu";

function AdminDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");

  const [usuarios, setUsuarios] = useState([]);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    rol: "680ec523f6bc85c713d73d5c",
  });
  const [editandoId, setEditandoId] = useState(null);

  const fetchUsuarios = async () => {
    try {
      const res = await fetch("https://bkportafolio.fly.dev/api/user", {
      
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },

      });
    
       if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error ${res.status}: ${errorText}`);
      }
      const data = await res.json();
      setUsuarios(data.data);
    } catch (err) {
      console.error("❌ Error al obtener usuarios:", err);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoUsuario((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegistrar = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://bkportafolio.fly.dev/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(nuevoUsuario),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error ${res.status}: ${errorText}`);
      }

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

  const handleEditar = (usuario) => {
    console.log(usuario)
    setEditandoId(usuario.id);
    setNuevoUsuario({
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      password: "sistemas",
      rol: usuario.rol.id,
    });
  };

  const handleActualizar = async (e) => {
    e.preventDefault();
    try {
      console.log(editandoId)
      console.log(nuevoUsuario)
      const res = await fetch(`https://bkportafolio.fly.dev/api/user/${editandoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(nuevoUsuario),
        
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error ${res.status}: ${errorText}`);
      }

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

  const handleEliminar = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este usuario?")) return;
    try {
      const res = await fetch(`https://bkportafolio.fly.dev/api/user/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error ${res.status}: ${errorText}`);
      }

      fetchUsuarios();
    } catch (err) {
      console.error("❌ Error al eliminar:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 relative">
      <div className="absolute top-4 right-4 z-50 flex items-center gap-4">
        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 text-white px-4 py-2 rounded-full shadow hover:bg-blue-700 transition"
        >
          ⬅ Volver al inicio
        </button>
        <AccountMenu
          onManage={() => navigate("/profile")}
          onLogout={() => {
            localStorage.clear();
            navigate("/login");
          }}
        />
      </div>

      {rol === "ADMINISTRADOR" && (
        <div className="max-w-xl mx-auto bg-yellow-50 border border-yellow-300 text-yellow-800 text-sm rounded-md py-2 px-4 shadow-sm text-center mb-6">
          Estás visualizando el sistema como <span className="font-semibold">Administrador</span>.
        </div>
      )}

      <div className="max-w-5xl mx-auto space-y-10">
        {/* Formulario */}
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

        {/* Lista */}
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
