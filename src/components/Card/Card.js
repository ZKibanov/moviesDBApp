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
    cardGenres: [],
    filmID: null,
    sessionId: null,
    updateRatedFilms: () => {},
    vote_average: 0,
    value: 0,
  };

  static propTypes = {
    original_title: PropTypes.string,
    release_date: PropTypes.string,
    overview: PropTypes.string,
    poster_path: PropTypes.string,
    cardGenres: PropTypes.arrayOf(PropTypes.object),
    filmID: PropTypes.number,
    sessionId: PropTypes.string,
    updateRatedFilms: PropTypes.func,
    vote_average: PropTypes.number,
    value: PropTypes.number,
  };

  constructor() {
    super();
    this.state = {};
  }

  handleChange = (ev) => {
    const { filmID, sessionId, updateRatedFilms } = this.props;
    updateRatedFilms(filmID, ev);
    this.rateService.rateFilm(ev, filmID, sessionId);
  };

  render() {
    const fileSize = 'w500';
    const {
      original_title: originalTitle,
      overview,
      value,
      release_date: releaseDate,
      poster_path: posterPath,
      vote_average: vote,
      cardGenres,
    } = this.props;
    const date = releaseDate ? format(new Date(releaseDate), 'PPP') : 'no information';

    let pathToPosters;

    if (posterPath) {
      pathToPosters = `http://image.tmdb.org/t/p/${fileSize}${posterPath}`;
    } else {
      pathToPosters = './images/notfound.jpg';
    }

    function stringSizeControl(str, title, cardGenresArray) {
      console.log(`${title} ${title.length}`);
      let expectedStringLength = 235;
      if (title.length >= 17) {
        expectedStringLength -= 65;
      } else if (title.length >= 34) {
        expectedStringLength -= 130;
      } else if (title.length >= 45) {
        expectedStringLength -= 160;
      }

      if (cardGenresArray.length > 3 || (cardGenresArray.length === 3 && cardGenres.includes('Science Fiction'))) {
        expectedStringLength -= 65;
      }

      const string = !str ? 'Sorry, we have no overview for this film in database' : str;
      if (string.length >= expectedStringLength) {
        let resultString = string.substr(0, expectedStringLength);
        const whitespaceIndex = resultString.lastIndexOf(' ');
        resultString = `${resultString.substr(0, whitespaceIndex)} ...`;
        return resultString;
      }
      return string;
    }

    const filmDescripton = stringSizeControl(overview, originalTitle, cardGenres);
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

    const descriptionBlock = <p className="card__description">{filmDescripton}</p>;

    const arrayOfCardGenres = cardGenres.map((genre) => <span className="card__genres">{genre}</span>);
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
          <p className="card__genres--wrap">{arrayOfCardGenres}</p>
          {descriptionBlock}
          <Rate allowHalf count="10" defaultValue={0} value={value} onChange={this.handleChange} />
        </div>
      </div>
    );
  }
}
