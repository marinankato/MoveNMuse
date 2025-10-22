import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../components/auth/AuthContext.jsx";
import { jwtDecode } from "jwt-decode";

export default function StaffRoute() {
    const auth = useAuth();
    const cachedToken = !auth?.user && localStorage.getItem("token");
    const cachedUser = cachedToken ? safeDecode(cachedToken) : null;
    const user = auth?.user;

    // if (!auth) {
    //     console.warn("StaffRoute useed outside AuthProvider");
    //     return <Navigate to="/login" replace />;
    // }

    if (!user) return <Navigate to="/login" replace />;
    return (user.role === "staff" || user.role === "admin") 
    ? <Outlet />
    : <Navigate to="/" replace />;
}

function safeDecode(token) {
    try { return jwtDecode(token); } catch { return null; }
}