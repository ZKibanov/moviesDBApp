import React from 'react';
import { format } from 'date-fns';
import { Rate } from 'antd';
import PropTypes from 'prop-types';
import RateFilmService from '../../api/RateService';

function Card(props) {
  const handleChange = (ev) => {
    const { filmID, sessionId, updateRatedFilms } = props;
    if (ev) {
      RateFilmService.rateFilm(ev, filmID, sessionId).then((response) =>
        response.success ? updateRatedFilms(filmID, ev) : null
      );
    }
  };

  const fileSize = 'w500';
  const {
    original_title: originalTitle,
    overview,
    value,
    release_date: releaseDate,
    poster_path: posterPath,
    vote_average: voteAverage,
    cardGenres,
  } = props;
  const date = releaseDate ? format(new Date(releaseDate), 'PPP') : 'no information';

  const pathToPosters = posterPath ? `http://image.tmdb.org/t/p/${fileSize}${posterPath}` : './images/notfound.jpg';

  function stringSizeControl(cardDescription, title, cardGenresArray) {
    let expectedStringLength = 245;
    if (title.length >= 17 && title.length < 34) {
      expectedStringLength -= 65;
    } else if (title.length >= 34 && title.length < 45) {
      expectedStringLength -= 130;
    } else if (title.length >= 45) {
      expectedStringLength -= 175;
    }

    if (cardGenresArray.length > 3 || (cardGenresArray.length === 3 && cardGenres.includes('Science Fiction'))) {
      expectedStringLength -= 65;
    }

    const string = !cardDescription ? 'Sorry, we have no overview for this film in database' : cardDescription;
    if (string.length >= expectedStringLength) {
      let resultString = string.substr(0, expectedStringLength);
      const whitespaceIndex = resultString.lastIndexOf(' ');
      resultString = `${resultString.substr(0, whitespaceIndex)} ...`;
      return resultString;
    }
    return string;
  }

  const filmDescripton = stringSizeControl(overview, originalTitle, cardGenres);

  function getVoteColor(vote) {
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
    return voteColor;
  }

  const arrayOfCardGenres = cardGenres.map((genre) => (
    <span key={genre} className="card__genres">
      {genre}
    </span>
  ));

  return (
    <div className="card">
      <div>
        <img className="card__image" src={pathToPosters} alt="film poster" />
      </div>
      <div className="card__text-area">
        <div className="card__header-wrapper">
          <h5 className="card__header">{originalTitle}</h5>
          <span className="card__header-rating" data-color={getVoteColor(voteAverage)}>
            {voteAverage}
          </span>
        </div>
        <p className="card__date">{date}</p>
        <p className="card__genres--wrap">{arrayOfCardGenres}</p>
        <p className="card__description">{filmDescripton}</p>
        <Rate allowHalf count="10" defaultValue={0} value={value} onChange={handleChange} />
      </div>
    </div>
  );
}

Card.defaultProps = {
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

Card.propTypes = {
  original_title: PropTypes.string,
  release_date: PropTypes.string,
  overview: PropTypes.string,
  poster_path: PropTypes.string,
  cardGenres: PropTypes.arrayOf(PropTypes.string),
  filmID: PropTypes.number,
  sessionId: PropTypes.string,
  updateRatedFilms: PropTypes.func,
  vote_average: PropTypes.number,
  value: PropTypes.number,
};

export default Card;
