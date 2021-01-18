import React from 'react';
import propTypes from 'prop-types';
import { Pagination } from 'antd';
import Card from '../Card';
import 'antd/dist/antd.css';

function CardList(props) {
  const { films, totalResults, onPageNumberChange, page } = props;
  const onChange = (newPageNumber) => {
    onPageNumberChange(null, newPageNumber);
  };
  const cardsArray = films.map((item) => {
    const { id, ...itemProps } = item;
    return <Card key={id} {...itemProps} />;
  });
  return (
    <>
      <ul className="card-list">{[cardsArray]}</ul>
      <Pagination
        onChange={onChange}
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
};

CardList.propTypes = {
  totalResults: propTypes.number,
  onPageNumberChange: propTypes.number,
  page: propTypes.number,
  onChange: propTypes.func,
  films: propTypes.arrayOf(propTypes.object),
};
export default CardList;
