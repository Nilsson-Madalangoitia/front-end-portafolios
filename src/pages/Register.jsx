import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.nombre || !form.apellido || !form.correo || !form.password) {
      setMensaje("Por favor completa todos los campos.");
      return;
    }

    if (!form.correo.includes("@")) {
      setMensaje("Correo electrónico inválido.");
      return;
    }

    setMensaje("");
    setLoading(true);

   
    setTimeout(() => {
      setLoading(false);
      setMensaje("✅ ¡Registro exitoso!");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">Crear una cuenta</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-600 mb-1">Nombre</label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              type="text"
              placeholder="Tu nombre"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Apellido</label>
            <input
              name="apellido"
              value={form.apellido}
              onChange={handleChange}
              type="text"
              placeholder="Tu apellido"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Correo electrónico</label>
            <input
              name="correo"
              value={form.correo}
              onChange={handleChange}
              type="email"
              placeholder="tucorreo@email.com"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Contraseña</label>
            <input
              name="password"
              value={form.password}
              onChange={handleChange}
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white transition ${
              loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </form>

        {mensaje && (
          <p className={`text-sm text-center ${mensaje.includes("✅") ? "text-green-600" : "text-red-600"}`}>
            {mensaje}
          </p>
        )}

        <p className="text-sm text-center text-gray-600">
          ¿Ya tienes una cuenta?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Inicia sesión
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;
