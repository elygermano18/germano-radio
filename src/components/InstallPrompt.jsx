import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Verifica se já está instalado
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true);
      return;
    }

    // Captura o evento de instalação
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Verifica se o app foi instalado
    window.addEventListener('appinstalled', () => {
      setInstalled(true);
      setShowInstallButton(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('Usuário aceitou a instalação');
      setShowInstallButton(false);
    } else {
      console.log('Usuário dispensou a instalação');
    }
    
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowInstallButton(false);
  };

  // Não mostra se já está instalado
  if (installed) return null;

  // Não mostra se não há prompt disponível
  if (!showInstallButton) return null;

  return (
    <div className="install-prompt">
      <div className="install-content">
        <div className="install-icon">
          <Download size={24} />
        </div>
        <div className="install-text">
          <h4>Instale o Germano Radio</h4>
          <p>Adicione à tela inicial para acesso rápido</p>
        </div>
        <div className="install-actions">
          <button className="btn-install" onClick={handleInstallClick}>
            Instalar
          </button>
          <button className="btn-dismiss" onClick={handleDismiss}>
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}