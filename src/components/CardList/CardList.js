import React from 'react';
import propTypes from 'prop-types';
import { Pagination } from 'antd';
import { FrownOutlined } from '@ant-design/icons';
import { ServiceConsumer } from '../../services/ServiceContext';
import Card from '../Card';
import 'antd/dist/antd.css';

function CardList(props) {
  const { films, totalResults, onPageNumberChange, page, rated, sessionId, updateRatedFilms } = props;

  if (films.length === 0) {
    return (
      <div className="card-list__notification">
        <FrownOutlined style={{ fontSize: '56px' }} />
        <p>Sorry,we have no data for your request</p>
      </div>
    );
  }
  const getCards = (genres) => {
    const cardsArray = films.map((item) => {
      const { id, value, genre_ids: genreIds, ...itemProps } = item;
      let ratedValue;
      for (let i = 0; i < rated.length; i += 1) {
        if (id === rated[i].id) {
          ratedValue = rated[i].rating;
        }
      }
      const cardGenres = [];
      genreIds.forEach((itemGenre) => {
        for (let i = 0; i < genres.length; i += 1) {
          if (itemGenre === genres[i].id) {
            cardGenres.push(genres[i].name);
          }
        }
      });
      return (
        <Card
          key={id}
          filmID={id}
          value={ratedValue}
          sessionId={sessionId}
          updateRatedFilms={updateRatedFilms}
          cardGenres={cardGenres}
          {...itemProps}
        />
      );
    });
    return cardsArray;
  };

  return (
    <>
      <ServiceConsumer>
        {(genres) => (
          <ul className="card-list" gernes={genres}>
            {getCards(genres)}
          </ul>
        )}
      </ServiceConsumer>
      <Pagination
        onChange={(newPageNumber) => onPageNumberChange(null, newPageNumber)}
        total={totalResults}
        current={page}
        defaultPageSize={20}
        size="small"
        showSizeChanger={false}
        defaultCurrent={1}
        hideOnSinglePage
      />
    </>
  );
}

CardList.defaultProps = {
  films: [],
  totalResults: 0,
  onPageNumberChange: 1,
  page: 1,
  onChange: () => {},
  updateRatedFilms: () => {},
  sessionId: null,
  genres: [],
  rated: [],
};

CardList.propTypes = {
  totalResults: propTypes.number,
  onPageNumberChange: propTypes.func,
  page: propTypes.number,
  onChange: propTypes.func,
  films: propTypes.arrayOf(propTypes.object),
  sessionId: propTypes.string,
  genres: propTypes.arrayOf(propTypes.object),
  rated: propTypes.arrayOf(propTypes.object),
  updateRatedFilms: propTypes.func,
};
export default CardList;
