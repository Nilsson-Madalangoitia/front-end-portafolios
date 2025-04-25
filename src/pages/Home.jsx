import { useState } from "react";
import Sidebar from "../components/Sidebar";
import AccountMenu from "../components/AccountMenu";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Home() {
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const [responses, setResponses] = useState([]);
  const [selected, setSelected] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const nuevaPregunta = {
      pregunta: input,
      respuesta: "Respuesta simulada...", 
    };

    setResponses((prev) => [...prev, nuevaPregunta]);
    setInput("");
  };

  const handleSelect = (item) => {
    setSelected(item);
  };

  
  const scrollToBottom = () => {
    const chatContainer = document.getElementById("chat-container");
    chatContainer.scrollTop = chatContainer.scrollHeight;
  };


  if (responses.length > 0) {
    scrollToBottom();
  }

  return (
    <div className="flex min-h-screen">
      <div className="absolute top-4 right-4 z-50">
        <AccountMenu
          onManage={() => navigate("/profile")}
          onClear={() => setResponses([])}
          onLogout={() => alert("Cerrar sesión")}
        />
      </div>

      <Sidebar history={responses} onSelect={handleSelect} />

      <motion.div
        className="flex-1 p-4 sm:p-8 bg-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Sistema de Portafolios</h1>

        <form onSubmit={handleSubmit} className="w-full max-w-2xl flex space-x-2 mb-8">
          <input
            type="text"
            placeholder="Escribe tu consulta..."
            className="flex-grow px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Consultar
          </button>
        </form>

        <div id="chat-container" className="space-y-4 overflow-y-auto h-96">
          {responses.map((response, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className={`flex ${index % 2 === 0 ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-xs mb-2 ${
                  index % 2 === 0 ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                }`}
              >
                <p>
                  <strong>{index % 2 === 0 ? "Consulta:" : "Respuesta:"}</strong> {index % 2 === 0 ? response.pregunta : response.respuesta}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        { }
        {selected ? (
          <motion.div
            key={selected.pregunta}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow" 
          >
            <p className="text-sm text-gray-600 mb-2"><strong>Consulta:</strong> {selected.pregunta}</p>
            <p className="text-gray-800"><strong>Respuesta:</strong> {selected.respuesta}</p>
          </motion.div>
        ) : (
          <p className="text-gray-500">Selecciona una pregunta del historial para ver la respuesta.</p>
        )}
      </motion.div>
    </div>
  );
}

export default Home;
