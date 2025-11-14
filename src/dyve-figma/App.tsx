import { useState } from 'react';
import HomePage from './components/HomePage';
import ExplorePage from './components/ExplorePage';
import PerformanceDetailPage from './components/PerformanceDetailPage';
import BookingPage from './components/BookingPage';
import BookingConfirmationPage from './components/BookingConfirmationPage';
import SuggestionPage from './components/SuggestionPage';
import ArtistDetailPage from './components/ArtistDetailPage';
import SpaceDetailPage from './components/SpaceDetailPage';
import ProposalPage from './components/ProposalPage';
import MyPage from './components/MyPage';
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegistrationPage';
import EventsPage from './components/EventsPage';
import SupportPage from './components/SupportPage';
import AdminPage from './components/AdminPage';
import ReceivedProposalsPage from './components/ReceivedProposalsPage';
import CreatePerformancePage from './components/CreatePerformancePage';
import { Toaster } from './components/ui/sonner';

export type Screen = 
  | 'home' 
  | 'explore' 
  | 'detail' 
  | 'booking' 
  | 'confirm' 
  | 'suggest' 
  | 'artistDetail' 
  | 'spaceDetail' 
  | 'proposal' 
  | 'myPage' 
  | 'login' 
  | 'register' 
  | 'events' 
  | 'support' 
  | 'admin'
  | 'receivedProposals'
  | 'createPerformance';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedPerformance, setSelectedPerformance] = useState<any>(null);
  const [selectedArtist, setSelectedArtist] = useState<any>(null);
  const [selectedSpace, setSelectedSpace] = useState<any>(null);
  const [bookingData, setBookingData] = useState<any>(null);

  const navigate = (screen: Screen, data?: any) => {
    setCurrentScreen(screen);
    if (data?.performance) setSelectedPerformance(data.performance);
    if (data?.artist) setSelectedArtist(data.artist);
    if (data?.space) setSelectedSpace(data.space);
    if (data?.booking) setBookingData(data.booking);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomePage navigate={navigate} />;
      case 'explore':
        return <ExplorePage navigate={navigate} />;
      case 'detail':
        return <PerformanceDetailPage navigate={navigate} performance={selectedPerformance} />;
      case 'booking':
        return <BookingPage navigate={navigate} performance={selectedPerformance} />;
      case 'confirm':
        return <BookingConfirmationPage navigate={navigate} booking={bookingData} />;
      case 'suggest':
        return <SuggestionPage navigate={navigate} />;
      case 'artistDetail':
        return <ArtistDetailPage navigate={navigate} artist={selectedArtist} />;
      case 'spaceDetail':
        return <SpaceDetailPage navigate={navigate} space={selectedSpace} />;
      case 'proposal':
        return <ProposalPage navigate={navigate} target={selectedArtist || selectedSpace} />;
      case 'myPage':
        return <MyPage navigate={navigate} />;
      case 'login':
        return <LoginPage navigate={navigate} />;
      case 'register':
        return <RegistrationPage navigate={navigate} />;
      case 'events':
        return <EventsPage navigate={navigate} />;
      case 'support':
        return <SupportPage navigate={navigate} />;
      case 'admin':
        return <AdminPage navigate={navigate} />;
      case 'receivedProposals':
        return <ReceivedProposalsPage navigate={navigate} />;
      case 'createPerformance':
        return <CreatePerformancePage navigate={navigate} />;
      default:
        return <HomePage navigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {renderScreen()}
      <Toaster position="top-center" richColors />
    </div>
  );
}
