import React from 'react';
import { Rate } from 'antd';

import './card-list.css';
import ReleaseDate from '../release-date/release-date';

function shortenText(text, maxLength) {
  if (text.length <= maxLength) {
    return text;
  } else {
    const words = text.split(' ');
    let shortenedText = '';
    for (const word of words) {
      if ((shortenedText + word).length <= maxLength) {
        shortenedText += word + ' ';
      } else {
        break;
      }
    }
    return shortenedText.trim() + '...';
  }
}

function getRatingClass(rating) {
  if (rating >= 7) {
    return 'rating-high';
  } else if (rating >= 5) {
    return 'rating-medium-well';
  } else if (rating >= 3) {
    return 'rating-medium';
  } else {
    return 'rating-low';
  }
}

const CardList = ({ movieDataFromBase = [], ratings = {}, onRatingChange, genresList }) => {
  if (!movieDataFromBase || movieDataFromBase.length === 0) {
    return <p>No movies to display</p>;
  }

  const getGenres = (genreIds) => {
    return genreIds
      .map((id) => {
        const genre = genresList.find((g) => g.id === id);
        return genre ? genre.name : null;
      })
      .filter((genre) => genre !== null);
  };

  return (
    <div className="cardList">
      {movieDataFromBase.map((movie) => {
        const { id, title, poster_path, release_date, overview, vote_average, genre_ids } = movie;
        const initialRating = vote_average || 0;
        const ratingClass = getRatingClass(initialRating);
        const genres = getGenres(genre_ids);

        return (
          <div className="cardWrapper" key={id}>
            <div className="imageWrapper">
              <img alt={title} src={`https://image.tmdb.org/t/p/original/${poster_path}`} />
            </div>
            <div className={`ratingCircle ${ratingClass}`}>{initialRating.toFixed(1)}</div>
            <div className="textWrapper">
              <h1 className="cardTitle">{title}</h1>
              <ReleaseDate filmRelease={release_date} />
              <div className="genre">
                {genres.map((genre) => (
                  <button className="genreBut" key={genre}>
                    {genre}
                  </button>
                ))}
              </div>
              <p className="description">{shortenText(overview, 65)}</p>
              <Rate
                rootClassName="rating"
                allowHalf
                value={ratings[id] || 0}
                onChange={(value) => onRatingChange(id, value)}
                count={10}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CardList;
