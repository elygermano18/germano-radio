import { useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Radio, Signal } from 'lucide-react';
import { useRadio } from '../context/RadioContext';

export default function Player() {
  const { 
    currentRadio, 
    isPlaying, 
    audioRef, 
    volume, 
    setVolume, 
    isMuted, 
    toggleMute 
  } = useRadio();

  // Configurar Media Session API para controles na tela de bloqueio
  useEffect(() => {
    if (!currentRadio || !('mediaSession' in navigator)) return;

    // Definir metadados da mídia
    navigator.mediaSession.metadata = new MediaMetadata({
      title: currentRadio.name,
      artist: currentRadio.state || 'Brasil',
      album: 'Germano Radio',
      artwork: [
        {
          src: currentRadio.favicon || 'https://cdn-icons-png.flaticon.com/512/727/727270.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    });

    // Configurar ações de controle
    navigator.mediaSession.setActionHandler('play', () => {
      if (audioRef.current) {
        audioRef.current.play();
      }
    });

    navigator.mediaSession.setActionHandler('pause', () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    });

    navigator.mediaSession.setActionHandler('stop', () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    });

    // Atualizar posição de reprodução
    if (isPlaying) {
      navigator.mediaSession.playbackState = 'playing';
    } else {
      navigator.mediaSession.playbackState = 'paused';
    }

    return () => {
      // Limpar quando desmontar
      navigator.mediaSession.metadata = null;
    };
  }, [currentRadio, isPlaying, audioRef]);

  if (!currentRadio) return null;

  const bitrate = currentRadio.bitrate ? `${currentRadio.bitrate} kbps` : "Qualidade variável";

  return (
    <div className="player-pro">
      <div className="player-track-info">
        <div className="player-cover">
          <img 
            src={currentRadio.favicon || 'https://cdn-icons-png.flaticon.com/512/727/727270.png'} 
            alt={currentRadio.name}
            onError={(e) => { e.target.src = 'https://cdn-icons-png.flaticon.com/512/727/727270.png'; }}
          />
          {isPlaying && <div className="live-badge">AO VIVO</div>}
        </div>
        <div className="player-text">
          <h4 className="player-title">{currentRadio.name}</h4>
          <p className="player-artist">{currentRadio.state || 'Brasil'}</p>
          <div className="player-meta">
            <Signal size={12} />
            <span>{bitrate}</span>
          </div>
        </div>
      </div>

      <div className="player-controls-center">
        <button 
          className="btn-main-play"
          onClick={() => {
            if (!audioRef.current) return;
            isPlaying ? audioRef.current.pause() : audioRef.current.play();
          }}
        >
          {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" />}
        </button>
      </div>

      <div className="player-volume">
        <button onClick={toggleMute} className="btn-icon">
          {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          value={isMuted ? 0 : volume}
          onChange={(e) => {
            setVolume(parseFloat(e.target.value));
            if (isMuted) toggleMute();
          }}
          className="volume-slider"
        />
      </div>
    </div>
  );
}