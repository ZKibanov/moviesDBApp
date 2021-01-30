import React, { Component } from 'react';
import { Alert, Spin } from 'antd';
import { VideoCameraFilled, CloseCircleOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { MoviedbServiceProvider } from '../../services/MoviedbServiceContext';
import CardList from '../CardList';
import SearchForm from '../SearchForm';
import MoviedbService from '../MoviedbService';
import GuestSessionService from '../../services/GuestSessionService/GuestSessionService.js';
import 'antd/dist/antd.css';
import 'normalize.css';

const key = 'cc1dcf97688dfad4070d8e273bcabc3b';
const genresUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${key}&language=en-US`;
const guestSessionIDRequest = `https://api.themoviedb.org/3/authentication/guest_session/new?api_key=${key}`;
const gSessionUrl = `https://api.themoviedb.org/3/guest_session/1/rated/movies?api_key=${key}&language=en-US&sort_by=created_at.asc`;

export default class App extends Component {
  moviedbService = new MoviedbService();
  sessServ = new GuestSessionService();

  constructor() {
    super();
    console.log('construct');
    let guestSessionId;
    let guestSessionExpiresDate;
    if (!localStorage.getItem('guestSessionId')) {
      guestSessionId = null;
      guestSessionExpiresDate = null;
    } else {
      guestSessionId = localStorage.getItem('guestSessionId');
      guestSessionExpiresDate = localStorage.getItem('guestSessionExpiresAt');
    }
    this.state = {
      guestSessionId: guestSessionId,
      guestSessionExpiresAt: guestSessionExpiresDate,
      isLoading: false,
      error: false,
    };
  }

  onFilmsLoaded = (body) => {
    console.log(body);
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

  componentDidMount() {
    const { guestSessionExpiresAt } = this.state;
    if (guestSessionExpiresAt && this.sessServ.guestSessionIsValid(guestSessionExpiresAt)) {
      console.log(this.sessServ.guestSessionIsValid(guestSessionExpiresAt));
    } else {
      console.log(guestSessionExpiresAt);
      this.sessServ.getGuestSessionInfo(guestSessionIDRequest);
    }
  }

  componentDidCatch() {
    console.log('Houston, we have a proplem!');
    this.setState({ error: true });
  }

  chooseTab = (ev) => {
    const tab = ev.target.textContent;
    if (tab === 'Rated') {
      console.log('ioioi');
    }
    this.setState({ tab: tab });
    console.log(ev.target.textContent);
  };

  render() {
    console.log('render');
    const { films, isLoading, error, totalResults, page, guestSessionId } = this.state;

    const sessionURL = `https://api.themoviedb.org/3/guest_session/${guestSessionId}/rated/movies?api_key=${key}&language=en-US&sort_by=created_at.asc`;
    this.moviedbService.getResource(sessionURL).then((body) => console.log(body));

    const hasData = !(isLoading || error) && films;
    const spinner = isLoading ? <Spin size="large" /> : null;
    const content = hasData ? (
      <CardList
        films={films}
        totalResults={totalResults}
        page={page}
        onPageNumberChange={this.onSearch}
        sessionId={guestSessionId}
      />
    ) : null;

    let alertIcon;
    let alertType;
    if (error) {
      alertIcon = <CloseCircleOutlined style={{ fontSize: '26px' }} />;
      alertType = ['something went wrong,please try another request', 'error'];
    } else if (!error && (!films || films.length === 0)) {
      alertIcon = <ArrowUpOutlined style={{ fontSize: '26px' }} />;
      alertType = ['please enter new request', 'info'];
    } else {
      alertIcon = <VideoCameraFilled style={{ fontSize: '26px' }} />;
      alertType = ['films base loaded successfully', 'success'];
    }

    return (
      <div>
        <MoviedbServiceProvider value={this.moviedbService}>
          <header>
            <nav className="nav">
              <button className="nav-button nav-button__active" onClick={this.chooseTab}>
                Search
              </button>
              <button className="nav-button" onClick={this.chooseTab}>
                Rated
              </button>
            </nav>
          </header>
          <SearchForm onSearch={this.onSearch} />
          <div className="card-list__container">
            <Alert closable="true" showIcon="true" icon={alertIcon} message={alertType[0]} type={alertType[1]} />
            {spinner}
            {content}
          </div>
        </MoviedbServiceProvider>
      </div>
    );
  }
}
