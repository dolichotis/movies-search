import React, { Component } from 'react';
import { Input } from 'antd';
import debounce from 'lodash.debounce';

export default class Search extends Component {
  handleSearch = debounce((value = '') => {
    const { onSearch } = this.props;
    console.log('search');
    onSearch(value); // Вызываем функцию getMoviesData и передаем ей значение поискового запроса
  }, 1000);

  render() {
    return (
      <Input
        placeholder="Type to search..."
        size="large"
        onChange={(e) => this.handleSearch(e.target.value)} // Вызываем функцию handleSearch при изменении значения поля ввода
        rootClassName="inputPanel"
      />
    );
  }
}
