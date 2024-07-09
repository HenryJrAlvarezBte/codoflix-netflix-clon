import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Carousel.css';

const Carousel = ({ title }) => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        let response;
        if (title === 'Popular Movies') {
          response = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=c1c1b074811a2eb34b83383e83864ff2&language=en-US&page=1`);
        } else if (title === 'Top Rated Movies') {
          response = await axios.get(`https://api.themoviedb.org/3/movie/top_rated?api_key=c1c1b074811a2eb34b83383e83864ff2&language=en-US&page=1`);
        }
        setMovies(response.data.results);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, [title]);

  return (
    <div className="carousel-container">
      <div className="carousel">
        <div className="carousel-track">
          {movies.map(movie => (
            <Link to={`/movie/${movie.id}`} key={movie.id} className="carousel-item">
              <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt={movie.title} />
              <p>{movie.title}</p>
            </Link>
          ))}        
          {movies.map(movie => (
            <Link to={`/movie/${movie.id}`} key={`${movie.id}-duplicate`} className="carousel-item">
              <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt={movie.title} />
              <p>{movie.title}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;