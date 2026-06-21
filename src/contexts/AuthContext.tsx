import { createContext, useContext, useState, ReactNode } from 'react';
import type { Usuario } from '../services/api';

interface AuthContextType {
  usuario: Usuario | null;
  token: string | null;
  salvarSessao: (usuario: Usuario, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);

  function salvarSessao(usuario: Usuario, token: string) {
    setUsuario(usuario);
    setToken(token);
  }

  function logout() {
    setUsuario(null);
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, token, salvarSessao, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
