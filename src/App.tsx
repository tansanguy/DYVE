import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import EventsPage from './pages/Events';
import EventDetailPage from './pages/EventDetail';
import BookingPage from './pages/Booking';
import NetworkingPage from './pages/Networking';
import MyPage from './pages/MyPage';
import EventCreatePage from './pages/EventCreatePage';
import InboxPage from './pages/Inbox';
import ReservationCompletePage from './pages/ReservationComplete';
import FigmaApp from './dyve-figma/App';
import ArtistProfileCreate from './pages/ArtistProfileCreate';
import SpaceDetailPage from './pages/SpaceDetail';
import SpaceProfileCreate from './pages/SpaceProfileCreate';
import ProposalSend from './pages/ProposalSend';
import NetworkingDetailPage from './pages/NetworkingDetail';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
        <Route path="/events/create" element={<EventCreatePage />} />
        <Route path="/artist/create" element={<ArtistProfileCreate />} />
        <Route path="/spaces/create" element={<SpaceProfileCreate />} />
        <Route path="/proposals/send" element={<ProposalSend />} />
        <Route path="/booking/:id" element={<BookingPage />} />
        <Route path="/booking/complete" element={<ReservationCompletePage />} />
        <Route path="/networking" element={<NetworkingPage />} />
        <Route path="/networking/:artistId" element={<NetworkingDetailPage />} />
        <Route path="/spaces/:id" element={<SpaceDetailPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/inbox" element={<InboxPage />} />
        <Route path="/figma/*" element={<FigmaApp />} />
      </Routes>
    </Router>
  );
}
