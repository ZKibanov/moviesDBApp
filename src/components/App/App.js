import React, { Component } from 'react';
import { Alert, Spin } from 'antd';
import { VideoCameraFilled, CloseCircleOutlined, ArrowUpOutlined } from '@ant-design/icons';
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
      tab: 'Search',
    };
    this.getRatedFilms(guestSessionId);
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
    const { query, tab, guestSessionId } = this.state;
    const actualQuery = text || query;
    if (text) {
      this.setState({
        query: text,
      });
    }
    let url;
    if (tab === 'Search') {
      url = `https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${actualQuery}&page=${pageNumber}`;
    } else {
      url = `https://api.themoviedb.org/3/guest_session/${guestSessionId}/rated/movies?api_key=${key}&language=en-US&sort_by=created_at.asc&page=${pageNumber}`;
    }
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

  getRatedFilms(guestSessionId, pageNumber = 1) {
    const sessionURL = `https://api.themoviedb.org/3/guest_session/${guestSessionId}/rated/movies?api_key=${key}&language=en-US&sort_by=created_at.asc&page=${pageNumber}`;
    this.moviedbService.getResource(sessionURL).then((body) => this.setState({ rated: body }));
  }

  componentDidMount() {
    const { guestSessionExpiresAt, guestSessionId } = this.state;
    if (guestSessionExpiresAt && this.sessServ.guestSessionIsValid(guestSessionExpiresAt)) {
      console.log(this.sessServ.guestSessionIsValid(guestSessionExpiresAt));
    } else {
      this.sessServ.getGuestSessionInfo(guestSessionIDRequest);
    }
  }

  componentDidCatch() {
    console.log('Houston, we have a proplem!');
    this.setState({ error: true });
  }

  chooseTab = (ev) => {
    const tab = ev.target.textContent;
    if (tab === 'Search') {
      this.setState({
        query: null,
        films: null,
      });
    } else {
      this.onFilmsLoaded(this.state.rated);
    }
    this.setState({ tab: tab });
    console.log(ev.target.textContent);
  };

  updateRatedFilms = () => {
    const { guestSessionId } = this.state;
    this.getRatedFilms(guestSessionId);
  };

  render() {
    console.log('render');
    const { films, isLoading, error, totalResults, page, guestSessionId, tab } = this.state;
    const hasData = !(isLoading || error) && films;
    const spinner = isLoading ? <Spin size="large" /> : null;
    const content = hasData ? (
      <CardList
        updateRated={this.updateRatedFilms}
        films={films}
        totalResults={totalResults}
        page={page}
        onPageNumberChange={this.onSearch}
        sessionId={guestSessionId}
      />
    ) : null;

    let searchForm;
    if (tab === 'Search') {
      searchForm = <SearchForm onSearch={this.onSearch} />;
    } else {
      searchForm = null;
    }

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
        {searchForm}
        <div className="card-list__container">
          <Alert closable="true" showIcon="true" icon={alertIcon} message={alertType[0]} type={alertType[1]} />
          {spinner}
          {content}
        </div>
      </div>
    );
  }
}
