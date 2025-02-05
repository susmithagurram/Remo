import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import { LoginProvider, ProtectedRoute } from './privy/PrivyAuth';

function App() {
  return (
    <LoginProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/chat" 
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </LoginProvider>
  );
}

export default App; 