import React, { Component } from 'react';
import { Alert, Spin, Empty, Space, Pagination, Tabs } from 'antd';
import { Offline, Online } from 'react-detect-offline';
import 'antd/dist/reset.css';
import './app.css';
import { format, isValid, parseISO } from 'date-fns';

import SwapiService from '../../services/swapi-service';
import Search from '../search/search';
import CardList from '../card-list/card-list';
import { Context } from '../genre-context/genre-context';

export default class App extends Component {
  state = {
    films: [],
    ratedFilms: [],
    error: false,
    loading: true,
    isOnline: navigator.onLine,
    notFound: false,
    currentPage: 1,
    totalResults: 0,
    resPerPage: 10,
    searchQuery: '',
    guestSessionId: null,
    genresList: [],
  };

  swapiService = new SwapiService();

  componentDidMount() {
    this.createGuestSession();
    this.fetchGenreMovies();
    this.fetchMovies();
  }

  createGuestSession = () => {
    this.swapiService
      .createGuestSession()
      .then((data) => {
        this.setState({ guestSessionId: data.guest_session_id });
        console.log('Guest session created:', data);
      })
      .catch((err) => {
        this.setState({ error: err.message });
      });
  };

  fetchMovies = (query = '', page = 1) => {
    this.setState({
      films: [],
      error: false,
      loading: true,
      notFound: false,
    });

    this.swapiService
      .getMovies(query, page)
      .then((data) => {
        console.log(data);
        if (data.results.length === 0) {
          this.setState({ notFound: true, loading: false });
        } else {
          this.setState({ films: data.results, loading: false, currentPage: page, totalResults: data.total_pages });
        }
      })
      .catch((error) => {
        this.setState({ error: error.message, loading: false });
      });
  };

  fetchRatedMovies = (page = 1) => {
    const { guestSessionId } = this.state;

    this.setState({
      ratedFilms: [],
      error: false,
      loading: true,
      notFound: false,
    });

    this.swapiService
      .getRatedMovies(guestSessionId, page)
      .then((data) => {
        if (data.results.length === 0) {
          this.setState({ notFound: true, loading: false });
        } else {
          this.setState({
            ratedFilms: data.results,
            loading: false,
            currentPage: page,
            totalResults: data.total_pages,
          });
        }
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  };

  fetchGenreMovies = () => {
    this.swapiService
      .getGenres()
      .then((data) => {
        this.setState({
          genresList: data.genres,
        });
      })
      .catch(() => {
        this.setState({
          loading: false,
          notFound: false,
          error: true,
        });
      });
  };

  handleSearch = (query) => {
    this.fetchMovies(query, 1);
  };

  handlePageChange = (page) => {
    const { searchQuery } = this.state;
    this.fetchMovies(searchQuery, page);
    this.setState({ currentPage: page });
  };

  handleRatedPageChange = (page) => {
    this.fetchRatedMovies(page);
    this.setState({ currentPage: page });
  };

  handleRatingChange = (movieId, rating) => {
    const { guestSessionId } = this.state;
    this.swapiService.rateMovie(movieId, rating, guestSessionId).then((resp) => {
      if (resp.success) {
        this.setState((prevState) => ({
          ratings: {
            ...prevState.ratings,
            [movieId]: rating,
          },
        }));
      }
    });
  };

  createTodoItem = (item) => {
    const releaseDate =
      item.release_date && isValid(parseISO(item.release_date))
        ? format(parseISO(item.release_date), 'MMMM dd, yyyy')
        : 'no release date';
    const filmTitle = item.title || 'Movie title not specified';
    const overview = item.overview || 'Movie overview not specified';
    const popularity = item.popularity || 0;
    let posterURL = 'not found';
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

  handleTabChange = (key) => {
    if (key === '1') {
      this.fetchMovies();
    }
    if (key === '2') {
      this.fetchRatedMovies();
    }
  };

  render() {
    const {
      films,
      ratedFilms,
      ratings,
      error,
      loading,
      notFound,
      currentPage,
      totalResults,
      resPerPage,
      guestSessionId,
      genresList,
    } = this.state;

    const isError = error ? <Alert message={error} description="Возникла ошибка!" type="error" showIcon /> : null;
    const spin = loading && !isError ? <Spin tip="Loading..." size="large" fullscreen /> : null;
    const notFoundMovies = notFound ? <Empty description="No movies found" /> : null;

    const contextValue = { films, ratedFilms, guestSessionId };

    //const cardList = !loading && !notFound ? <CardList movieDataFromBase={films} /> : null;

    const items = [
      {
        key: '1',
        label: 'Search',
        children: (
          <div className="tabsWrapper">
            <Search onSearch={this.handleSearch} />
            <Space direction="vertical" className="app" align="center">
              {spin}
              {notFoundMovies}
              <CardList
                movieDataFromBase={films}
                ratings={ratings}
                onRatingChange={this.handleRatingChange}
                genresList={genresList}
              />
              {isError}
              <Pagination
                current={currentPage}
                total={totalResults}
                pageSize={resPerPage}
                onChange={this.handlePageChange}
                showSizeChanger={false}
                rootClassName="paginationWrapper"
              />
            </Space>
          </div>
        ),
      },
      {
        key: '2',
        label: 'Rated',
        children: (
          <div className="tabsWrapper">
            <Space direction="vertical" className="app" align="center">
              {spin}
              {notFoundMovies}
              <CardList
                movieDataFromBase={ratedFilms}
                ratings={ratings}
                onRatingChange={this.handleRatingChange}
                genresList={genresList}
              />
              {isError}
              <Pagination
                current={currentPage}
                total={totalResults}
                pageSize={resPerPage}
                onChange={this.handleRatedPageChange}
                showSizeChanger={false}
                rootClassName="paginationWrapper"
              />
            </Space>
          </div>
        ),
      },
    ];

    return (
      <section className="main">
        <Online>
          <Context.Provider value={contextValue}>
            <Tabs rootClassName="tabs" defaultActiveKey="1" items={items} onChange={this.handleTabChange} />
          </Context.Provider>
        </Online>
        <Offline>
          <Alert message={error} description="You're offline right now. Check your connection." type="info" />
        </Offline>
      </section>
    );
  }
}
