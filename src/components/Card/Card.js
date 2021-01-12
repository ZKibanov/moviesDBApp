import React, { Component } from 'react';
import { format } from 'date-fns';

export default class Card extends Component {
  static defaultProps = {};

  constructor() {
    super();
  }

  render() {
    const fileSize = 'w500';
    const { original_title, overview, release_date, poster_path, genre_ids } = this.props;
    const date = format(new Date(release_date), 'PPP');

    let pathToPosters;
    if (poster_path) {
      pathToPosters = `http://image.tmdb.org/t/p/${fileSize}${poster_path}`;
    } else {
      pathToPosters = './images/notfound.jpg';
    }

    function stringSizeControl(str) {
      if (str.length >= 210) {
        let res = str.substr(0, 210);
        const whitespaceIndex = res.lastIndexOf(' ');
        res = res.substr(0, whitespaceIndex) + ' ...';
        return res;
      } else {
        return str;
      }
    }

    let filmDescripton = stringSizeControl(overview);

    console.log(pathToPosters);
    return (
      <div className="card">
        <div>
          <img className="card__image" src={pathToPosters}></img>
        </div>
        <div className="card__text-area">
          <h5 className="card__header">{original_title}</h5>
          <p className="card__date">{date}</p>
          <span className="card__genres">{genre_ids}</span>
          <p className="card__description">{filmDescripton}</p>
        </div>
      </div>
    );
  }
}
