import { RadioProvider } from './context/RadioContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import SearchBar from './components/SearchBar';
import Home from './pages/Home';
import Player from './components/Player';
import InstallPrompt from './components/InstallPrompt';
import './App.css';

function App() {
  return (
    <RadioProvider>
      <div className="app">
        <Header />
        <div className="app-body">
          <Sidebar />
          <main className="main">
            <SearchBar />
            <Home />
          </main>
        </div>
        <Player />
        <InstallPrompt />
      </div>
    </RadioProvider>
  );
}

export default App;