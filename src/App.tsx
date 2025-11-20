import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import EventsPage from './pages/Events';
import EventDetailPage from './pages/EventDetail';
import BookingPage from './pages/Booking';
import NetworkingPage from './pages/Networking';
import MyPage from './pages/MyPage';
import EventRegisterPage from './pages/EventRegister';
import InboxPage from './pages/Inbox';
import FigmaApp from './dyve-figma/App';
import ArtistProfileCreatePage from './pages/ArtistProfileCreatePage';
import ArtistDetailPage from './pages/ArtistDetail';
import SpaceDetailPage from './pages/SpaceDetail';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
        <Route path="/events/register" element={<EventRegisterPage />} />
        <Route path="/artist/create" element={<EventRegisterPage />} />
        <Route path="/mypage/artist-profile" element={<ArtistProfileCreatePage />} />
        <Route path="/booking/:id" element={<BookingPage />} />
        <Route path="/networking" element={<NetworkingPage />} />
        <Route path="/artists/:id" element={<ArtistDetailPage />} />
        <Route path="/spaces/:id" element={<SpaceDetailPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/inbox" element={<InboxPage />} />
        <Route path="/figma/*" element={<FigmaApp />} />
      </Routes>
    </Router>
  );
}
