const BASE_IMAGE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

export const PLACEHOLDER_POSTER =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="450"%3E%3Crect fill="%23dbdbdb" width="300" height="450"/%3E%3Ctext fill="%23999" font-size="24" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Poster%3C/text%3E%3C/svg%3E';

export const PLACEHOLDER_AVATAR =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23dbdbdb" width="100" height="100"/%3E%3Ctext fill="%23999" font-size="40" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3E👤%3C/text%3E%3C/svg%3E';

export const TMDB_IMAGE_SIZES = {
  poster: {
    small: `${BASE_IMAGE_URL}/w185`,
    medium: `${BASE_IMAGE_URL}/w342`,
    large: `${BASE_IMAGE_URL}/w500`,
    original: `${BASE_IMAGE_URL}/original`,
  },
  backdrop: {
    small: `${BASE_IMAGE_URL}/w780`,
    large: `${BASE_IMAGE_URL}/w1280`,
    original: `${BASE_IMAGE_URL}/original`,
  },
};
