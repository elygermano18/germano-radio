import { useState } from 'react';
import { X, Plus } from 'lucide-react';

export default function AddRadioModal({ onClose, onAdd }) {
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    favicon: '',
    state: '',
    tags: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.url) {
      alert('Preencha pelo menos o nome e a URL do stream!');
      return;
    }

    const newRadio = {
      stationuuid: `user-${Date.now()}`, // ID único baseado no tempo
      name: formData.name,
      url_resolved: formData.url,
      favicon: formData.favicon || 'https://cdn-icons-png.flaticon.com/512/727/727270.png',
      state: formData.state || 'Brasil',
      country: 'Brasil',
      tags: formData.tags,
      bitrate: 128,
      isUserAdded: true // Marca que foi adicionada pelo usuário
    };

    onAdd(newRadio);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Adicionar Nova Rádio</h3>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Nome da Rádio *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Rádio Cidade FM"
              required
            />
          </div>

          <div className="form-group">
            <label>URL do Stream *</label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="Ex: http://stream.radiocidade.com.br:8000/live"
              required
            />
            <small className="form-hint">
              Cole o link que você copiou do DevTools (F12)
            </small>
          </div>

          <div className="form-group">
            <label>URL do Ícone (opcional)</label>
            <input
              type="url"
              value={formData.favicon}
              onChange={(e) => setFormData({ ...formData, favicon: e.target.value })}
              placeholder="https://exemplo.com/logo.png"
            />
          </div>

          <div className="form-group">
            <label>Estado (opcional)</label>
            <input
              type="text"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              placeholder="Ex: Pernambuco"
            />
          </div>

          <div className="form-group">
            <label>Gêneros/Tags (opcional)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="Ex: rock, pop, noticias"
            />
          </div>

          <button type="submit" className="btn-submit">
            <Plus size={18} />
            Adicionar Rádio
          </button>
        </form>
      </div>
    </div>
  );
}