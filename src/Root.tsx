import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { App } from './App';
import { HomePage } from './pages/HomePage';
import { AuthPage } from './pages/AuthPage';
import { MovieDetail } from './pages/MovieDetail';
import { WatchList } from './pages/WatchList';
import { Profile } from './pages/Profile';
import { NotFoundPage } from './pages/NotFoundPage/NotFoundPage';
import { RequireAuth } from './pages/RequireAuth';

export const Root = () => (
  <Router>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<HomePage />}></Route>
        <Route path='/home' element={<Navigate to='/' replace />}></Route>
        <Route path="login" element={<AuthPage />}></Route>
        <Route path="register" element={<AuthPage />}></Route>
        <Route path="movie/:id" element={<MovieDetail />}></Route>
        <Route path="watchlist" element={<RequireAuth />}>
          <Route index element={<WatchList />} />
        </Route>
        <Route path="profile" element={<RequireAuth />}>
          <Route index element={<Profile />}></Route>
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Router>
);