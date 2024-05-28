import React, { Component } from 'react';
import { Alert, Spin, Empty, Space, Pagination, Tabs } from 'antd';
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
    currentPage: 1,
    totalResults: 0,
    resPerPage: 10,
    searchQuery: '',
    guestSessionId: null,
  };

  swapiService = new SwapiService();

  componentDidMount() {
    this.createGuestSession();
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
      .catch((error) => {
        this.setState({ error: error.message, loading: false });
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
    const { films, ratedFilms, error, loading, notFound, currentPage, totalResults, resPerPage } = this.state;

    const isError = error ? <Alert message={error} description="Возникла ошибка!" type="error" showIcon /> : null;
    const spin = loading && !isError ? <Spin tip="Loading..." size="large" fullscreen /> : null;
    const notFoundMovies = notFound ? <Empty description="No movies found" /> : null;

    //const cardList = !loading && !notFound ? <CardList movieDataFromBase={films} /> : null;

    const items = [
      {
        key: '1',
        label: 'Search',
        rootClassName: 'tabsWrapper',
        children: (
          <>
            <Search onSearch={this.handleSearch} />
            <Space direction="vertical" className="app" align="center">
              {spin}
              {notFoundMovies}
              <CardList movieDataFromBase={films} />
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
          </>
        ),
      },
      {
        key: '2',
        label: 'Rated',
        children: (
          <Space direction="vertical" className="app" align="center">
            {spin}
            {notFoundMovies}
            <CardList movieDataFromBase={ratedFilms} />
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
        ),
      },
    ];

    return (
      <section className="main">
        <Online>
          <Tabs defaultActiveKey="1" items={items} />
        </Online>
        <Offline>
          <Alert message={error} description="You're offline right now. Check your connection." type="info" />
        </Offline>
      </section>
    );
  }
}
