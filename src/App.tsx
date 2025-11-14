import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FigmaApp from './dyve-figma/App';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<FigmaApp />} />
      </Routes>
    </BrowserRouter>
  );
}
