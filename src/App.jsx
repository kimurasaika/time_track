import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import SettingsPage from './pages/SettingsPage'
import InputPage from './pages/InputPage'
import DashboardPage from './pages/DashboardPage'
import HistoryPage from './pages/HistoryPage'

function RequireNames({ children }) {
  const stored = localStorage.getItem('chat_timer_names')
  if (!stored) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<SettingsPage />} />
        <Route
          path="/input"
          element={
            <RequireNames>
              <InputPage />
            </RequireNames>
          }
        />
        <Route
          path="/dashboard"
          element={
            <RequireNames>
              <DashboardPage />
            </RequireNames>
          }
        />
        <Route
          path="/history"
          element={
            <RequireNames>
              <HistoryPage />
            </RequireNames>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
