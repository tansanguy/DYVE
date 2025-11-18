import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FigmaApp from './dyve-figma/App';
import Home from './pages/Home';
import EventDetailPage from './pages/EventDetail';
import ReservationPage from './pages/ReservationPage';
import ProposalInbox from './pages/ProposalInbox';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/event/:id" element={<EventDetailPage />} />
        <Route path="/reservation/:id" element={<ReservationPage />} />
        <Route path="/proposals" element={<ProposalInbox />} />
        <Route path="/*" element={<FigmaApp />} />
      </Routes>
    </BrowserRouter>
  );
}
