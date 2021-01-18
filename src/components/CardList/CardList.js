import React from 'react';
import propTypes from 'prop-types';
import Card from '../Card';
import 'antd/dist/antd.css';

function CardList(props) {
  const { films } = props;
  const cardsArray = films.map((item) => {
    const { id, ...itemProps } = item;
    return <Card key={id} {...itemProps} />;
  });
  console.log(films);
  return <ul className="card-list">{[cardsArray]}</ul>;
}
CardList.defaultProps = {
  films: [],
};

CardList.propTypes = {
  films: propTypes.arrayOf(propTypes.object),
};
export default CardList;
