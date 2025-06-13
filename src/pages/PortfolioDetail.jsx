import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

function PortfolioDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const rol = localStorage.getItem("rol");
  const token = localStorage.getItem("token");
  const correo = localStorage.getItem("correo");

  const [portfolioName, setPortfolioName] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [files, setFiles] = useState([]);
  const [semana, setSemana] = useState(1);
  const [categoria, setCategoria] = useState("Teoría");
  const [successMessage, setSuccessMessage] = useState("");
  const categorias = ["Teoría", "Práctica", "Laboratorio"];
  const sectionRef = useRef(null);

  useEffect(() => {
    fetch(`${apiUrl}/portafolio/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then((data) => {
        if (data?.data?.descripcion) setPortfolioName(data.data.descripcion);
      })
      .catch((err) => console.error("❌ Error al obtener portafolio:", err));
  }, [id, token]);

  useEffect(() => {
    fetch(`${apiUrl}/archivo/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then((data) => {
        if (rol === "DOCENTE") {
          setUploadedFiles(data.filter((f) => f.usuario === correo));
        } else {
          setUploadedFiles(data);
        }
      })
      .catch((err) => console.error("❌ Error al obtener archivos:", err));
  }, [id, token, rol, correo]);

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
    files.forEach((file) => formData.append("file", file));
    formData.append("portafolio", id);
    formData.append("semana", semana);
    formData.append("nombre", "prueba -- 002");
    formData.append("tipo", "pdf");
    formData.append("categoria", categoria);

    try {
      const res = await fetch(`${apiUrl}/archivo`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error(await res.text());

      const result = await res.json();
      const nuevos = Array.isArray(result) ? result : [result];
      setUploadedFiles((prev) => [...prev, ...nuevos]);
      setFiles([]);
      setSuccessMessage("✅ ¡Archivos subidos exitosamente!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("❌ Error en la subida:", error);
    }
  };

  const handleDelete = async (fileId) => {
    const confirm = window.confirm("¿Estás seguro de eliminar este archivo?");
    if (!confirm) return;

    try {
      const res = await fetch(`${apiUrl}/archivo/${fileId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(await res.text());

      setUploadedFiles((prev) => prev.filter((file) => file._id !== fileId));
    } catch (err) {
      console.error("❌ Error al eliminar archivo:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 p-6 pb-36">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Archivos del Portafolio <span className="text-blue-600">({portfolioName})</span>
          </h1>
          <button
            onClick={() => navigate("/portafolios")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            ⬅ Volver
          </button>
        </div>

        {successMessage && (
          <div className="bg-green-100 text-green-700 p-3 rounded shadow">
            {successMessage}
          </div>
        )}

        <form
          onSubmit={handleUpload}
          className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg z-50"
        >
          <div className="flex flex-col md:flex-row items-center gap-4">
            <select
              value={semana}
              onChange={(e) => setSemana(Number(e.target.value))}
              className="border px-3 py-2 rounded w-full md:w-auto"
            >
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  Semana {i + 1}
                </option>
              ))}
            </select>

            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="border px-3 py-2 rounded w-full md:w-auto"
            >
              {categorias.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="w-full md:w-auto"
            />

            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Subir archivos
            </button>
          </div>
        </form>

        <div className="mt-8 space-y-6">
          {[...Array(12)].map((_, semanaIndex) => {
            const semanaActual = semanaIndex + 1;
            const archivosSemana = uploadedFiles.filter((f) => f.semana === semanaActual);

            return (
              <div key={semanaActual} className="bg-white rounded shadow p-4">
                <h2 className="text-lg font-semibold text-blue-700 mb-2">
                  Semana {semanaActual}
                </h2>

                {categorias.map((cat) => {
                  const archivosCat = archivosSemana.filter((f) => f.categoria === cat);

                  return (
                    <div key={cat} className="mb-4">
                      <h3 className="text-sm font-bold text-gray-600">{cat}</h3>
                      {archivosCat.length > 0 ? (
                        <ul className="list-disc list-inside text-sm text-gray-800 ml-4">
                          {archivosCat.map((file, i) => (
                            <li key={i} className="flex justify-between items-center">
                              <a
                                href={file.url || file.enlace || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                {file.nombreOriginal || file.originalName || file.filename || "Archivo"}
                              </a>
                              {(rol === "ADMINISTRADOR" || file.usuario === correo) && (
                                <button
                                  onClick={() => handleDelete(file._id)}
                                  className="ml-4 text-red-500 hover:text-red-700 text-xs"
                                >
                                  🗑 Eliminar
                                </button>
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500 ml-4">No hay archivos en esta categoría.</p>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default PortfolioDetail;
