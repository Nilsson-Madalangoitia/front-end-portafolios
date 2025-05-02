import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Profile from "../pages/Profile";
import AdminDashboard from "../pages/AdminDashboard";
import MyPortfolios from "../pages/MyPortfolios";
import PortfolioDetail from "../pages/PortfolioDetail";

function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* Página principal para usuarios */}
        <Route path="/" element={<Home />} />

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Perfil */}
        <Route path="/profile" element={<Profile />} />

        {/* Dashboard de Administrador */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Listado de Portafolios */}
        <Route path="/my-portfolios" element={<MyPortfolios />} />

        {/* Detalle de Portafolio específico */}
        <Route path="/portfolio/:id" element={<PortfolioDetail />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
