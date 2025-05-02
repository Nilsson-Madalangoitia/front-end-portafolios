import { motion } from "framer-motion";

function ConfirmModal({ isOpen, title, message, onCancel, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full space-y-6 border-t-4 border-orange-400 text-center"
      >
        <div className="flex justify-center">
          <div className="bg-orange-100 p-4 rounded-full">
            <svg
              className="w-12 h-12 text-orange-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-blue-700">{title}</h2>
        <p className="text-gray-600">{message}</p>

        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={onCancel}
            className="px-6 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 font-semibold transition"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition"
          >
            Eliminar
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default ConfirmModal;
