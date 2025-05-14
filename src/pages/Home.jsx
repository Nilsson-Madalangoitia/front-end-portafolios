import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import AccountMenu from "../components/AccountMenu";
import ConfirmModal from "../components/ConfirmModal";

function Home() {
  const [input, setInput] = useState("");
  const [responses, setResponses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [precision, setPrecision] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rol, setRol] = useState(null);
  const chatContainerRef = useRef(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);

    try {

      var query = encodeURIComponent(input);
      var url = `https://bkportafolio.fly.dev/api/archivo/consulta?question=${query}`;
      console.log(url)
      var res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        var errorText = await res.text();
        throw new Error(`Error ${res.status}: ${errorText}`);
      }

      var data = await res.json();
      var respuestas = data.data.map(item => item.text).join("\n");
      console.log(respuestas)
      setResponses((prev) => [...prev, { pregunta: input, respuesta: respuestas }]);
      setInput("");
    } catch (err) {
      console.error("❌ Error en consulta:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (item) => setSelected(item);

 

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Botón Panel Admin + Menú de cuenta */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-4">
        {rol === "ADMINISTRADOR" && (
          <button
            onClick={() => navigate("/admin")}
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

      {/* Sidebar */}
      <Sidebar
        history={responses}
        onSelect={handleSelect}
        onClear={() => setShowConfirm(true)}
      />

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
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`flex ${index % 2 === 0 ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`px-4 py-3 rounded-xl max-w-xs shadow ${
                    index % 2 === 0
                      ? "bg-blue-100 text-blue-900"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  <p>
                    <strong>{index % 2 === 0 ? "Consulta:" : "Respuesta:"}</strong>{" "}
                    {index % 2 === 0 ? response.pregunta : response.respuesta}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {selected && (
          <motion.div
            key={selected.pregunta}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-lg mt-8 border"
          >
            <p className="text-sm text-gray-500 mb-2">
              <strong>Consulta seleccionada:</strong> {selected.pregunta}
            </p>
            <p className="text-gray-800">
              <strong>Respuesta:</strong> {selected.respuesta}
            </p>
          </motion.div>
        )}

      </motion.div>
    </div>
  );
}

export default Home;
