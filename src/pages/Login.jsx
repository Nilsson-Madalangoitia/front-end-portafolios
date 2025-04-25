import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({ correo: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.correo || !form.password) {
      setMensaje("Todos los campos son obligatorios.");
      return;
    }

    if (!form.correo.includes("@")) {
      setMensaje("Correo inválido.");
      return;
    }

    setMensaje("");
    setLoading(true);

    setTimeout(() => {
      if (form.correo === "admin@email.com" && form.password === "123456") {
        setMensaje("✅ ¡Inicio de sesión exitoso!");

        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        setMensaje("❌ Correo o contraseña incorrectos.");
      }

      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">Iniciar Sesión</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-600 mb-1">Correo electrónico</label>
            <input
              type="email"
              name="correo"
              value={form.correo}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="correo@email.com"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Contraseña</label>
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
            {loading ? "Verificando..." : "Iniciar Sesión"}
          </button>
        </form>

        {mensaje && (
          <p className={`text-sm text-center ${mensaje.includes("✅") ? "text-green-600" : "text-red-600"}`}>
            {mensaje}
          </p>
        )}

        <p className="text-sm text-center text-gray-600">
          ¿No tienes cuenta? <a href="/register" className="text-blue-600 hover:underline">Regístrate</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
