import React, { Component } from 'react';
import Card from '../Card';

export default class CardList extends Component {
  render() {
    const { films } = this.props;
    const cardsArray = films.map((item) => {
      const { id, ...itemProps } = item;
      return <Card key={id} {...itemProps} />;
    });

    return <ul className="card-list">{[cardsArray]}</ul>;
  }
}
