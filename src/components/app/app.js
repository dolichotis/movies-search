import React, { Component } from 'react';
import { Alert, Spin, Empty, Space } from 'antd';
import { Offline, Online } from 'react-detect-offline';
import 'antd/dist/reset.css';
import './app.css';
import { format, isValid, parseISO } from 'date-fns';

import SwapiService from '../../services/swapi-service';
import Search from '../search/search';
import CardList from '../card-list/card-list';

export default class App extends Component {
  state = {
    films: [],
    error: false,
    loading: true,
    isOnline: navigator.onLine,
    notFound: false,
  };

  swapiService = new SwapiService();

  componentDidMount() {
    this.fetchMovies();
  }

  fetchMovies = (query) => {
    this.setState({
      films: [],
      error: false,
      loading: true,
      notFound: false,
    });

    this.swapiService
      .getMovies(query)
      .then((data) => {
        console.log(data);
        if (data.results.length === 0) {
          this.setState({ notFound: true, loading: false });
        } else {
          this.setState({ films: data.results, loading: false });
        }
      })
      .catch((error) => {
        this.setState({ error: error.message, loading: false });
      });
  };

  handleSearch = (query) => {
    this.fetchMovies(query);
  };

  createTodoItem = (item) => {
    const releaseDate =
      item.release_date && isValid(parseISO(item.release_date))
        ? format(parseISO(item.release_date), 'MMMM dd, yyyy')
        : 'no release date';
    //const releaseDate = item.release_date ? format(parseISO(item.release_date), 'MMMM dd, yyyy') : 'no release date';
    const filmTitle = item.title || 'Movie title not specified';
    const overview = item.overview || 'Movie overview not specified';
    const popularity = item.popularity || 0;
    let posterURL = 'not found';
    // let posterURL = `${outOfPosterImg}`;
    if (item.poster_path) {
      posterURL = `https://image.tmdb.org/t/p/original/${item.poster_path}`;
    }

    return {
      id: item.id,
      filmTitle,
      posterURL,
      releaseDate,
      overview,
      popularity,
    };
  };

  onError = () => {
    this.setState({
      loading: false,
      error: true,
    });
  };

  render() {
    const { films, error, loading, notFound } = this.state;

    const isError = error ? <Alert message={error} description="Возникла ошибка!" type="error" showIcon /> : null;
    const spin = loading && !isError ? <Spin tip="Loading..." size="large" fullscreen /> : null;
    const notFoundMovies = notFound ? <Empty description="No movies found" /> : null;

    //const cardList = !loading && !notFound ? <CardList movieDataFromBase={films} /> : null;

    return (
      <section className="main">
        <Online>
          <Search onSearch={this.handleSearch} />
          <Space direction="vertical" className="app" align="center">
            {spin}
            {notFoundMovies}
            <CardList movieDataFromBase={films} />
            {isError}
          </Space>
        </Online>
        <Offline>
          <Alert message={error} description="You're offline right now. Check your connection." type="info" />
        </Offline>
      </section>
    );
  }
}
