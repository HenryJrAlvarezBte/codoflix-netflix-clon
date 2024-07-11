import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './MovieDetailsPage.css';

const MovieDetailsPage = () => {
  const { id } = useParams();
  const [movieDetails, setMovieDetails] = useState(null);
  const [rating, setRating] = useState(0);
  const [votes, setVotes] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=c1c1b074811a2eb34b83383e83864ff2&language=en-US`);
        setMovieDetails(response.data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };

    fetchMovieDetails();
  }, [id]);

  useEffect(() => {
    const storedVotes = JSON.parse(localStorage.getItem(`movieVotes_${id}`)) || [];
    setVotes(storedVotes);

    const storedComments = JSON.parse(localStorage.getItem(`movieComments_${id}`)) || [];
    setComments(storedComments);
  }, [id]);
  
    const handleRating = (stars) => {
    setRating(stars);
   
    const newVotes = [...votes, stars];
    setVotes(newVotes);
  
    localStorage.setItem(`movieVotes_${id}`, JSON.stringify(newVotes));
    
    console.log(`Usuario seleccionó ${stars} estrellas para la película con ID ${id}`);
  };

  const calculateAverageRating = () => {
    if (votes.length === 0) return 0;

    const sum = votes.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    return sum / votes.length;
  };

  const handleCommentSubmit = (event) => {
    event.preventDefault();
    const newComment = {
      username: `Anonimo${comments.length + 1}`,
      text: commentText,
    };
    const newComments = [...comments, newComment];
    setComments(newComments);
    setCommentText('');
    localStorage.setItem(`movieComments_${id}`, JSON.stringify(newComments));
  };

  if (!movieDetails) {
    return <div>Cargando...</div>;
  }

  const { title, overview, poster_path, genres, release_date, production_companies } = movieDetails;
  const averageRating = calculateAverageRating();

  return (
    <div className="movie-details">
      <div className="poster">
        <img src={`https://image.tmdb.org/t/p/w500/${poster_path}`} alt={title} />
      </div>
      <div className="details">
        <h2>{title}</h2>
        <p>{overview}</p>
        <div className="additional-info">
          <div>
            <strong>Generos:</strong> {genres.map((genre, index) => (
              <span key={genre.id}>{genre.name}{index !== genres.length - 1 ? ', ' : ''}</span>
            ))}
          </div>
          <div>
            <strong>Fecha de lanzamiento:</strong> {release_date}
          </div>
          <div>
            <strong>Compañias productoras:</strong> {production_companies.map((company, index) => (
              <span key={company.id}>{company.name}{index !== production_companies.length - 1 ? ', ' : ''}</span>
            ))}
          </div>
        </div>
        <div className="rating">
          <h3>Valora esta pelicula:</h3>
          <div className="stars">
            <button className={`rating-button ${rating >= 1 ? 'active' : ''}`} onClick={() => handleRating(1)}>★</button>
            <button className={`rating-button ${rating >= 2 ? 'active' : ''}`} onClick={() => handleRating(2)}>★</button>
            <button className={`rating-button ${rating >= 3 ? 'active' : ''}`} onClick={() => handleRating(3)}>★</button>
            <button className={`rating-button ${rating >= 4 ? 'active' : ''}`} onClick={() => handleRating(4)}>★</button>
            <button className={`rating-button ${rating >= 5 ? 'active' : ''}`} onClick={() => handleRating(5)}>★</button>
          </div>
          <div className="average-rating">
            <strong>Rating Promedio:</strong> {averageRating.toFixed(1)} ({votes.length} votos)
          </div>
        </div>
        <div className="comments">
          <h3>Comentarios:</h3>
          <form onSubmit={handleCommentSubmit}>
            <textarea 
              value={commentText} 
              onChange={(e) => setCommentText(e.target.value)} 
              placeholder="Agrega tu comentario..." 
              required 
            />
            <button type="submit">Enviar</button>
          </form>
          <div className="comment-list">
            {comments.map((comment, index) => (
              <div key={index} className="comment">
                <strong>{comment.username}:</strong> {comment.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsPage;