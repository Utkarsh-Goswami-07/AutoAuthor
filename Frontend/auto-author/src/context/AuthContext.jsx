import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        checkAuthStatus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**
     * ✅ SAFE auth hydration (NO auto logout)
     */
    const checkAuthStatus = async () => {
        try {
            const token = localStorage.getItem("token");
            const userStr = localStorage.getItem("user");

            // No session → not authenticated (but DO NOT logout)
            if (!token || !userStr) {
                setLoading(false);
                return;
            }

            const userData = JSON.parse(userStr);

            // Basic validation to avoid corrupted storage
            if (!userData || !userData._id) {
                console.warn("Invalid user data in localStorage");
                setLoading(false);
                return;
            }

            setUser(userData);
            setIsAuthenticated(true);
        } catch (error) {
            // ❌ NEVER auto logout here
            console.warn("Auth check failed, preserving session:", error);
        } finally {
            setLoading(false);
        }
    };

    /**
     * ✅ Login handler
     */
    const login = (userData, token) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));

        setUser(userData);
        setIsAuthenticated(true);
    };

    /**
     * ✅ Controlled logout (manual only)
     */
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");

        setUser(null);
        setIsAuthenticated(false);

        navigate("/", { replace: true });
    };

    /**
     * ✅ Update user safely
     */
    const updateUser = (updatedUserData) => {
        if (!user) return;

        const newUserData = { ...user, ...updatedUserData };
        localStorage.setItem("user", JSON.stringify(newUserData));
        setUser(newUserData);
    };

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        logout,
        updateUser,
        checkAuthStatus,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
