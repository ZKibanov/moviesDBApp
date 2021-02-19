import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Spin } from 'antd';
import SessionService from './api/SessionService';
import { ServiceProvider } from './services/ServiceContext';
import App from './components/App';

class Page extends Component {
  state = {
    isLoading: true,
  };

  componentDidMount = () => {
    this.initData();
  };

  initData() {
    const promiseArray = [];
    promiseArray.push(
      SessionService.getGuestSessionInfo().then((body) => {
        this.setState({ sessionId: body.guest_session_id });
      })
    );
    promiseArray.push(
      SessionService.getGenres().then((body) => {
        this.setState({ genres: body.genres });
      })
    );
    Promise.all(promiseArray).then(this.setState({ isLoading: false }));
  }

  render() {
    const { isLoading, sessionId, genres } = this.state;
    const cont = isLoading ? (
      <Spin />
    ) : (
      <ServiceProvider value={genres}>
        <App guestSessionId={sessionId} />
      </ServiceProvider>
    );
    return cont;
  }
}

ReactDOM.render(<Page />, document.getElementById('root'));
