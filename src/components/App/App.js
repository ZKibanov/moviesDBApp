import React, { Component } from 'react';
import { Alert, Spin } from 'antd';
import { VideoCameraFilled, CloseCircleOutlined, ArrowUpOutlined } from '@ant-design/icons';
import Navigation from '../Navigation';
import CardList from '../CardList';
import SearchForm from '../SearchForm';
import { key, urlBase } from '../../api/apiVariables';
import MoviedbService from '../../services/MoviedbService';
import SessionService from '../../api/SessionService';
import { ServiceProvider } from '../../services/ServiceContext';
import 'antd/dist/antd.css';
import 'normalize.css';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      error: false,
      tab: 'Search',
    };
  }

  componentDidMount() {
    this.initData();
  }

  componentDidCatch() {
    this.setState({ error: true });
  }

  onError = () => {
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
      url = `${urlBase}/search/movie?api_key=${key}&query=${actualQuery}&page=${pageNumber}`;
    } else {
      url = `${urlBase}/guest_session/${guestSessionId}/rated/movies?api_key=${key}&language=en-US&sort_by=created_at.asc&page=${pageNumber}`;
    }
    this.updateCard(url);
  };

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
    const { guestSessionId } = this.state;
    if (tab === 'Search') {
      this.setState({
        query: null,
        films: null,
      });
    } else {
      const ratedFilmsUrl = `${urlBase}/guest_session/${guestSessionId}/rated/movies?api_key=${key}&language=en-US&sort_by=created_at.asc`;
      this.updateCard(ratedFilmsUrl);
    }
    this.setState({ tab });
  };

  initData() {
    const sessionPromise = SessionService.getGuestSessionInfo().then((body) => {
      this.setState({ guestSessionId: body.guest_session_id });
    });

    const genresPromise = SessionService.getGenres().then((body) => {
      this.setState({ genres: body.genres });
    });
    const promiseArray = [sessionPromise, genresPromise];
    Promise.all(promiseArray).then(this.setState({ isLoading: false }));
  }

  updateCard(url) {
    this.setState({
      isLoading: true,
    });
    MoviedbService.getResource(url)
      .then((body) => this.onFilmsLoaded(body))
      .catch(() => this.onError());
  }

  render() {
    const { films, isLoading, error, totalResults, page, tab, rated, guestSessionId, genres } = this.state;

    const searchForm = tab === 'Search' ? <SearchForm onSearch={this.onSearch} /> : null;

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

    const hasData = !(isLoading || error) && films;
    const spinner = isLoading ? <Spin size="large" /> : null;

    const content = hasData ? (
      <ServiceProvider value={genres}>
        <CardList
          rated={rated}
          films={films}
          updateRatedFilms={this.updateRatedFilms}
          totalResults={totalResults}
          sessionId={guestSessionId}
          page={page}
          onPageNumberChange={this.onSearch}
        />
      </ServiceProvider>
    ) : null;

    return (
      <div>
        <header>
          <Navigation chooseTab={this.chooseTab} tab={tab} />
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
