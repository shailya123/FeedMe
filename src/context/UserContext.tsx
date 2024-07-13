// contexts/AuthContext.tsx
import { User } from 'next-auth';
import React, { createContext, useContext, useState } from 'react';


// Define context type
interface AuthContextType {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use auth context
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

// Auth provider component
export const AuthUserProvider=({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    // Login function
    const login = (userData: User) => {
        setUser(userData);
    };

    // Logout function
    const logout = () => {
        setUser(null);
    };

    const authContextValue: AuthContextType = {
        user,
        login,
        logout,
    };

    return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
};
