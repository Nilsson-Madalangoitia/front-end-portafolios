import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate(); 

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    password: "",
    imagen: null,
  });

  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imagen") {
      setForm({ ...form, imagen: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.nombre || !form.apellido) {
      setMensaje("⚠️ Nombre y apellido son obligatorios.");
      return;
    }

    if (form.password && form.password.length < 6) {
      setMensaje("⚠️ La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setMensaje("");
    setLoading(true);

    
    setTimeout(() => {
      setLoading(false);
      setMensaje("✅ Cambios guardados correctamente.");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">Editar perfil</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600 mb-1">Imagen de perfil</label>
            <input
              type="file"
              name="imagen"
              accept="image/*"
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Tu nombre"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Apellido</label>
            <input
              type="text"
              name="apellido"
              value={form.apellido}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Tu apellido"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Nueva contraseña</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white transition ${
              loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Guardando..." : "Guardar cambios"}
          </button>
        </form>

        {mensaje && (
          <p className={`text-sm text-center ${mensaje.includes("✅") ? "text-green-600" : "text-red-600"}`}>
            {mensaje}
          </p>
        )}

        <button
          onClick={() => navigate("/")}
          className="block mx-auto mt-4 text-blue-600 hover:underline"
        >
          ⬅ Volver al inicio
        </button>
      </div>
    </div>
  );
}

export default Profile;
