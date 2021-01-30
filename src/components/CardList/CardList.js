import React from 'react';
import propTypes from 'prop-types';
import { Pagination } from 'antd';
import { FrownOutlined } from '@ant-design/icons';
import Card from '../Card';
import { MoviedbServiceConsumer } from '../../services/MoviedbServiceContext';

import 'antd/dist/antd.css';

function CardList(props) {
  const { films, totalResults, onPageNumberChange, page, sessionId } = props;
  const onChange = (newPageNumber) => {
    onPageNumberChange(null, newPageNumber);
  };

  const getGenres = () => {
    const key = 'cc1dcf97688dfad4070d8e273bcabc3b';
    const genresUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${key}&language=en-US`;
    <MoviedbServiceConsumer>
      {({ getResource }) => {
        console.log('whaaat');
        getResource(genresUrl).then((body) => console.log(body));
      }}
    </MoviedbServiceConsumer>;
    console.log(genresUrl);
  };

  getGenres();

  if (films.length === 0) {
    return (
      <div className="card-list__notification">
        <FrownOutlined style={{ fontSize: '56px' }} />
        <p>Sorry,we have no data for your request</p>
      </div>
    );
  }
  const cardsArray = films.map((item) => {
    const { id, ...itemProps } = item;
    return <Card key={id} filmID={id} sessionId={sessionId} {...itemProps} />;
  });

  return (
    <fragment>
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
    </fragment>
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
  onPageNumberChange: propTypes.func,
  page: propTypes.number,
  onChange: propTypes.func,
  films: propTypes.arrayOf(propTypes.object),
};
export default CardList;
