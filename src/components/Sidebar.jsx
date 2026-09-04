// src/components/Sidebar.jsx

import { useState, useEffect } from 'react';
import { Home, Heart, MapPin, Music, Radio, ChevronDown, ChevronRight, Building } from 'lucide-react';
import { useRadio } from '../context/RadioContext';
import { radioApi } from '../services/radioApi';

export default function Sidebar() {
  const { activeFilter, filterValue, applyFilter, favorites } = useRadio();
  const [states, setStates] = useState([]);
  const [genres, setGenres] = useState([]);
  const [expandedSections, setExpandedSections] = useState({ states: false, genres: false });

  useEffect(() => {
    // Carrega listas fixas de estados e gêneros brasileiros
    setStates(radioApi.getStates());
    setGenres(radioApi.getGenres());
  }, []);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleStateClick = (stateName) => {
    console.log('Clicou no estado:', stateName);
    applyFilter('state', stateName);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGenreClick = (genreName, tag) => {
    console.log('Clicou no gênero:', genreName, 'tag:', tag);
    applyFilter('genre', tag);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMenuClick = (filterId) => {
    applyFilter(filterId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isActive = (filterType, value = null) => {
    if (value === null) return activeFilter === filterType;
    return activeFilter === filterType && filterValue === value;
  };

  return (
    <aside className="sidebar">
      {/* Menu Principal */}
      <div className="sidebar-section">
        <button
          className={`sidebar-item ${isActive('popular') ? 'active' : ''}`}
          onClick={() => handleMenuClick('popular')}
        >
          <Home size={20} />
          <span>Populares</span>
        </button>

        <button
          className={`sidebar-item ${isActive('local') ? 'active' : ''}`}
          onClick={() => handleMenuClick('local')}
        >
          <Building size={20} />
          <span>Adicionadas</span>
        </button>

        <button
          className={`sidebar-item ${isActive('favorites') ? 'active' : ''}`}
          onClick={() => handleMenuClick('favorites')}
        >
          <Heart size={20} />
          <span>Favoritas</span>
          {favorites.length > 0 && <span className="badge">{favorites.length}</span>}
        </button>
      </div>

      {/* Seção de Estados */}
      <div className="sidebar-section">
        <button 
          className="sidebar-header"
          onClick={() => toggleSection('states')}
        >
          <MapPin size={20} />
          <span>Estados</span>
          {expandedSections.states ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
        
        {expandedSections.states && (
          <div className="filter-list">
            {states.map(state => (
              <button
                key={state}
                className={`filter-item ${isActive('state', state) ? 'active' : ''}`}
                onClick={() => handleStateClick(state)}
              >
                <span>{state}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Seção de Gêneros */}
      <div className="sidebar-section">
        <button 
          className="sidebar-header"
          onClick={() => toggleSection('genres')}
        >
          <Music size={20} />
          <span>Gêneros</span>
          {expandedSections.genres ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
        
        {expandedSections.genres && (
          <div className="filter-list">
            {genres.map(genre => (
              <button
                key={genre.tag}
                className={`filter-item ${isActive('genre', genre.tag) ? 'active' : ''}`}
                onClick={() => handleGenreClick(genre.name, genre.tag)}
              >
                <span>{genre.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Rodapé */}
      <div className="sidebar-footer">
        <Radio size={16} />
        <span>Germano Radio v1.0</span>
      </div>
    </aside>
  );
}