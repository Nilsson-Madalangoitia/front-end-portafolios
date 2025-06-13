import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL;

function DocumentUpload() {
  const { id } = useParams();
  const navigate = useNavigate();
  const rol = localStorage.getItem("rol");
  const token = localStorage.getItem("token");
  const correo = localStorage.getItem("correo");
  const userId = localStorage.getItem("userId"); // 🟢 ID del usuario logueado

  // Estados para archivos, feedback y navegación UI
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [portfolioName, setPortfolioName] = useState("");
  const [semanaSeleccionada, setSemanaSeleccionada] = useState(1);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Teoría");
  const [semanaActiva, setSemanaActiva] = useState(null);
  const [categoriaActiva, setCategoriaActiva] = useState(null);
  const [archivoAEliminar, setArchivoAEliminar] = useState(null);

  const categorias = ["Teoría", "Práctica", "Laboratorio"];
  const fileInputRef = useRef(null);

  // 🟢 Cargar el nombre del portafolio
  useEffect(() => {
    fetch(`${apiUrl}/portafolio/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
        return res.json();
      })
      .then((data) => {
        if (data?.data?.nombre) setPortfolioName(data.data.nombre);
      })
      .catch((err) => console.error("❌ Error al obtener portafolio:", err));
  }, [id, token]);

  // 🟢 Cargar archivos del portafolio
  useEffect(() => {
    fetch(`${apiUrl}/archivo/portafolio/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
        return res.json();
      })
      .then((data) => {
        const archivos = data.data || [];
        // Solo muestra archivos propios si es DOCENTE
        const filtrados =
          rol === "DOCENTE" ? archivos.filter((f) => f.usuario === correo) : archivos;
        setUploadedFiles(filtrados);
      })
      .catch((err) => console.error("❌ Error al obtener archivos:", err));
  }, [id, token, rol, correo]);

  // 🟢 Cambia archivos seleccionados para subir
  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  // 🟢 SUBIR archivos al backend
  const handleUpload = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      alert("⚠️ Debes seleccionar al menos un archivo.");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("file", file);
      formData.append("nombre", file.name);
      formData.append("tipo", "pdf");
    });

    formData.append("portafolio", id);
    formData.append("semana", semanaSeleccionada);
    formData.append("categoria", categoriaSeleccionada);
    formData.append("creadoPor", userId); // ⚡️ AGREGA EL ID DEL USUARIO LOGUEADO

    try {
      const res = await fetch(`${apiUrl}/archivo`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        if (errorText.includes("already exists")) {
          throw new Error("❌ El archivo ya existe. Cambia el nombre y vuelve a intentarlo.");
        }
        throw new Error(`Error ${res.status}: ${errorText}`);
      }

      const resultado = await res.json();
      const nuevosArchivos = Array.isArray(resultado.data)
        ? resultado.data
        : [resultado.data];

      setUploadedFiles((prev) => [...prev, ...nuevosArchivos]);
      setFiles([]);
      fileInputRef.current.value = "";
      setSuccessMessage("✅ ¡Archivos subidos exitosamente!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("❌ Error en la subida:", error.message);
      setErrorMessage(error.message);
      setTimeout(() => setErrorMessage(""), 4000);
    }
  };

  // 🟢 CANCELA la selección de archivos
  const handleCancel = () => {
    setFiles([]);
    fileInputRef.current.value = "";
  };

  // 🟢 Devuelve archivos para semana/categoría seleccionadas
  const obtenerArchivos = (semana, categoria) => {
    return uploadedFiles.filter((f) => f.semana === semana && f.categoria === categoria);
  };

  // 🟢 Elimina archivo del backend y la lista local
  const eliminarArchivo = async () => {
    const archivoId = archivoAEliminar._id || archivoAEliminar.id;
    if (!archivoId) {
      alert("❌ ID de archivo no válido.");
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/archivo/${archivoId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Error al eliminar");

      setUploadedFiles((prev) => prev.filter((f) => (f._id || f.id) !== archivoId));
      setArchivoAEliminar(null);
      setSuccessMessage("✅ Archivo eliminado exitosamente.");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("❌ Error al eliminar archivo:", err);
      alert("Error al eliminar el archivo.");
      setArchivoAEliminar(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 p-4">
      {/* Mensajes flotantes */}
      {successMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded shadow-lg z-50">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded shadow-lg z-50">
          {errorMessage}
        </div>
      )}

      {/* Modal de confirmación para eliminar */}
      {archivoAEliminar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md animate-fadeIn">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              ¿Deseas eliminar este archivo?
            </h2>
            <p className="text-gray-600 mb-6">{archivoAEliminar.nombre}</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setArchivoAEliminar(null)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
              >
                Cancelar
              </button>
              <button
                onClick={eliminarArchivo}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Botón de regreso */}
      <div className="flex justify-end mb-4">
        {rol === "ADMINISTRADOR" && (
          <button
            onClick={() => navigate("/admin")}
            className="bg-blue-600 text-white px-4 py-2 rounded-full shadow hover:bg-blue-700 transition"
          >
            ⬅ Panel Admin
          </button>
        )}
      </div>

      {/* Contenedor principal */}
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8 space-y-6">
        <div className="flex justify-between items-center border-b pb-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Archivos del Portafolio{" "}
            {portfolioName && <span className="text-blue-600">({portfolioName})</span>}
          </h1>
          <button
            onClick={() => navigate("/my-portfolios")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
          >
            ⬅ Volver
          </button>
        </div>

        {/* FORMULARIO DE SUBIDA */}
        <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-semibold text-gray-700">Semana</label>
            <select
              value={semanaSeleccionada}
              onChange={(e) => setSemanaSeleccionada(Number(e.target.value))}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {[...Array(16)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  Semana {i + 1}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-gray-700">Categoría</label>
            <select
              value={categoriaSeleccionada}
              onChange={(e) => setCategoriaSeleccionada(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {categorias.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-2">
            <label className="block font-semibold text-gray-700">Selecciona archivos</label>
            <input
              type="file"
              multiple
              ref={fileInputRef}
              onChange={handleFileChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {files.length > 0 && (
            <div className="col-span-2 space-y-2">
              <h3 className="text-gray-700 font-medium">Archivos a subir:</h3>
              <ul className="space-y-1">
                {files.map((file, index) => (
                  <li key={index} className="p-2 bg-gray-100 rounded">
                    {file.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="col-span-2 flex gap-4">
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

        {/* LISTADO DE ARCHIVOS */}
        <div className="pt-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Explora tus archivos</h2>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-2 mb-6">
            {[...Array(12)].map((_, i) => (
              <button
                key={i + 1}
                className={`px-3 py-2 rounded-full text-sm font-semibold transition border ${
                  semanaActiva === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-white text-blue-600 border-blue-600 hover:bg-blue-100"
                }`}
                onClick={() => {
                  setSemanaActiva(i + 1);
                  setCategoriaActiva(null);
                }}
              >
                Semana {i + 1}
              </button>
            ))}
          </div>

          {semanaActiva && (
            <div className="space-y-4">
              <div className="flex gap-4 mb-4 flex-wrap">
                {categorias.map((cat) => (
                  <button
                    key={cat}
                    className={`px-4 py-2 rounded-full font-medium transition border ${
                      categoriaActiva === cat
                        ? "bg-orange-500 text-white"
                        : "bg-white text-orange-500 border-orange-500 hover:bg-orange-100"
                    }`}
                    onClick={() => setCategoriaActiva(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {categoriaActiva && (
                <div className="bg-gray-100 p-4 rounded-lg shadow-inner">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">
                    Archivos: Semana {semanaActiva} - {categoriaActiva}
                  </h4>
                  <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                    {obtenerArchivos(semanaActiva, categoriaActiva).length === 0 ? (
                      <li>No hay archivos subidos.</li>
                    ) : (
                      obtenerArchivos(semanaActiva, categoriaActiva).map((file, idx) => (
                        <li key={idx} className="flex justify-between items-center">
                          <a
                            href={file.url || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="text-blue-600 hover:underline truncate max-w-[80%]"
                          >
                            {file.nombre || file.nombreOriginal || file.originalName || file.filename || "Archivo"}
                          </a>
                          <button
                            onClick={() => setArchivoAEliminar(file)}
                            className="ml-3 text-red-500 hover:text-red-700 font-bold"
                            title="Eliminar archivo"
                          >
                            ❌
                          </button>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DocumentUpload;
