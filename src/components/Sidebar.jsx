import { useState } from "react";

function Sidebar({ history, onSelect }) {
  const handleClearHistory = () => {
    // Mostrar confirmación antes de borrar
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar todo el historial?");
    if (confirmDelete) {
      // Llamar a la función para borrar el historial
      onSelect([]);  // Limpiar historial
      alert("Historial eliminado correctamente");
    }
  };

  return (
    <div className="w-64 bg-white shadow-md h-screen p-4 overflow-y-auto border-r">
       <button
        onClick={handleClearHistory}
        className="mt-4 w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
      >
        Eliminar historial
      </button>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Historial</h2>
      <p className="text-sm font-semibold text-gray-500 mb-4">Selecciona una pregunta del historial para ver la respuesta.</p>

       {history.length === 0 ? (
       <p className="text-gray-500 text-sm mb-4">No hay preguntas recientes.</p>
      ) : (
        <ul className="space-y-2">
          {history.map((item, index) => (
            <li
              key={index}
              className="p-2 bg-gray-100 rounded-md hover:bg-blue-100 cursor-pointer"
              onClick={() => onSelect(item)}
            >
              {item.pregunta}
            </li>
          ))}
        </ul>
      )}

      {/* Botón para eliminar historial */}
     
    </div>
  );
}

export default Sidebar;
