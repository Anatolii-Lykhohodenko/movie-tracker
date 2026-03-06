import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import movieRoutes from './routes/movie.routes';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',')
      : ['http://localhost:5173'],
    credentials: true,
  }),
);

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
});
