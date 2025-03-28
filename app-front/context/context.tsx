import React, { createContext, useState, useContext } from "react";

// Definimos la interfaz para el contexto
interface AuthContextType {
  token: string | null; // El token de autenticación
  setToken: (token: string | null) => void; // Función para actualizar el token
}

// Creamos el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Proveedor del contexto
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};