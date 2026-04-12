import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Home from './pages/home/Home';
import './App.css'

function App() {
  const { checkAuth, isLoading } = useAuthStore();

  // Перевірка сесії при старті додатку
  useEffect(() => {
    checkAuth();
  }, []);

  // Поки перевіряємо куки, нічого не рендеримо (або можна показати спінер)
  if (isLoading) return null;

  return (
    <BrowserRouter>
      <Routes>
        {/* В майбутньому тут з'являться /history або /settings */}
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
