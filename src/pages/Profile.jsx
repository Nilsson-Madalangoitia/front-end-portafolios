import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

function Profile() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const rol = localStorage.getItem("rol");

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    password: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    fetch(`${apiUrl}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then((data) => {
        setForm((prev) => ({
          ...prev,
          nombre: data.user.nombre || "",
          apellido: data.user.apellido || "",
        }));
      })
      .catch((err) => {
        console.error("❌ Error al obtener perfil:", err);
        setMensaje("❌ No se pudo cargar tu perfil.");
      });
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre || !form.apellido) {
      setMensaje("⚠️ Nombre y apellido son obligatorios.");
      return;
    }

    if (!userId) {
      setMensaje("❌ Usuario no identificado.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre: form.nombre,
          apellido: form.apellido,
        }),
      });

      if (!res.ok) throw new Error(await res.text());

      setMensaje("✅ Cambios guardados correctamente.");
    } catch (err) {
      console.error("❌ Error al guardar perfil:", err);
      setMensaje("❌ Error al guardar cambios.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!form.password || !form.newPassword || !form.confirmNewPassword) {
      setMensaje("⚠️ Todos los campos son obligatorios.");
      return;
    }

    if (form.newPassword !== form.confirmNewPassword) {
      setMensaje("⚠️ Las contraseñas no coinciden.");
      return;
    }

    if (!userId) {
      setMensaje("❌ Usuario no identificado.");
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/user/${userId}/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword: form.password,
          newPassword: form.newPassword,
        }),
      });

      if (!res.ok) throw new Error(await res.text());

      setMensaje("✅ Contraseña actualizada.");
      setShowPasswordModal(false);
      setForm({ ...form, password: "", newPassword: "", confirmNewPassword: "" });
    } catch (err) {
      console.error("❌ Error al cambiar contraseña:", err);
      setMensaje("❌ Error al cambiar contraseña.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4 relative">
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

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6">
        {rol === "ADMINISTRADOR" && (
          <div className="max-w-sm mx-auto bg-yellow-50 border border-yellow-300 text-yellow-800 text-sm rounded-md py-2 px-4 shadow-sm text-center">
            Estás visualizando el sistema como <span className="font-semibold">Administrador</span>.
          </div>
        )}

        <h2 className="text-3xl font-bold text-center text-blue-700">Editar Perfil</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-1">Nombres</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tu nombre"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Apellidos</label>
            <input
              type="text"
              name="apellido"
              value={form.apellido}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tu apellido"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white font-semibold transition ${
              loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Guardando..." : "Guardar cambios"}
          </button>
        </form>

        {mensaje && (
          <p className="text-center text-sm font-medium text-red-500">{mensaje}</p>
        )}

        <div className="text-center mt-4">
          <button
            onClick={() => setShowPasswordModal(true)}
            className="text-orange-500 hover:text-orange-600 font-semibold"
          >
            Cambiar contraseña
          </button>
        </div>

        <button
          onClick={() => navigate("/")}
          className="block mx-auto mt-6 text-blue-600 hover:underline text-sm"
        >
          ⬅ Volver al inicio
        </button>

        {showPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-80 space-y-4 shadow-lg">
              <h3 className="text-lg font-bold text-center text-blue-700">Cambiar contraseña</h3>
              <form onSubmit={handlePasswordChange} className="space-y-3">
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Contraseña actual"
                  className="w-full px-4 py-2 border rounded-lg"
                />
                <input
                  type="password"
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  placeholder="Nueva contraseña"
                  className="w-full px-4 py-2 border rounded-lg"
                />
                <input
                  type="password"
                  name="confirmNewPassword"
                  value={form.confirmNewPassword}
                  onChange={handleChange}
                  placeholder="Confirmar nueva contraseña"
                  className="w-full px-4 py-2 border rounded-lg"
                />
                <div className="flex justify-between items-center pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="text-gray-500 hover:text-gray-700 text-sm"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-4 py-2 rounded-lg"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
