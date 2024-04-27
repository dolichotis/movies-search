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

    return await response.json();
  }

  async getMovies() {
    return await this.getDetails('/discover/movie');
  }
}
