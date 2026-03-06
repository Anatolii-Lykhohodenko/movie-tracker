import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { App } from './App';
import { HomePage } from './pages/HomePage';
import { AuthPage } from './pages/AuthPage';
import { MovieDetail } from './pages/MovieDetail';
import { WatchlistPage } from './pages/WatchlistPage';
import { ProfilePage } from './pages/ProfilePage';
import { NotFoundPage } from './pages/NotFoundPage/NotFoundPage';
import { RequireAuth } from './pages/RequireAuth';
import { RegisterPage } from './pages/RegisterPage';
import { RedirectAuthPage } from './pages/RedirectAuthPage';

export const Root = () => (
  <Router>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<HomePage />}></Route>
        <Route path="/home" element={<Navigate to="/" replace />}></Route>
        <Route path="movie/:id" element={<MovieDetail />}></Route>
        <Route path="watchlist" element={<RequireAuth />}>
          <Route index element={<WatchlistPage />} />
        </Route>
        <Route path="profile" element={<RequireAuth />}>
          <Route index element={<ProfilePage />}></Route>
        </Route>
        <Route element={<RedirectAuthPage />}>
          <Route path="login" element={<AuthPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Router>
);
