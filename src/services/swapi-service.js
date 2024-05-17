export default class SwapiService {
  _apiBase = 'https://api.themoviedb.org/3';

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

  async getMovies(query = '') {
    const searchQuery = query ? `/search/movie?query=${query}` : '/discover/movie';
    return await this.getDetails(searchQuery);
  }
}
