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
import StroopTest from './games/StroopTest'
import ChimpanzeeTest from './games/ChimpanzeeTest'
import SustainedAttention from './games/SustainedAttention'
import GoNoGo from './games/GoNoGo'
import NBack from './games/NBack'
import MentalMath from './games/MentalMath'
import PatternRecognition from './games/PatternRecognition'
import LogicTest from './games/LogicTest'
import DelayGratification from './games/DelayGratification'
import EmotionRecognition from './games/EmotionRecognition'
import TaskSwitching from './games/TaskSwitching'
import RiskDecision from './games/RiskDecision'
import TowerPlanning from './games/TowerPlanning'
import LearningCurveTest from './games/LearningCurveTest'
import BiasBenchmarks from './games/BiasBenchmarks'
import TimeEstimation from './games/TimeEstimation'
import TheoryOfMind from './games/TheoryOfMind'
import PersonalityTest from './games/PersonalityTest'
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
            <Route path="/test/stroop" element={<StroopTest />} />
            <Route path="/test/chimpanzee" element={<ChimpanzeeTest />} />
            <Route path="/test/sequence" element={<SequenceMemory />} />
            <Route path="/test/sustained-attention" element={<SustainedAttention />} />
            <Route path="/test/go-no-go" element={<GoNoGo />} />
            <Route path="/test/n-back" element={<NBack />} />
            <Route path="/test/mental-math" element={<MentalMath />} />
            <Route path="/test/pattern-recognition" element={<PatternRecognition />} />
            <Route path="/test/logic" element={<LogicTest />} />
            <Route path="/test/delay-gratification" element={<DelayGratification />} />
            <Route path="/test/emotion-recognition" element={<EmotionRecognition />} />
            <Route path="/test/task-switching" element={<TaskSwitching />} />
            <Route path="/test/risk-decision" element={<RiskDecision />} />
            <Route path="/test/tower-planning" element={<TowerPlanning />} />
            <Route path="/test/learning-curve" element={<LearningCurveTest />} />
            <Route path="/test/bias-benchmarks" element={<BiasBenchmarks />} />
            <Route path="/test/time-estimation" element={<TimeEstimation />} />
            <Route path="/test/personality" element={<PersonalityTest />} />
            <Route path="/test/theory-of-mind" element={<TheoryOfMind />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App

