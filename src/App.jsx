import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import BirthdayPage from './pages/BirthdayPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          {/* Main birthday experience — each page has a unique slug */}
          <Route path="/:slug" element={<BirthdayPage />} />

          {/* 404 fallback */}
          <Route path="/not-found" element={<NotFoundPage />} />

          {/* Root redirect — show 404 (no slug given) */}
          <Route path="/" element={<Navigate to="/not-found" replace />} />
          <Route path="*" element={<Navigate to="/not-found" replace />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}
