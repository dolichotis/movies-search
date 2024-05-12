import React, { Component } from 'react';
import { Row, Col, Alert } from 'antd';
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
      error: false,
      loading: true,
    };
    this.swapiService = new SwapiService();
  }

  componentDidMount() {
    setTimeout(() => {
      this.swapiService
        .getMovies()
        .then((data) => {
          this.setState({ films: data.results, loading: false });
        })
        .catch((error) => {
          this.setState({ error: error.message, loading: false });
        });
    }, 500);
  }

  onError = () => {
    this.setState({
      isLoading: false,
      isError: true,
    });
  };

  render() {
    const { films, error, loading } = this.state;

    const isError = error ? <Alert message={error} description="Возникла ошибка!" type="error" showIcon /> : null;

    if (loading) {
      return <Loader />;
    }

    return (
      <section className="main">
        <Row>
          {films.map((film) => (
            <Col key={film.id} xs={24} sm={12}>
              <FilmPoster film={film} onError={this.onError} />
            </Col>
          ))}
          {isError}
        </Row>
      </section>
    );
  }
}
