import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Alert, Spin } from 'antd';
import { VideoCameraFilled, CloseCircleOutlined } from '@ant-design/icons';
import CardList from './components/CardList';
import MoviedbService from './components/MoviedbService';
import 'antd/dist/antd.css';
import 'normalize.css';

const key = 'cc1dcf97688dfad4070d8e273bcabc3b';
const query = 'Bill';
const pageNumber = 1;
const url = `https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${query}&page=${pageNumber}`;
const genresUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${key}&language=en-US`;

const ret = new MoviedbService();

class App extends Component {
  state = {
    isLoading: true,
    error: false,
  };

  moviedbService = new MoviedbService();

  constructor() {
    super();
    this.updateCard();
  }

  onFilmsLoaded = (body) => {
    this.setState({
      films: body.results,
      isLoading: false,
    });
  };

  onError = (err) => {
    console.log(err.message);
    this.setState({
      error: true,
      isLoading: false,
    });
  };

  updateCard() {
    this.moviedbService
      .getResource(url)
      .then((body) => this.onFilmsLoaded(body))
      .catch((err) => this.onError(err));
  }

  render() {
    const { films, isLoading, error } = this.state;
    const hasData = !(isLoading || error);
    const spinner = isLoading ? <Spin size="large" /> : null;
    const content = hasData ? <CardList films={films} /> : null;
    const alertIcon = error ? (
      <CloseCircleOutlined style={{ fontSize: '26px' }} />
    ) : (
      <VideoCameraFilled style={{ fontSize: '26px' }} />
    );
    const alertType = error
      ? ['something went wrong,please try another request', 'error']
      : ['films base loaded successfully', 'success'];

    return (
      <div className="card-list__container">
        <Alert closable="true" showIcon="true" icon={alertIcon} message={alertType[0]} type={alertType[1]} />
        {spinner}
        {content}
      </div>
    );
  }
}

ret
  .getResource(genresUrl)
  .then((body) => console.log(body.genres))
  .catch((err) => {
    console.error(err.message);
  });

ReactDOM.render(<App />, document.getElementById('root'));
