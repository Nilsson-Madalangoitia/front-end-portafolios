import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// 🧩 Páginas del sistema
import Home from "../pages/Home";
import Login from "../pages/Login";
import Profile from "../pages/Profile";
import AdminDashboard from "../pages/AdminDashboard";
import MyPortfolios from "../pages/MyPortfolios";
import DocumentUpload from "../pages/DocumentUpload";
import DocenteDashboard from "../pages/DocenteDashboard";
import AdminHome from "../pages/AdminHome";

// 🔐 Verifica si el token existe y no ha expirado
const isTokenValid = () => {
  const token = localStorage.getItem("token");
  const expiry = localStorage.getItem("tokenExpiry");
  if (!token || !expiry) return false;
  return new Date().getTime() < Number(expiry);
};

// 🔐 Ruta protegida: verifica token y rol
const PrivateRoute = ({ element, roles }) => {
  const tokenIsValid = isTokenValid();
  const userRol = localStorage.getItem("rol");

  if (!tokenIsValid) return <Navigate to="/login" />;
  if (roles && !roles.includes(userRol)) return <Navigate to="/home" />;

  return element;
};

// 📍 Redirección inicial desde "/"
function RootRedirect() {
  if (isTokenValid()) {
    const rol = localStorage.getItem("rol");
    if (rol === "ADMINISTRADOR") {
      return <Navigate to="/admin/home" />;
    } else {
      return <Navigate to="/docente/dashboard" />;
    }
  } else {
    return <Navigate to="/login" />;
  }
}

function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* 🚪 Entrada al sistema */}
        <Route path="/" element={<RootRedirect />} />

        {/* Login → redirige si ya hay sesión activa */}
        <Route
          path="/login"
          element={
            isTokenValid() ? (
              localStorage.getItem("rol") === "ADMINISTRADOR" ? (
                <Navigate to="/admin/home" />
              ) : (
                <Navigate to="/docente/dashboard" />
              )
            ) : (
              <Login />
            )
          }
        />

        {/* Rutas compartidas */}
        <Route
          path="/home"
          element={<PrivateRoute element={<Home />} roles={["ADMINISTRADOR", "DOCENTE"]} />}
        />
        <Route
          path="/profile"
          element={<PrivateRoute element={<Profile />} roles={["ADMINISTRADOR", "DOCENTE"]} />}
        />
        <Route
          path="/my-portfolios"
          element={<PrivateRoute element={<MyPortfolios />} roles={["ADMINISTRADOR", "DOCENTE"]} />}
        />
        <Route
          path="/portfolio/:id"
          element={<PrivateRoute element={<DocumentUpload />} roles={["ADMINISTRADOR", "DOCENTE"]} />}
        />

        {/* Solo DOCENTE */}
        <Route
          path="/docente/dashboard"
          element={<PrivateRoute element={<DocenteDashboard />} roles={["DOCENTE"]} />}
        />

        {/* Solo ADMIN */}
        <Route
          path="/admin"
          element={<PrivateRoute element={<AdminDashboard />} roles={["ADMINISTRADOR"]} />}
        />
        <Route
          path="/admin/home"
          element={<PrivateRoute element={<AdminHome />} roles={["ADMINISTRADOR"]} />}
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
