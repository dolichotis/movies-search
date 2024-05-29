export default class SwapiService {
  _apiBase = 'https://api.themoviedb.org/3';
  _apiKey = 'c5417ac242052d6f3dff41a026605851';

  async getDetails(url) {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjNTQxN2FjMjQyMDUyZDZmM2RmZjQxYTAyNjYwNTg1MSIsInN1YiI6IjY2MWQ1MGE2NmY0M2VjMDE4NzVkYTE2OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.rtEhUrKlO3VNzfxEfrQNmzjiMwLDaHK6wB_9YIivol8',
      },
    };

    const response = await fetch(`${this._apiBase}${url}`, options);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    console.log('swapi');
    return await response.json();
  }

  // async getMovies() {
  //   return this.getDetails('/discover/movie');
  // }

  // async getMovies (searchQuery = 'return', pageNumber = 1) {
  //   const url = `${this._apiBase}/search/movie?query=${searchQuery}&include_adult=false&language=en-US&page=${pageNumber}`;
  //   return await this.getDetails(url);
  // }

  // async getMovies(query = '') {
  //   const searchQuery = query ? `/search/movie?query=${query}` : '/discover/movie';
  //   return await this.getDetails(searchQuery);
  // }

  async getMovies(query = '', page = 20) {
    const searchQuery = query ? `/search/movie?query=${query}&page=${page}` : `/movie/popular?page=${page}`;
    return await this.getDetails(searchQuery);
  }

  async createGuestSession() {
    const url = `${this._apiBase}/authentication/guest_session/new?api_key=${this._apiKey}`;
    const resp = await fetch(url, { method: 'GET' });
    if (!resp.ok) {
      throw new Error('Не удалось зоздать гостевую сессию');
    }
    return await resp.json();
  }

  async getRatedMovies(sessionId, page = 1) {
    const url = `/guest_session/${sessionId}/rated/movies?page=${page}&sort_by=created_at.desc&api_key=${this._apiKey}`;
    return await this.getDetails(url);
  }

  async rateMovie(movieId, rating, guestSessionId) {
    const url = `${this._apiBase}/movie/${movieId}/rating?guest_session_id=${guestSessionId}`;
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjNTQxN2FjMjQyMDUyZDZmM2RmZjQxYTAyNjYwNTg1MSIsInN1YiI6IjY2MWQ1MGE2NmY0M2VjMDE4NzVkYTE2OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.rtEhUrKlO3VNzfxEfrQNmzjiMwLDaHK6wB_9YIivol8',
      },
      body: JSON.stringify({ value: rating }),
    };

    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error('Failed to rate movie');
    }
    return await response.json();
  }
}
