import { Radio } from 'lucide-react';

export default function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <div className="logo-icon">
            <Radio size={28} />
          </div>
          <div className="logo-text">
            <h1>Germano Radio</h1>
            <p>Sua rádio, seu estilo</p>
          </div>
        </div>
      </div>
    </header>
  );
}