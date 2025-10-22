import { createContext, useContext, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem("token"));

    const user = useMemo(() => {
        if (!token) return null;
        try {
            return jwtDecode(token);
        } catch {
            return null;
        }
    }, [token]);

    const login = (t) => {
        localStorage.setItem("token", t);
        setToken(t);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
    };

    return (
        <AuthCtx.Provider value={{ token, user, login, logout }}>
            {children}
        </AuthCtx.Provider>
    );
}