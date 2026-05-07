import { createContext, useContext, useEffect, useState } from "react";
import API from "../api/apiClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [token, setToken] = useState(localStorage.getItem("token"));

    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
        } else {
            localStorage.removeItem("token");
        }
        
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
    }, [token, user]);

    const register = async (username, email, password) => {
        const res = await API.post("/auth/register", {
            username,
            email,
            password,
        });

        setToken(res.data.token);
        setUser(res.data);
        return res.data;
    };

    const login = async (email, password) => {
        const res = await API.post("/auth/login", {
            email,
            password,
        });

        setToken(res.data.token);
        setUser(res.data);
        return res.data;
    };

    const logout = () => {
        setUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                token,
                register,
                login,
                logout,
                isAuthenticated: !!token,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};