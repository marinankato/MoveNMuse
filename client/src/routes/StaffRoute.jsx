import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../components/auth/AuthContext.jsx";

export default function StaffRoute() {
    const { auth } = useAuth();
    const user = auth?.user;

    if (!auth) {
        console.warn("StaffRoute useed outside AuthProvider");
        return <Navigate to="/login" replace />;
    }

    if (!user) return <Navigate to="/login" replace />;
    return (user.role === "staff" || user.role === "admin") 
    ? <Outlet />
    : <Navigate to="/" replace />;
}
