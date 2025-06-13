import AppRouter from "./routes/AppRouter";

// 👉 Limpieza preventiva del localStorage para evitar "token basura"
function cleanLocalStorageOnStart() {
  const token = localStorage.getItem("token");
  const expiry = localStorage.getItem("tokenExpiry");
  // Si hay token pero no hay fecha de expiración, o el token está vacío:
  if ((token && (!expiry || token === "")) || (!token && expiry)) {
    localStorage.clear();
  }
  // Si hay expiry pero ya expiró:
  if (expiry && new Date().getTime() > Number(expiry)) {
    localStorage.clear();
  }
}

function App() {
  cleanLocalStorageOnStart();

  return (
    <div className="min-h-screen bg-white">
      <AppRouter />
    </div>
  );
}

export default App;
