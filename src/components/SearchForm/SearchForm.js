import React, { Component } from 'react';
import { debounce } from 'lodash';
import propTypes from 'prop-types';

export default class NewTaskForm extends Component {
  static defaultProps = {
    onSearch: () => {},
  };

  static propTypes = {
    onSearch: propTypes.func,
  };

  delayedOnLabelChange = debounce((request) => this.onChange(request), 1500);

  constructor(props) {
    super(props);
    this.textInput = React.createRef();
    this.state = {
      label: '',
    };
  }

  componentDidMount() {
    this.textInput.current.focus();
  }

  onChange = (ev) => {
    const { onSearch } = this.props;
    const label = ev.target.value;
    ev.preventDefault();
    if (label && label[0] !== ' ') {
      onSearch(label);
    }
  };

  onLabelChange = (ev) => {
    this.setState(() => ({ label: ev.target.value }));
    this.delayedOnLabelChange(ev);
  };

  onSubmit = (ev) => {
    ev.preventDefault();
  };

  render() {
    const searchText = 'Type to search...';
    const { label } = this.state;
    return (
      <form onSubmit={this.onSubmit} className="search-form">
        <input
          className="search-form__input"
          type="text"
          placeholder={searchText}
          onChange={this.onLabelChange}
          value={label}
          ref={this.textInput}
        />
      </form>
    );
  }
}
