import { Play, Heart, Trash2 } from 'lucide-react';
import { useRadio } from '../context/RadioContext';

export default function RadioCard({ radio, onRemove }) {
  const { playRadio, currentRadio, isPlaying, toggleFavorite, isFavorite } = useRadio();
  
  const isActive = currentRadio?.stationuuid === radio.stationuuid;
  const favorited = isFavorite(radio.stationuuid);
  const isRemovable = !!onRemove; // Só mostra lixeira se a função foi passada

  return (
    <div className={`radio-card ${isActive ? 'active' : ''}`}>
      <div className="radio-card-image">
        <img 
          src={radio.favicon || 'https://cdn-icons-png.flaticon.com/512/727/727270.png'} 
          alt={radio.name}
          onError={(e) => {
            e.target.src = 'https://cdn-icons-png.flaticon.com/512/727/727270.png';
          }}
        />
        {isActive && isPlaying && <div className="playing-indicator"></div>}
      </div>

      <div className="radio-card-info">
        <h3>{radio.name}</h3>
        <p className="radio-card-location">
          {radio.state && `${radio.state} • `}{radio.country || 'Brasil'}
        </p>
        {radio.tags && (
          <div className="radio-card-tags">
            {radio.tags.split(',').slice(0, 2).map((tag, i) => (
              <span key={i} className="tag">{tag.trim()}</span>
            ))}
          </div>
        )}
      </div>

      <div className="radio-card-actions">
        {/* Botão de Favoritar - só aparece se NÃO for rádio adicionada pelo usuário */}
        {!isRemovable && (
          <button 
            className={`btn-favorite ${favorited ? 'favorited' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(radio);
            }}
            title={favorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          >
            <Heart size={18} fill={favorited ? 'currentColor' : 'none'} />
          </button>
        )}

        {/* Botão de Play/Pause */}
        <button 
          className="btn-play"
          onClick={() => playRadio(radio)}
          title={isActive && isPlaying ? 'Pausar' : 'Tocar'}
        >
          <Play size={18} fill="currentColor" />
        </button>

        {/* Botão de Remover - só aparece para rádios adicionadas pelo usuário */}
        {isRemovable && (
          <button 
            className="btn-remove"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(radio);
            }}
            title="Remover rádio"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>
    </div>
  );
}