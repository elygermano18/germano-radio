import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useRadio } from '../context/RadioContext';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const { applyFilter, activeFilter } = useRadio();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      applyFilter('search', query.trim());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleClear = () => {
    setQuery('');
    applyFilter('popular');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Limpa o input quando sai da busca
  const handleFilterChange = () => {
    if (activeFilter !== 'search') {
      setQuery('');
    }
  };

  return (
    <form className="search-bar" onSubmit={handleSearch}>
      <div className="search-input-wrapper">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Buscar rádio por nome..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFilterChange}
          className="search-input"
        />
        {query && (
          <button type="button" onClick={handleClear} className="clear-btn">
            <X size={16} />
          </button>
        )}
      </div>
      <button type="submit" className="search-btn">
        Buscar
      </button>
    </form>
  );
}