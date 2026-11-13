import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  desfavoritarCandidato,
  desfavoritarPartido,
  favoritarCandidato,
  favoritarPartido,
  listarIdsFavoritos,
} from '../services/api';

export function useFavorito(
  tipo: 'partido' | 'candidato',
  id: string | null | undefined,
) {
  const { token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [favorito, setFavorito] = useState(false);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!token || !id) {
      setFavorito(false);
      return;
    }
    let ativo = true;
    listarIdsFavoritos(token)
      .then((ids) => {
        if (!ativo) return;
        const lista = tipo === 'partido' ? ids.partidos : ids.candidatos;
        setFavorito(lista.includes(id));
      })
      .catch((error: unknown) => {
        console.error('Erro ao carregar favoritos:', error);
      });
    return () => {
      ativo = false;
    };
  }, [token, id, tipo]);

  async function alternar() {
    if (!id || salvando) return;

    if (!token) {
      // TODO: confirmar a rota real de login
      navigate('/login', {
        state: { voltarPara: location.pathname + location.search },
      });
      return;
    }

    const anterior = favorito;
    setFavorito(!anterior); // otimista
    setSalvando(true);

    try {
      if (tipo === 'partido') {
        await (anterior
          ? desfavoritarPartido(token, id)
          : favoritarPartido(token, id));
      } else {
        await (anterior
          ? desfavoritarCandidato(token, id)
          : favoritarCandidato(token, id));
      }
    } catch (error) {
      console.error('Erro ao atualizar favorito:', error);
      setFavorito(anterior); // desfaz
    } finally {
      setSalvando(false);
    }
  }

  return { favorito, salvando, alternar };
}
