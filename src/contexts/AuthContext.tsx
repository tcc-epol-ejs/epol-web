import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { me as buscarUsuarioLogado, Usuario } from '../services/api';

interface AuthContextType {
  usuario: Usuario | null;
  token: string | null;
  carregando: boolean;
  salvarSessao: (usuario: Usuario, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);
const STORAGE_KEY = 'epol_token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const tokenSalvo = localStorage.getItem(STORAGE_KEY);
    if (!tokenSalvo) {
      setCarregando(false);
      return;
    }

    buscarUsuarioLogado(tokenSalvo)
      .then(({ usuario }) => {
        setUsuario(usuario);
        setToken(tokenSalvo);
      })
      .catch(() => {
        localStorage.removeItem(STORAGE_KEY);
      })
      .finally(() => setCarregando(false));
  }, []);

  function salvarSessao(usuario: Usuario, token: string) {
    setUsuario(usuario);
    setToken(token);
    localStorage.setItem(STORAGE_KEY, token);
  }

  function logout() {
    setUsuario(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <AuthContext.Provider
      value={{ usuario, token, carregando, salvarSessao, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
