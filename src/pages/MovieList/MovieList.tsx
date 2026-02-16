import type React from "react";
import type { Movie } from "../../types/tmbd";
import { MovieCard } from "../MovieCard";

interface Props {
  movies: Movie[]
}

export const MovieList : React.FC<Props> = ({ movies }) => {
  return (
    <div className="columns is-multiline is-mobile">
      {movies.map(movie => {
        return <MovieCard movie={movie} key={movie.id} />;
      })}
    </div>
  );
}