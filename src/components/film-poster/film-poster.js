import React from 'react';
import './film-poster.css';
import { Row, Col } from 'antd';

import ReleaseDate from '../release-date/release-date';

function FilmPoster({ film }) {
  return (
    <div className="filmPoster">
      <Row gutter={[16, 16]}>
        <Col xs={24} md={13} lg={10}>
          <img src={`https://image.tmdb.org/t/p/original/${film.poster_path}`} alt="" className="posterImage" />
        </Col>
        <Col xs={24} md={11} lg={14} className="filmInfo">
          <h1>{film.title}</h1>
          <ReleaseDate filmRelease={film.release_date} />
          <button>Action</button>
          <button>Drama</button>
          <p>{film.overview}</p>
        </Col>
      </Row>
    </div>
  );
}

export default FilmPoster;
