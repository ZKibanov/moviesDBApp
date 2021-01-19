import React, { Component } from 'react';
import { Alert, Spin } from 'antd';
import { VideoCameraFilled, CloseCircleOutlined } from '@ant-design/icons';
import CardList from '../CardList';
import SearchForm from '../SearchForm';
import MoviedbService from '../MoviedbService';
import 'antd/dist/antd.css';
import 'normalize.css';

const key = 'cc1dcf97688dfad4070d8e273bcabc3b';
const genresUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${key}&language=en-US`;

const ret = new MoviedbService();

export default class App extends Component {
  state = {
    isLoading: false,
    error: false,
  };

  moviedbService = new MoviedbService();

  onFilmsLoaded = (body) => {
    this.setState({
      page: body.page,
      totalResults: body.total_results,
      films: body.results,
      isLoading: false,
    });
  };

  onSearch = (text, pageNumber = 1) => {
    const { query } = this.state;
    const actualQuery = text || query;
    if (text) {
      this.setState({
        query: text,
      });
    }
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${actualQuery}&page=${pageNumber}`;
    this.updateCard(url);
  };

  onError = (err) => {
    /* eslint no-console: [0, { allow: ["warn", "error"] }] */
    // custom console
    console.log(err.message);
    this.setState({
      error: true,
      isLoading: false,
    });
  };

  updateCard(url) {
    this.setState({
      isLoading: true,
    });
    this.moviedbService
      .getResource(url)
      .then((body) => this.onFilmsLoaded(body))
      .catch((err) => this.onError(err));
  }

  render() {
    const { films, isLoading, error, totalResults, page } = this.state;
    const hasData = !(isLoading || error);
    const spinner = isLoading ? <Spin size="large" /> : null;
    const content = hasData ? (
      <CardList films={films} totalResults={totalResults} page={page} onPageNumberChange={this.onSearch} />
    ) : null;
    const alertIcon = error ? (
      <CloseCircleOutlined style={{ fontSize: '26px' }} />
    ) : (
      <VideoCameraFilled style={{ fontSize: '26px' }} />
    );
    const alertType = error
      ? ['something went wrong,please try another request', 'error']
      : ['films base loaded successfully', 'success'];

    return (
      <div>
        <SearchForm onSearch={this.onSearch} />
        <div className="card-list__container">
          <Alert closable="true" showIcon="true" icon={alertIcon} message={alertType[0]} type={alertType[1]} />
          {spinner}
          {content}
        </div>
      </div>
    );
  }
}

ret
  .getResource(genresUrl)
  // custom console
  .then((body) => console.log(body.genres))
  .catch((err) => {
    // custom console
    console.error(err.message);
  });
