import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import Carousel from './components/Carousel';
import MovieDetailsPage from './components/MovieDetailsPage';

const App = () => {
  const [carouselData, setCarouselData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {        
        const responsePopular = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=c1c1b074811a2eb34b83383e83864ff2`);
        const responseTopRated = await axios.get(`https://api.themoviedb.org/3/movie/top_rated?api_key=c1c1b074811a2eb34b83383e83864ff2`);

        const allMovies = [...responsePopular.data.results, ...responseTopRated.data.results];
        const uniqueMovies = Array.from(new Set(allMovies.map(movie => movie.id))).map(id => {
          return allMovies.find(movie => movie.id === id);
        });

        const popularMovies = uniqueMovies.filter(movie => responsePopular.data.results.some(pop => pop.id === movie.id));
        const topRatedMovies = uniqueMovies.filter(movie => responseTopRated.data.results.some(top => top.id === movie.id));

        setCarouselData([
          { id: 1, title: 'Popular Movies', movies: popularMovies },
          { id: 2, title: 'Top Rated Movies', movies: topRatedMovies },
        ]);
      } catch (error) {
        setError(error);
        console.error('Error fetching data from TMDb', error);
      }
    };

    fetchMovies();
  }, []);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Router>
      <div className="App">
        <h1 className='neon'>CODOFLIX</h1>
        <Routes>
          <Route
            exact
            path="/"
            element={
              carouselData.map(carousel => (
                <Carousel key={carousel.id} title={carousel.title} movies={carousel.movies} />
              ))
            }
          />
          <Route path="/movie/:id" element={<MovieDetailsPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;