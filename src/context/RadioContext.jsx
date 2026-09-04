// src/context/RadioContext.jsx

import { createContext, useContext, useState, useRef, useEffect } from 'react';

const RadioContext = createContext();

export function RadioProvider({ children }) {
  const [currentRadio, setCurrentRadio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  
  // Favoritos (rádios da API que você curtiu)
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('germano_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // Rádios adicionadas manualmente pelo usuário
  const [userRadios, setUserRadios] = useState(() => {
    const saved = localStorage.getItem('germano_user_radios');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeFilter, setActiveFilter] = useState('popular');
  const [filterValue, setFilterValue] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.crossOrigin = 'anonymous';
    audioRef.current.volume = volume;
    
    // === NOVO (Passo 6): Permitir reprodução em segundo plano (iOS/Android) ===
    audioRef.current.setAttribute('playsinline', 'true');
    audioRef.current.setAttribute('webkit-playsinline', 'true');
    // ========================================================================
    
    audioRef.current.addEventListener('playing', () => setIsPlaying(true));
    audioRef.current.addEventListener('pause', () => setIsPlaying(false));
    audioRef.current.addEventListener('error', () => setIsPlaying(false));

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Salva favoritos no localStorage
  useEffect(() => {
    localStorage.setItem('germano_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Salva rádios adicionadas no localStorage
  useEffect(() => {
    localStorage.setItem('germano_user_radios', JSON.stringify(userRadios));
  }, [userRadios]);

  const playRadio = (radio) => {
    if (!audioRef.current) return;
    
    if (currentRadio?.stationuuid === radio.stationuuid) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      return;
    }

    setCurrentRadio(radio);
    audioRef.current.src = radio.url_resolved;
    audioRef.current.play().catch(err => console.error('Erro ao tocar:', err));
  };

  const toggleFavorite = (radio) => {
    setFavorites(prev => {
      const exists = prev.find(f => f.stationuuid === radio.stationuuid);
      if (exists) {
        return prev.filter(f => f.stationuuid !== radio.stationuuid);
      }
      return [...prev, radio];
    });
  };

  const isFavorite = (stationuuid) => {
    return favorites.some(f => f.stationuuid === stationuuid);
  };

  // Adicionar rádio manualmente
  const addUserRadio = (radio) => {
    setUserRadios(prev => [...prev, radio]);
  };

  // Remover rádio adicionada
  const removeUserRadio = (stationuuid) => {
    setUserRadios(prev => prev.filter(r => r.stationuuid !== stationuuid));
    // Se a rádio removida estiver tocando, para o player
    if (currentRadio?.stationuuid === stationuuid) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      setCurrentRadio(null);
      setIsPlaying(false);
    }
  };

  const applyFilter = (filterType, value = '') => {
    setActiveFilter(filterType);
    setFilterValue(value);
    if (filterType !== 'state') {
      setCityFilter('');
    }
  };

  const applyCityFilter = (city) => {
    setCityFilter(city);
  };

  const toggleMute = () => setIsMuted(!isMuted);

  return (
    <RadioContext.Provider value={{
      currentRadio,
      isPlaying,
      volume,
      setVolume,
      isMuted,
      toggleMute,
      favorites,
      userRadios,
      activeFilter,
      filterValue,
      cityFilter,
      playRadio,
      toggleFavorite,
      isFavorite,
      addUserRadio,
      removeUserRadio,
      applyFilter,
      applyCityFilter,
      audioRef
    }}>
      {children}
    </RadioContext.Provider>
  );
}

export const useRadio = () => useContext(RadioContext);