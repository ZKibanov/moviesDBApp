import { render } from '@testing-library/react';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import CardList from './components/CardList';
import 'normalize.css';

export default class MoviedbService {
  async getResource(url) {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Huoston,we have a problem ${res.status} at ${url}`);
    }
    const body = await res.json();
    return body;
  }
}

const key = 'cc1dcf97688dfad4070d8e273bcabc3b';
const query = 'return';
const pageNumber = 1;
const url = `https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${query}&page=${pageNumber}`;
const genresUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${key}&language=en-US`;

const ret = new MoviedbService();
ret
  .getResource(url)
  .then((body) => {
    console.log(body.results);
  })
  .catch((err) => {
    console.error(err);
  });

class App extends Component {
  state = {
    films: [],
  };
  constructor() {
    super();
    this.updateCard();
  }

  moviedbService = new MoviedbService();
  updateCard() {
    this.moviedbService
      .getResource(
        'https://api.themoviedb.org/3/search/movie?api_key=cc1dcf97688dfad4070d8e273bcabc3b&query=return&page=1'
      )
      .then((body) => {
        this.setState({
          films: body.results,
        });
      });
  }

  render() {
    const { films } = this.state;
    return (
      <div>
        <CardList films={films} />
      </div>
    );
  }
}
ret
  .getResource(genresUrl)
  .then((body) => console.log(body.genres))
  .catch((err) => {
    console.error(err);
  });

ReactDOM.render(<App />, document.getElementById('root'));
