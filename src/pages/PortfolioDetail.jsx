import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function PortfolioDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [portfolioName, setPortfolioName] = useState("");

  // Obtener nombre del portafolio desde localStorage
  useEffect(() => {
    const stored = localStorage.getItem("portfolios");
    if (stored) {
      const parsed = JSON.parse(stored);
      const current = parsed.find((p) => p.id === Number(id));
      if (current) {
        setPortfolioName(current.nombre);
      }
    }
  }, [id]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const formattedFiles = selectedFiles.map((file) => ({
      file,
      newName: file.name,
    }));
    setFiles(formattedFiles);
  };

  const handleNameChange = (index, newName) => {
    const updatedFiles = [...files];
    updatedFiles[index].newName = newName;
    setFiles(updatedFiles);
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
  };

  const handleUpload = () => {
    if (files.length === 0) return;
    setUploadedFiles((prev) => [...prev, ...files]);
    setFiles([]);
  };

  const handleCancel = () => {
    setFiles([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 p-6 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-xl p-8 space-y-8 border border-gray-200">

        {/* ✅ Aviso para Administrador */}
        {localStorage.getItem("rol") === "Administrador" && (
          <div className="max-w-xl mx-auto bg-yellow-50 border border-yellow-300 text-yellow-800 text-sm rounded-md py-2 px-4 shadow-sm text-center mb-4">
            Estás visualizando el sistema como <span className="font-semibold">Administrador</span>.
          </div>
        )}

        {/* Encabezado */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">
            Archivos del Portafolio #{id}
            {portfolioName && (
              <span className="ml-2 text-blue-600">({portfolioName})</span>
            )}
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            ⬅ Volver
          </button>
        </div>

        {/* Sección para agregar archivos */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Agregar nuevo(s) archivo(s)</h2>
          <div className="space-y-4">
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="border p-2 rounded-lg w-full"
            />

            {files.length > 0 && (
              <div className="space-y-4">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <input
                      type="text"
                      value={file.newName}
                      onChange={(e) => handleNameChange(index, e.target.value)}
                      className="flex-1 border rounded-lg px-3 py-2"
                    />
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}

                <div className="flex gap-4">
                  <button
                    onClick={handleUpload}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold"
                  >
                    Subir archivo(s)
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-2 rounded-lg font-semibold"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <hr className="my-4" />

        {/* Archivos subidos */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Archivos subidos</h2>
          {uploadedFiles.length === 0 ? (
            <p className="text-gray-500 text-center">No hay archivos en este portafolio.</p>
          ) : (
            <ul className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <li key={index} className="border p-3 rounded-lg text-gray-700">
                  {file.newName}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default PortfolioDetail;
