import React, { Component } from 'react';
import { format } from 'date-fns';
import PropTypes from 'prop-types';

export default class Card extends Component {
  static defaultProps = {
    release_date: '',
    overview: 'no overview for this film',
    original_title: 'No title in base',
    poster_path: './images/notfound.jpg',
    genre_ids: [],
  };

  static propTypes = {
    original_title: PropTypes.string,
    release_date: PropTypes.number,
    overview: PropTypes.string,
    poster_path: PropTypes.string,
    genre_ids: PropTypes.arrayOf(PropTypes.number),
  };

  state = {};

  render() {
    const fileSize = 'w500';
    const {
      original_title: originalTitle,
      overview,
      release_date: releaseDate,
      poster_path: posterPath,
      genre_ids: genreIds,
    } = this.props;
    const date = releaseDate ? format(new Date(releaseDate), 'PPP') : 'no information';

    let pathToPosters;

    if (posterPath) {
      pathToPosters = `http://image.tmdb.org/t/p/${fileSize}${posterPath}`;
    } else {
      pathToPosters = './images/notfound.jpg';
    }

    function stringSizeControl(str) {
      const string = !str ? 'Sorry, we have no overview for this film in database' : str;
      if (string.length >= 210) {
        let resultString = string.substr(0, 210);
        const whitespaceIndex = resultString.lastIndexOf(' ');
        resultString = `${resultString.substr(0, whitespaceIndex)} ...`;
        return resultString;
      }
      return string;
    }

    const filmDescripton = stringSizeControl(overview);

    return (
      <div className="card">
        <div>
          <img className="card__image" src={pathToPosters} alt="film poster" />
        </div>
        <div className="card__text-area">
          <h5 className="card__header">{originalTitle}</h5>
          <p className="card__date">{date}</p>
          <span className="card__genres">{genreIds}</span>
          <p className="card__description">{filmDescripton}</p>
        </div>
      </div>
    );
  }
}
