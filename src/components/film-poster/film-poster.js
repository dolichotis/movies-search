import React, { Component } from 'react';
import './film-poster.css';

import ReleaseDate from '../release-date/release-date';

export default class FilmPoster extends Component {
  render() {
    const { film, onError } = this.props;

    return (
      <div className="filmPoster">
        <div className="filmImage">
          <img
            src={`https://image.tmdb.org/t/p/original/${film.poster_path}`}
            alt=""
            className="posterImage"
            onError={() => {
              if (onError) {
                onError('Network Error');
              }
            }}
          />
        </div>
        <div className="filmInfo">
          <h1>{film.title}</h1>
          <ReleaseDate filmRelease={film.release_date} />
          <button>Action</button>
          <button>Drama</button>
          <p>{film.overview}</p>
        </div>
      </div>
    );
  }
}
