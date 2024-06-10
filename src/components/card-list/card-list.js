import React from 'react';
import { Card, Rate } from 'antd';

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

const CardList = ({ movieDataFromBase = [], ratings = {}, onRatingChange }) => {
  if (!movieDataFromBase || movieDataFromBase.length === 0) {
    return <p>No movies to display</p>;
  }

  return (
    <div className="cardList">
      {movieDataFromBase.map((movie) => {
        const { id, title, poster_path, release_date, overview, vote_average } = movie;
        const initialRating = vote_average || 0;
        const ratingClass = getRatingClass(initialRating);

        return (
          <div className="cardWrapper" key={id}>
            <Card hoverable className="infoCard">
              <div className="imageWrapper">
                <img
                  alt={title}
                  src={`https://image.tmdb.org/t/p/original/${poster_path}`}
                  style={{ height: '280px', objectFit: 'cover' }}
                />
              </div>
              <div className={`ratingCircle ${ratingClass}`}>{initialRating.toFixed(1)}</div>
              <div className="textWrapper">
                <h1>{title}</h1>
                <h3>
                  <ReleaseDate filmRelease={release_date} />
                </h3>
                <p>{shortenText(overview, 95)}</p>
                <Rate allowHalf value={ratings[id] || 0} onChange={(value) => onRatingChange(id, value)} count={10} />
              </div>
            </Card>
          </div>
        );
      })}
    </div>
  );
};

export default CardList;
