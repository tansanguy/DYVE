import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FigmaApp from './dyve-figma/App';
import HomePage from './pages/HomePage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FigmaApp />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}
