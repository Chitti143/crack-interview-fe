import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Header from './components/Header';
import Footer from './components/Footer';
import UsernameModal from './components/UsernameModal';
import HomePage from './pages/HomePage';
import QuestionsPage from './pages/QuestionsPage';
import QuestionDetailPage from './pages/QuestionDetailPage';
import AskQuestionPage from './pages/AskQuestionPage';
import ProfilePage from './pages/ProfilePage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <div className="app">
          <UsernameModal />
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/tech/:techId" element={<QuestionsPage />} />
            <Route path="/question/:questionId" element={<QuestionDetailPage />} />
            <Route path="/ask" element={<AskQuestionPage />} />
            <Route path="/profile/:username" element={<ProfilePage />} />
          </Routes>
          <Footer />
        </div>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;