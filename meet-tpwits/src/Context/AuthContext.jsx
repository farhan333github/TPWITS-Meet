import { useContext, createContext, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Initialize with `null` meaning not authenticated

    const login = (userData) => {
        setUser(userData); // Set user data upon successful login
    };

    const logout = () => {
        setUser(null); // Clear user data on logout
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
