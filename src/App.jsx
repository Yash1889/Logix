import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './components/Login'
import Signup from './components/Signup'
import Dashboard from './components/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import ReactionTime from './games/ReactionTime'
import VisualMemory from './games/VisualMemory'
import NumberMemory from './games/NumberMemory'
import VerbalMemory from './games/VerbalMemory'
import AimTrainer from './games/AimTrainer'
import TypingTest from './games/TypingTest'
import SequenceMemory from './games/SequenceMemory'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />

            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Game Routes */}
            <Route path="/test/reaction" element={<ReactionTime />} />
            <Route path="/test/visual-memory" element={<VisualMemory />} />
            <Route path="/test/number-memory" element={<NumberMemory />} />
            <Route path="/test/verbal-memory" element={<VerbalMemory />} />
            <Route path="/test/aim" element={<AimTrainer />} />
            <Route path="/test/typing" element={<TypingTest />} />
            <Route path="/test/sequence" element={<SequenceMemory />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App

