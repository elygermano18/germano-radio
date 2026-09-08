// src/pages/Home.jsx

import { useState, useEffect } from 'react';
import RadioCard from '../components/RadioCard';
import { radioApi } from '../services/radioApi';
import { useRadio } from '../context/RadioContext';
import { Loader2, Radio, Heart, Search, Plus } from 'lucide-react';
import AddRadioModal from '../components/AddRadioModal';

export default function Home() {
  const [radios, setRadios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [citySearch, setCitySearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  
  const { 
    activeFilter, 
    filterValue, 
    cityFilter, 
    applyCityFilter,
    userRadios,
    addUserRadio,
    removeUserRadio
  } = useRadio();

  useEffect(() => {
    loadRadios();
  }, [activeFilter, filterValue, cityFilter, userRadios]);

  const loadRadios = async () => {
    setLoading(true);
    setRadios([]);
    
    try {
      let data = [];
      
      switch (activeFilter) {
        case 'popular':
          data = await radioApi.getPopular(50);
          break;
          
        case 'favorites':
          const saved = localStorage.getItem('germano_favorites');
          data = saved ? JSON.parse(saved) : [];
          break;
          
        case 'search':
          if (filterValue.trim()) {
            data = await radioApi.searchByName(filterValue);
          }
          break;
          
        case 'state':
          if (filterValue) {
            if (cityFilter) {
              data = await radioApi.getByCity(cityFilter, filterValue);
            } else {
              data = await radioApi.getByState(filterValue);
            }
          }
          break;
          
        case 'genre':
          if (filterValue) {
            data = await radioApi.getByGenre(filterValue);
          }
          break;

        // AQUI ESTÁ A CORREÇÃO: Junta as rádios do código com as do formulário
        case 'local':
          const radiosDoCodigo = radioApi.getLocalRadios();
          data = [...radiosDoCodigo, ...userRadios];
          break;
          
        default:
          data = await radioApi.getPopular(50);
      }
      
      setRadios(data);
    } catch (err) {
      console.error('Erro ao carregar rádios:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCitySearch = (e) => {
    e.preventDefault();
    if (citySearch.trim()) {
      applyCityFilter(citySearch.trim());
    }
  };

  const clearCityFilter = () => {
    setCitySearch('');
    applyCityFilter('');
  };

  const handleAddRadio = (newRadio) => {
    addUserRadio(newRadio);
  };

  const handleRemoveRadio = (radio) => {
    if (window.confirm(`Remover "${radio.name}" das suas rádios?`)) {
      removeUserRadio(radio.stationuuid);
    }
  };

  const getGenreName = (tag) => {
    const genres = radioApi.getGenres();
    const genre = genres.find(g => g.tag === tag);
    return genre ? genre.name : tag;
  };

  const getSectionInfo = () => {
    switch (activeFilter) {
      case 'popular':
        return { 
          icon: '🔥', 
          title: 'Rádios Populares no Brasil', 
          subtitle: 'As mais ouvidas pelos brasileiros' 
        };
      case 'favorites':
        return { 
          icon: '❤️', 
          title: 'Suas Rádios Favoritas', 
          subtitle: radios.length > 0 
            ? `${radios.length} ${radios.length === 1 ? 'rádio salva' : 'rádios salvas'}`
            : 'Você ainda não favoritou nenhuma rádio' 
        };
      case 'search':
        return { 
          icon: '🔍', 
          title: `Resultados para "${filterValue}"`, 
          subtitle: `${radios.length} ${radios.length === 1 ? 'rádio encontrada' : 'rádios encontradas'}` 
        };
      case 'state':
        return { 
          icon: '📍', 
          title: cityFilter 
            ? `Rádios de ${cityFilter}, ${filterValue}` 
            : `Rádios de ${filterValue}`,
          subtitle: cityFilter
            ? `${radios.length} rádios na cidade`
            : `${radios.length} rádios no estado`
        };
      case 'genre':
        return { 
          icon: '🎵', 
          title: `Gênero: ${getGenreName(filterValue)}`, 
          subtitle: `${radios.length} ${radios.length === 1 ? 'rádio encontrada' : 'rádios encontradas'}` 
        };
      case 'local':
        return { 
          icon: '🏙️', 
          title: 'Rádios Adicionadas', 
          subtitle: radios.length > 0 
            ? `${radios.length} rádios na sua lista pessoal` 
            : 'Clique no botão abaixo para adicionar sua primeira rádio!' 
        };
      default:
        return { icon: '', title: 'Rádios', subtitle: '' };
    }
  };

  const { icon, title, subtitle } = getSectionInfo();

  return (
    <div className="home">
      <div className="section-header">
        <h2>{icon} {title}</h2>
        <p>{subtitle}</p>
      </div>

      {/* Botão de adicionar rádio (só aparece na aba "Adicionadas") */}
      {activeFilter === 'local' && (
        <button className="btn-add-radio" onClick={() => setShowAddModal(true)}>
          <Plus size={20} />
          Adicionar Nova Rádio
        </button>
      )}

      {/* Busca por cidade quando estiver filtrando por estado */}
      {activeFilter === 'state' && (
        <form className="city-search-bar" onSubmit={handleCitySearch}>
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder={`Buscar cidade em ${filterValue}...`}
              value={citySearch}
              onChange={(e) => setCitySearch(e.target.value)}
              className="search-input"
            />
            {cityFilter && (
              <button type="button" onClick={clearCityFilter} className="clear-btn">
                ✕
              </button>
            )}
          </div>
          <button type="submit" className="search-btn">
            Buscar
          </button>
        </form>
      )}

      {loading ? (
        <div className="loading-container">
          <Loader2 className="spinner" size={40} />
          <p>Carregando rádios...</p>
        </div>
      ) : radios.length === 0 ? (
        <div className="empty-state">
          {activeFilter === 'favorites' ? <Heart size={64} /> : <Radio size={64} />}
          <h3>
            {activeFilter === 'favorites' 
              ? 'Nenhuma rádio favorita ainda' 
              : activeFilter === 'local'
              ? 'Sua lista está vazia'
              : 'Nenhuma rádio encontrada'}
          </h3>
          <p>
            {activeFilter === 'favorites' 
              ? 'Clique no coração em uma rádio para salvá-la aqui' 
              : activeFilter === 'local'
              ? 'Clique no botão "Adicionar Nova Rádio" acima para começar!'
              : 'Tente buscar por outro nome ou filtro'}
          </p>
        </div>
      ) : (
        <div className="radio-grid">
          {radios.map(radio => (
            <RadioCard 
              key={radio.stationuuid} 
              radio={radio}
              onRemove={radio.isUserAdded ? handleRemoveRadio : undefined}
            />
          ))}
        </div>
      )}

      {/* Modal de adicionar rádio */}
      {showAddModal && (
        <AddRadioModal 
          onClose={() => setShowAddModal(false)} 
          onAdd={handleAddRadio}
        />
      )}
    </div>
  );
}