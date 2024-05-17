import React from 'react';
import { Card } from 'antd';

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

const CardList = ({ movieDataFromBase }) => {
  console.log('card');

  return (
    <div className="cardList">
      {movieDataFromBase.map((movie) => (
        <div className="cardWrapper" key={movie.id}>
          <Card hoverable className="infoCard">
            <div className="imageWrapper">
              <img
                alt={movie.title}
                src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                style={{ height: '280px', objectFit: 'cover' }} // Добавляем стили для изображения
              />
            </div>
            <div className="textWrapper">
              <h1>{movie.title}</h1>
              <h3>
                <ReleaseDate filmRelease={movie.release_date} />
              </h3>
              <p>{shortenText(movie.overview, 150)}</p>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default CardList;
