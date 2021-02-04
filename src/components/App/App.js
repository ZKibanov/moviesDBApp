import React, { Component } from 'react';
import { Alert, Spin } from 'antd';
import { VideoCameraFilled, CloseCircleOutlined, ArrowUpOutlined } from '@ant-design/icons';
import CardList from '../CardList';
import SearchForm from '../SearchForm';
import MoviedbService from '../MoviedbService';
import GuestSessionService from '../../services/GuestSessionService/GuestSessionService';
import 'antd/dist/antd.css';
import 'normalize.css';

const key = 'cc1dcf97688dfad4070d8e273bcabc3b';
const guestSessionIDRequest = `https://api.themoviedb.org/3/authentication/guest_session/new?api_key=${key}`;

export default class App extends Component {
  moviedbService = new MoviedbService();

  sessServ = new GuestSessionService();

  constructor() {
    super();
    let guestSessionId;
    let guestSessionExpiresDate;
    if (localStorage.getItem('guestSessionId') === null) {
      this.sessServ.getGuestSessionInfo(guestSessionIDRequest);
    } else {
      guestSessionId = localStorage.getItem('guestSessionId');
      guestSessionExpiresDate = localStorage.getItem('guestSessionExpiresAt');
    }
    this.state = {
      guestSessionId,
      guestSessionExpiresAt: guestSessionExpiresDate,
      isLoading: false,
      error: false,
      tab: 'Search',
    };
    this.getRatedFilms(guestSessionId);
    this.getGenres();
  }

  componentDidMount() {
    const { guestSessionExpiresAt } = this.state;
    if (!guestSessionExpiresAt && this.sessServ.guestSessionIsValid(guestSessionExpiresAt)) {
      this.sessServ.getGuestSessionInfo(guestSessionIDRequest);
    }
  }

  componentDidCatch() {
    console.log('Houston, we have a proplem!');
    this.setState({ error: true });
  }

  getGenres() {
    const genresUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${key}&language=en-US`;
    this.moviedbService.getResource(genresUrl).then((body) => this.setState({ genres: body.genres }));
  }

  onError = (err) => {
    /* eslint no-console: [0, { allow: ["warn", "error"] }] */
    // custom console
    console.log(err.message);
    this.setState({
      error: true,
      isLoading: false,
    });
  };

  onSearch = (text, pageNumber = 1) => {
    const { query, tab, guestSessionId } = this.state;
    const actualQuery = text || query;
    if (text) {
      this.setState({
        error: false,
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

  getRatedFilms(guestSessionId) {
    if (!guestSessionId) {
      return;
    }
    let pageNumber = 1;
    const sessionURL = `https://api.themoviedb.org/3/guest_session/${guestSessionId}/rated/movies?api_key=${key}&language=en-US&sort_by=created_at.asc&page=${pageNumber}`;
    this.moviedbService.getResource(sessionURL).then((body) => {
      if (body.total_pages === 1) {
        this.setState({ rated: body.results });
      } else {
        console.log(body.total_pages);
        const promiseArray = [];
        let i = 1;
        while (i <= body.total_pages) {
          pageNumber = i;
          promiseArray.push(
            this.moviedbService.getResource(
              `https://api.themoviedb.org/3/guest_session/${guestSessionId}/rated/movies?api_key=${key}&language=en-US&sort_by=created_at.asc&page=${pageNumber}`
            )
          );
          i += 1;
        }
        Promise.all(promiseArray).then((arrOfResults) => {
          const ratedFilmsArrray = [];
          arrOfResults.forEach((el) => ratedFilmsArrray.push(...el.results));
          this.setState({ rated: ratedFilmsArrray });
        });
      }
    });
  }

  updateRatedFilms = (id, rating) => {
    const { rated } = this.state;
    const newRatedFilms = rated ? [...rated] : [];
    newRatedFilms.push({
      id,
      rating,
    });
    this.setState({ rated: newRatedFilms });
  };

  onFilmsLoaded = (body) => {
    this.setState({
      page: body.page,
      totalResults: body.total_results,
      films: body.results,
      isLoading: false,
    });
  };

  chooseTab = (ev) => {
    const tab = ev.target.textContent;
    if (tab === 'Search') {
      this.setState({
        query: null,
        films: null,
      });
    } else {
      let { guestSessionId, guestSessionExpiresAt } = this.state;
      if (!guestSessionId) {
        guestSessionId = localStorage.getItem('guestSessionId');
        guestSessionExpiresAt = localStorage.getItem('guestSessionExpiresAt');
        this.setState({ guestSessionId, guestSessionExpiresAt });
      }
      const ratedFilmsUrl = `https://api.themoviedb.org/3/guest_session/${guestSessionId}/rated/movies?api_key=${key}&language=en-US&sort_by=created_at.asc`;
      this.updateCard(ratedFilmsUrl);
    }
    this.setState({ tab });
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
    const { films, isLoading, error, totalResults, page, guestSessionId, tab, genres, rated } = this.state;
    const hasData = !(isLoading || error) && films;
    const spinner = isLoading ? <Spin size="large" /> : null;
    const content = hasData ? (
      <CardList
        genres={genres}
        rated={rated}
        films={films}
        updateRatedFilms={this.updateRatedFilms}
        totalResults={totalResults}
        sessionId={guestSessionId}
        page={page}
        onPageNumberChange={this.onSearch}
      />
    ) : null;

    let searchForm;
    let tabSearchClasses;
    let tabRatedClasses;
    if (tab === 'Search') {
      tabSearchClasses = 'nav-button nav-button__active';
      tabRatedClasses = 'nav-button';
      searchForm = <SearchForm onSearch={this.onSearch} />;
    } else {
      tabSearchClasses = 'nav-button';
      tabRatedClasses = 'nav-button nav-button__active';
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
            <button type="button" className={tabSearchClasses} onClick={this.chooseTab}>
              Search
            </button>
            <button type="button" className={tabRatedClasses} onClick={this.chooseTab}>
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
