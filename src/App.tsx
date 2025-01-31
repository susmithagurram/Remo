import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Main from './pages/Main';
import Profile from './pages/Profile';
import { LoginProvider } from './context/LoginContext';

function App() {
  return (
    <LoginProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/main" element={<Main />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </LoginProvider>
  );
}

export default App; 