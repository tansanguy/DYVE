import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import EventsPage from './pages/Events';
import EventDetailPage from './pages/EventDetail';
import ReservationPage from './pages/ReservationPage';
import NetworkingPage from './pages/Networking';
import MyPage from './pages/MyPage';
import FigmaApp from './dyve-figma/App';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/event/:id" element={<EventDetailPage />} />
        <Route path="/reservation/:id" element={<ReservationPage />} />
        <Route path="/networking" element={<NetworkingPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/proposals" element={<NetworkingPage />} />
        <Route path="/figma/*" element={<FigmaApp />} />
      </Routes>
    </Router>
  );
}
