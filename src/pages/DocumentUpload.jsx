import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

function DocumentUpload() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [inputKey, setInputKey] = useState(0); // 🔥 Clave para recrear el input file

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const handleUpload = (e) => {
    e.preventDefault();

    if (selectedFiles.length === 0) {
      alert("⚠️ Debes seleccionar al menos un archivo.");
      return;
    }

    setUploadedFiles(prev => [...prev, ...selectedFiles]);
    setSelectedFiles([]);
    setInputKey(prev => prev + 1); // 🔥 Esto limpia el input de verdad

    setSuccessMessage("✅ ¡Archivos subidos exitosamente!");

    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  const handleCancel = () => {
    setSelectedFiles([]);
    setInputKey(prev => prev + 1); // 🔥 También limpia si cancela
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-8 space-y-6">

        {/* ✅ Alerta para Administrador */}
        {localStorage.getItem("rol") === "Administrador" && (
          <div className="max-w-xl mx-auto bg-yellow-50 border border-yellow-300 text-yellow-800 text-sm rounded-md py-2 px-4 shadow-sm text-center mb-4">
            Estás visualizando el sistema como <span className="font-semibold">Administrador</span>.
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4">
          <h1 className="text-2xl font-bold text-gray-800">Archivos del Portafolio #{id}</h1>
          <button
            onClick={() => navigate("/my-portfolios")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
          >
            ⬅ Volver
          </button>
        </div>

        {/* Mensaje de éxito */}
        {successMessage && (
          <div className="bg-green-100 text-green-700 text-center py-3 rounded-lg font-semibold shadow-md">
            {successMessage}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleUpload} className="space-y-6">

          <div className="space-y-2">
            <label className="block text-gray-700 font-semibold">
              Agregar nuevo(s) archivo(s)
            </label>
            <input
              key={inputKey}
              type="file"
              multiple
              onChange={handleFileChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-gray-700 font-medium mt-4">Archivos a subir:</h3>
              <ul className="space-y-1">
                {selectedFiles.map((file, index) => (
                  <li key={index} className="p-2 bg-gray-100 rounded flex justify-between items-center">
                    {file.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Botones */}
          <div className="flex space-x-4">
            <button
              type="submit"
              className="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded transition"
            >
              Subir archivos
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="w-full py-2 bg-gray-400 hover:bg-gray-500 text-white rounded transition"
            >
              Cancelar
            </button>
          </div>

        </form>

        {/* Archivos subidos */}
        {uploadedFiles.length > 0 && (
          <div className="pt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Archivos subidos</h2>
            <ul className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <li key={index} className="p-2 bg-blue-100 text-blue-800 rounded shadow-sm">
                  {file.name}
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>
    </div>
  );
}

export default DocumentUpload;
