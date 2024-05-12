import React, { Component } from 'react';
import { Row, Col, Alert, Spin } from 'antd';
import 'antd/dist/reset.css';
import { Offline, Online } from 'react-detect-offline';
import './app.css';

import SwapiService from '../../services/swapi-service';
import FilmPoster from '../film-poster/film-poster';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      films: [],
      error: false,
      loading: true,
      isOnline: navigator.onLine,
    };
    this.swapiService = new SwapiService();
  }

  componentDidMount() {
    setTimeout(() => {
      if (!this.state.isOnline) {
        this.setState({ error: 'Нет подключения к интернету', loading: false });
        return;
      }

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
    const spin = loading && !isError ? <Spin tip="Loading..." size="large" fullscreen /> : null;

    return (
      <section className="main">
        <Row>
          <Online>
            {spin}
            {films.map((film) => (
              <Col key={film.id} xs={24} sm={12}>
                <FilmPoster film={film} onError={this.onError} />
              </Col>
            ))}
            {isError}
          </Online>
          <Offline>
            <Alert message={error} description="You're offline right now. Check your connection." type="info" />
          </Offline>
        </Row>
      </section>
    );
  }
}
