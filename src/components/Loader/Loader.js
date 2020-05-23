import React from 'react';
import './Loader.scss';

function Loader(props) {
  return (
    <div className="loader center">
      <i className="fa fa-cog fa-spin" />
      <div className="text">{props.text || 'Loading...'}</div>
    </div>
  );
}

export default Loader;