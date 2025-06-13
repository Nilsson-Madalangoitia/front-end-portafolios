import { useState } from "react";
import { useNavigate } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL;

function Login() {
  const [form, setForm] = useState({ correo: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const correo = form.correo.trim().toLowerCase();
    const password = form.password.trim();

    if (!correo || !password) {
      setMensaje("⚠️ Todos los campos son obligatorios.");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(correo)) {
      setMensaje("⚠️ Correo electrónico inválido.");
      return;
    }

    setMensaje("");
    setLoading(true);

    try {
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: correo, password }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ Error al iniciar sesión:", errorText);
        setMensaje("❌ Correo o contraseña incorrectos.");
        setLoading(false);
        return;
      }

      const data = await res.json();

      if (data.token && data.user) {
        // 🔄 Limpiar y guardar datos nuevos
        localStorage.clear();
        localStorage.setItem("token", data.token);
        localStorage.setItem("rol", data.user.rol.nombre);
        localStorage.setItem("correo", data.user.email);
        localStorage.setItem("nombre", data.user.nombre);
        localStorage.setItem("apellido", data.user.apellido);
        localStorage.setItem("userId", data.user.id);

        // ⏰ Guardamos vencimiento de token (1 hora)
        const expiry = new Date().getTime() + 60 * 60 * 1000;
        localStorage.setItem("tokenExpiry", expiry);

        setMensaje(`✅ ¡Bienvenido ${data.user.rol.nombre}!`);

        // Redirigir según el rol
        setTimeout(() => {
          if (data.user.rol.nombre === "ADMINISTRADOR") {
            navigate("/admin/home");
          } else if (data.user.rol.nombre === "DOCENTE") {
            navigate("/docente/dashboard");
          } else {
            navigate("/");
          }
        }, 1500);
      } else {
        setMensaje("❌ Datos inválidos en la respuesta del servidor.");
      }
    } catch (error) {
      console.error("❌ Error en el login:", error);
      setMensaje("❌ Error de conexión al servidor.");
    }

    setLoading(false);
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
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
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
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
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
          <p
            className={`text-sm text-center mt-2 font-medium ${
              mensaje.includes("✅")
                ? "text-green-600"
                : mensaje.includes("❌") || mensaje.includes("⚠️")
                ? "text-red-600"
                : "text-gray-600"
            }`}
          >
            {mensaje}
          </p>
        )}
      </div>
    </div>
  );
}

export default Login;
