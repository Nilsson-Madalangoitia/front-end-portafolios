import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    nombre: "Juan",
    apellido: "Pérez",
    imagen: null,
    password: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imagen") {
      const file = files[0];
      setForm({ ...form, imagen: file });
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.nombre || !form.apellido) {
      setMensaje("⚠️ Nombre y apellido son obligatorios.");
      return;
    }

    if (form.newPassword && form.newPassword.length < 6) {
      setMensaje("⚠️ La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (form.newPassword !== form.confirmNewPassword) {
      setMensaje("⚠️ Las contraseñas no coinciden.");
      return;
    }

    setMensaje("");
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setMensaje("✅ Cambios guardados correctamente.");
    }, 2000);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();

    if (form.password !== "123456") {
      setMensaje("⚠️ La contraseña actual es incorrecta.");
      return;
    }

    if (form.newPassword && form.newPassword.length >= 6) {
      setPasswordChanged(true);
      setMensaje("✅ Contraseña cambiada correctamente.");
      setForm({ ...form, password: "", newPassword: "", confirmNewPassword: "" });
      setShowPasswordModal(false);
    } else {
      setMensaje("⚠️ La nueva contraseña debe tener al menos 6 caracteres.");
    }
  };

  const handleImageButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6">

        {/* ✅ Aviso para administrador */}
        {localStorage.getItem("rol") === "Administrador" && (
          <div className="max-w-sm mx-auto bg-yellow-50 border border-yellow-300 text-yellow-800 text-sm rounded-md py-2 px-4 shadow-sm text-center">
            Estás visualizando el sistema como <span className="font-semibold">Administrador</span>.
          </div>
        )}

        <h2 className="text-3xl font-bold text-center text-blue-700">Editar Perfil</h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Imagen de perfil */}
          <div className="flex flex-col items-center space-y-3">
            {previewImage ? (
              <img
                src={previewImage}
                alt="Imagen de perfil"
                className="w-24 h-24 rounded-full object-cover border-2 border-orange-400"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                Sin imagen
              </div>
            )}
            <button
              type="button"
              onClick={handleImageButtonClick}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm rounded-lg shadow transition"
            >
              ✏️ Cambiar imagen
            </button>
            <input
              type="file"
              name="imagen"
              accept="image/*"
              onChange={handleChange}
              ref={fileInputRef}
              className="hidden"
            />
          </div>

          {/* Nombre */}
          <div>
            <label className="block text-gray-700 mb-1">Nombres</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tu nombre"
            />
          </div>

          {/* Apellido */}
          <div>
            <label className="block text-gray-700 mb-1">Apellidos</label>
            <input
              type="text"
              name="apellido"
              value={form.apellido}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tu apellido"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white font-semibold transition ${
              loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Guardando..." : "Guardar cambios"}
          </button>
        </form>

        {/* Mensaje de estado */}
        {mensaje && (
          <p
            className={`text-center text-sm font-medium ${
              mensaje.includes("✅") ? "text-green-600" : "text-red-500"
            }`}
          >
            {mensaje}
          </p>
        )}

        {/* Botón cambiar contraseña */}
        <div className="text-center mt-4">
          <button
            onClick={() => setShowPasswordModal(true)}
            className="text-orange-500 hover:text-orange-600 font-semibold"
          >
            Cambiar contraseña
          </button>
        </div>

        {/* Botón volver */}
        <button
          onClick={() => navigate("/")}
          className="block mx-auto mt-6 text-blue-600 hover:underline text-sm"
        >
          ⬅ Volver al inicio
        </button>

        {/* Modal de cambiar contraseña */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-80 space-y-4 shadow-lg">
              <h3 className="text-lg font-bold text-center text-blue-700">Cambiar contraseña</h3>
              <form onSubmit={handlePasswordChange} className="space-y-3">
                <div>
                  <label className="block text-gray-700 mb-1">Contraseña actual</label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Nueva contraseña</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={form.newPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Confirmar nueva contraseña</label>
                  <input
                    type="password"
                    name="confirmNewPassword"
                    value={form.confirmNewPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                    placeholder="••••••••"
                  />
                </div>
                <div className="flex justify-between items-center pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="text-gray-500 hover:text-gray-700 text-sm"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-4 py-2 rounded-lg"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
