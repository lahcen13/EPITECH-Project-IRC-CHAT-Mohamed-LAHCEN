import React from 'react';
import PropTypes from 'prop-types';
import styles from './LeftMenu.module.css';
import Rooms from '../Rooms/Rooms';

const LeftMenu = (props) => {
  const disconnect = () => {
    sessionStorage.clear()
    window.location.href = "http://localhost:3000/login"
  }
  return (
    <div className={styles.LeftMenu + " col-12 col-sm-12 col-lg-4"}>
      <div className={styles.Navbar + " row"}>
        <div className={styles.buttonMenu + " col-6"}>
          Rooms
        </div>
        <div onClick={() => disconnect()} className={styles.buttonMenu + " col-6"}>
          Disconnect
        </div>
      </div>



      <div className={styles.container + " row"}>
        <Rooms socket={props.socket} ></Rooms>
      </div>
    </div >
  )
};

LeftMenu.propTypes = {};

LeftMenu.defaultProps = {};

export default LeftMenu;
