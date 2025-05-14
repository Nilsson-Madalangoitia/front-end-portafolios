import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function DocumentUpload() {
  const { id } = useParams();
  const navigate = useNavigate();
  const rol = localStorage.getItem("rol");
  const token = localStorage.getItem("token");

  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [portfolioName, setPortfolioName] = useState("");

  useEffect(() => {
    fetch(`https://bkportafolio.fly.dev/api/portafolio/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
        return res.json();
      })
      .then((data) => {
        console.log("📘 Portafolio obtenido:", data);
        if (data?.nombre) setPortfolioName(data.nombre);
      })
      .catch((err) => console.error("❌ Error al obtener portafolio:", err));
  }, [id, token]);

  useEffect(() => {
    fetch(`https://bkportafolio.fly.dev/api/archivo/portafolio/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
        return res.json();
      })
      .then((data) => {
        console.log("📂 Archivos subidos:", data);
        setUploadedFiles(data);
      })
      .catch((err) => console.error("❌ Error al obtener archivos:", err));
  }, [id, token]);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      alert("⚠️ Debes seleccionar al menos un archivo.");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("archivo", file));
    formData.append("portafolioId", id);
// https://bkportafolio.fly.dev/api/upload
    try {
      const res = await fetch("https://bkportafolio.fly.dev/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);

      const resultado = await res.json();
      console.log("✅ Respuesta del upload:", resultado);

      const nuevosArchivos = Array.isArray(resultado) ? resultado : [resultado];
      setUploadedFiles((prev) => [...prev, ...nuevosArchivos]);

      setFiles([]);
      setSuccessMessage("✅ ¡Archivos subidos exitosamente!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("❌ Error en la subida:", error);
    }
  };

  const handleCancel = () => setFiles([]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center p-4 relative">
      <div className="absolute top-4 right-4 z-50 flex items-center gap-4">
        {rol === "ADMINISTRADOR" && (
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full shadow hover:bg-blue-700 transition"
          >
            ⬅ Panel Admin
          </button>
        )}
      </div>

      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-8 space-y-6">
        {rol === "ADMINISTRADOR" && (
          <div className="max-w-xl mx-auto bg-yellow-50 border border-yellow-300 text-yellow-800 text-sm rounded-md py-2 px-4 shadow-sm text-center mb-4">
            Estás visualizando el sistema como <span className="font-semibold">Administrador</span>.
          </div>
        )}

        <div className="flex justify-between items-center border-b pb-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Archivos del Portafolio #{id}{" "}
            {portfolioName && <span className="text-blue-600">({portfolioName})</span>}
          </h1>
          <button
            onClick={() => navigate("/my-portfolios")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
          >
            ⬅ Volver
          </button>
        </div>

        {successMessage && (
          <div className="bg-green-100 text-green-700 text-center py-3 rounded-lg font-semibold shadow-md">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleUpload} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-gray-700 font-semibold">Agregar nuevo(s) archivo(s)</label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {files.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-gray-700 font-medium mt-4">Archivos a subir:</h3>
              <ul className="space-y-1">
                {files.map((file, index) => (
                  <li key={index} className="p-2 bg-gray-100 rounded">
                    {file.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

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

        <div className="pt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Archivos subidos</h2>
          {uploadedFiles.length === 0 ? (
            <p className="text-gray-500">No hay archivos en este portafolio.</p>
          ) : (
            <ul className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <li key={index} className="p-2 bg-blue-100 text-blue-800 rounded shadow-sm">
                  {file.nombreOriginal || file.originalName || file.filename || "Archivo"}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default DocumentUpload;
cls