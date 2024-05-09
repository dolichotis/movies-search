import React, { Component } from 'react';
import { Row, Col } from 'antd';
import 'antd/dist/reset.css';
import './app.css';

import SwapiService from '../../services/swapi-service';
import FilmPoster from '../film-poster/film-poster';
import Loader from '../loader/loader';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      films: [],
      error: null,
    };
    this.swapiService = new SwapiService();
  }

  componentDidMount() {
    this.swapiService
      .getMovies()
      .then((data) => {
        this.setState({ films: data.results });
      })
      .catch((error) => {
        this.setState({ error: error.message });
      });
  }

  render() {
    const { films, error } = this.state;

    if (error) {
      return <div>Error: {error}</div>;
    }

    if (films.length === 0) {
      return <Loader />;
    }

    return (
      <section className="main">
        <Row>
          {films.map((film) => (
            <Col key={film.id} xs={24} sm={12}>
              <FilmPoster film={film} />
            </Col>
          ))}
        </Row>
      </section>
    );
  }
}
