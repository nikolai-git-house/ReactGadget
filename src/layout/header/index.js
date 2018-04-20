import React from 'react';
import { connect } from 'react-redux';
import style from './header.css';

const Header = () => (
  <div>
    <div className={style.logoLink} />
  </div >
);

const mapStateToProps = () => ({
});

export default connect(mapStateToProps)(
  Header,
);
