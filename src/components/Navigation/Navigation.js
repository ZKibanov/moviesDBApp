import React from 'react';
import PropTypes from 'prop-types';

function Navigation(props) {
  const { chooseTab, tab } = props;
  const tabsObject = {
    Search: 'Search',
    Rated: 'Rated',
  };

  const navigation = Object.keys(tabsObject).map((key) => {
    const activeClass = key === tab ? 'nav-button nav-button__active' : 'nav-button';
    return (
      <button key={key} type="button" className={activeClass} onClick={chooseTab}>
        {key}
      </button>
    );
  });
  return <nav className="nav">{navigation}</nav>;
}

Navigation.propTypes = {
  chooseTab: PropTypes.func,
  tab: PropTypes.string,
};

Navigation.defaultProps = {
  chooseTab: () => {},
  tab: 'Search',
};
export default Navigation;
