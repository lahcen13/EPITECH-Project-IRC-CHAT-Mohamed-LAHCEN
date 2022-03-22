import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './Rooms.module.css';
import { BsXCircle } from "react-icons/bs";

import RoomsList from '../RoomsList/RoomsList';
import RoomsForms from '../RoomsForms/RoomsForms';
const Rooms = (props) => {
  const [rooms, setRooms] = useState(true);
  const [join, setJoin] = useState(false);


  return (
    <>
      <div className={styles.center + " col-12"}>
        <div className="row justify-content-between">
          <div className="col-6">
            <div onClick={() => setRooms(true) && setJoin(false)} className={styles.buttonMenu}>
              ROOMS
            </div>
          </div>
          <div className="col-6">
            <div onClick={() => setRooms(false) && setJoin(true)} className={styles.buttonMenu}>
              JOIN
            </div>
          </div>
        </div>
        {rooms === true ?
          <RoomsList  socket= {props.socket} ></RoomsList>
          : <RoomsForms socket={props.socket} ></RoomsForms>}

      </div>
    </>
  )
};

Rooms.propTypes = {};

Rooms.defaultProps = {};

export default Rooms;
