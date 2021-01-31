import React, { Component } from 'react';
import { format } from 'date-fns';
import { Rate } from 'antd';
import PropTypes from 'prop-types';
import RateFilmService from '../../services/RateService';

export default class Card extends Component {
  rateService = new RateFilmService();

  static defaultProps = {
    release_date: '',
    overview: 'Sorry, we have no overview for this film in database',
    original_title: 'No title in base',
    poster_path: './images/notfound.jpg',
    genre_ids: [],
  };

  static propTypes = {
    original_title: PropTypes.string,
    release_date: PropTypes.string,
    overview: PropTypes.string,
    poster_path: PropTypes.string,
    genre_ids: PropTypes.arrayOf(PropTypes.number),
  };

  constructor() {
    super();
    this.state = {};
  }

  handleChange = (ev) => {
    const { filmID, sessionId, updateRated } = this.props;
    this.rateService
      .rateFilm(ev, filmID, sessionId)
      .then((body) => console.log(body.status_message + ' we have result'))
      .then(updateRated());
  };

  render() {
    const fileSize = 'w500';
    const {
      original_title: originalTitle,
      overview,
      release_date: releaseDate,
      poster_path: posterPath,
      vote_average: vote,
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
    let voteColor;
    if (vote < 3) {
      voteColor = '1';
    } else if (vote > 7) {
      voteColor = '4';
    } else if (vote <= 5 && vote >= 3) {
      voteColor = '2';
    } else {
      voteColor = '3';
    }
    return (
      <div className="card">
        <div>
          <img className="card__image" src={pathToPosters} alt="film poster" />
        </div>
        <div className="card__text-area">
          <div className="card__header-wrapper">
            <h5 className="card__header">{originalTitle}</h5>
            <span className="card__header-rating" data-color={voteColor}>
              {vote}
            </span>
          </div>
          <p className="card__date">{date}</p>
          <span className="card__genres">{genreIds}</span>
          <p className="card__description">{filmDescripton}</p>
          <Rate allowHalf count="10" value={vote} onChange={this.handleChange} />
        </div>
      </div>
    );
  }
}
