import { motion } from "framer-motion";

function Sidebar({ history, onSelect, onClear }) {
  return (
    <aside className="w-64 bg-blue-50 border-r shadow-md flex flex-col h-screen p-6">
      <h2 className="text-2xl font-extrabold text-blue-700 mb-6 tracking-wide">
        Historial
      </h2>

      <div className="flex-1 overflow-y-auto space-y-4">
        {history.length === 0 ? (
          <p className="text-center text-gray-400 text-sm">Sin consultas recientes.</p>
        ) : (
          history.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={() => onSelect(item)}
                className="w-full text-left p-3 rounded-lg bg-white hover:bg-blue-100 text-blue-700 text-sm font-medium transition shadow-sm"
              >
                {item.pregunta.length > 40 ? item.pregunta.slice(0, 40) + "..." : item.pregunta}
              </button>
            </motion.div>
          ))
        )}
      </div>

      {history.length > 0 && (
        <div className="mt-6">
          <button
            onClick={onClear}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold text-sm transition shadow"
          >
            🗑️ Limpiar historial
          </button>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
