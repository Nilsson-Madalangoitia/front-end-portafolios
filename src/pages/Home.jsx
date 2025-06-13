import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AccountMenu from "../components/AccountMenu";

const apiUrl = import.meta.env.VITE_API_URL;

function Home() {
  const [input, setInput] = useState("");
  const [responses, setResponses] = useState([]);
  const [precision, setPrecision] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rol, setRol] = useState(null);
  const chatContainerRef = useRef(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    setRol(localStorage.getItem("rol"));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    console.log("[Consulta] Iniciando búsqueda...");

    try {
      const query = encodeURIComponent(input);
      const url = `${apiUrl}/archivo/consulta?question=${query}&userid=683b982f973ccc3423b5a95f`;
      console.log("[Consulta] URL:", url);

      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("[Consulta] Status:", res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("[Consulta] Error en respuesta:", errorText);
        throw new Error(`Error ${res.status}: ${errorText}`);
      }

      const data = await res.json();
      console.log("[Consulta] Data recibida:", data);

      let respuestaFinal = "⚠️ No se encontró ninguna respuesta relevante.";
      if (data.data && data.data.length > 0) {
        respuestaFinal = data.data.map((item) => item.text).join("\n");
      }

      setResponses((prev) => [
        ...prev,
        { pregunta: input, respuesta: respuestaFinal },
      ]);
      setPrecision(data.data[0].score || 0);
      setInput("");
    } catch (err) {
      console.error("❌ Error en consulta:", err);
      setResponses((prev) => [
        ...prev,
        { pregunta: input, respuesta: `❌ Error en consulta: ${err.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Panel Admin + Menú de cuenta */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-4">
        {rol === "ADMINISTRADOR" && (
          <button
            onClick={() => navigate("/admin/home")}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full shadow hover:bg-blue-700 transition"
          >
            ⬅ Panel Admin
          </button>
        )}
        <AccountMenu
          onManage={() => navigate("/profile")}
          onLogout={() => {
            localStorage.clear();
            navigate("/login");
          }}
        />
      </div>
      {/* Panel Docente + Menú de cuenta */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-4">
        {rol === "DOCENTE" && (
          <button
            onClick={() => navigate("/docente/dashboard")}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full shadow hover:bg-blue-700 transition"
          >
            ⬅ Inicio
          </button>
        )}
        <AccountMenu
          onManage={() => navigate("/profile")}
          onLogout={() => {
            localStorage.clear();
            navigate("/login");
          }}
        />
      </div>

      {/* Contenido principal */}
      <motion.div
        className="flex-1 flex flex-col p-8 space-y-6 bg-white shadow-lg rounded-tl-3xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {rol === "ADMINISTRADOR" && (
          <div className="max-w-xl mx-auto bg-yellow-50 border border-yellow-300 text-yellow-800 text-sm rounded-md py-2 px-4 shadow-sm text-center mb-4">
            Estás visualizando el sistema como <span className="font-semibold">Administrador</span>.
          </div>
        )}

        <div className="text-center mb-2">
          <h1 className="text-4xl font-extrabold text-blue-700 tracking-wide">
            Sistema de Portafolios Académicos
          </h1>
        </div>

        {precision !== null && (
          <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl shadow text-center">
            <p className="text-xl font-bold text-orange-600">
              🔍 Precisión de Recuperación: {precision}%
            </p>
            <p className="text-sm text-orange-500">Basado en consultas recientes.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full max-w-2xl flex space-x-2 mb-8">
          <input
            type="text"
            placeholder="Escribe tu consulta..."
            className="flex-grow px-4 py-2 rounded-lg border border-blue-300 focus:ring-2 focus:ring-blue-400 bg-white text-gray-700 shadow"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 rounded-lg text-white font-semibold shadow transition ${
              loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Consultando..." : "Consultar"}
          </button>
        </form>

        <div
          ref={chatContainerRef}
          className="flex-1 space-y-4 overflow-y-auto bg-gray-100 rounded-lg shadow-inner p-6 border"
        >
          {responses.length === 0 ? (
            <p className="text-center text-gray-400">No hay consultas recientes.</p>
          ) : (
            responses.map((response, index) => (
              <div key={index} className="space-y-2">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-start"
                >
                  <div className="px-4 py-3 rounded-xl max-w-xl shadow bg-blue-100 text-blue-900">
                    <p><strong>Consulta:</strong> {response.pregunta}</p>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-end"
                >
                  <div className="px-4 py-3 rounded-xl max-w-xl shadow bg-orange-100 text-orange-700">
                    <p><strong>Respuesta:</strong> {response.respuesta}</p>
                  </div>
                </motion.div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default Home;
