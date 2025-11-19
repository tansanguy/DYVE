import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import EventsPage from './pages/Events';
import EventDetailPage from './pages/EventDetail';
import BookingPage from './pages/Booking';
import NetworkingPage from './pages/Networking';
import MyPage from './pages/MyPage';
import CreateEventPage from './pages/CreateEvent';
import CreateSpacePage from './pages/CreateSpace';
import InboxPage from './pages/Inbox';
import FigmaApp from './dyve-figma/App';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/create" element={<CreateEventPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
        <Route path="/spaces/create" element={<CreateSpacePage />} />
        <Route path="/booking/:id" element={<BookingPage />} />
        <Route path="/networking" element={<NetworkingPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/inbox" element={<InboxPage />} />
        <Route path="/figma/*" element={<FigmaApp />} />
      </Routes>
    </Router>
  );
}
