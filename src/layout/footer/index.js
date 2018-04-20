import React from 'react';
import { connect } from 'react-redux';
import style from './footer.css';

const Footer = () => (
  <div className={style.footer}>
    <h6 className={style.copyright}> Copyright, Spinsci Technologies LLC </h6>
  </div >
);

const mapStateToProps = () => ({
});

export default connect(mapStateToProps)(
  Footer,
);
