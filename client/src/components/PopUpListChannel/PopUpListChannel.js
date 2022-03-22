import React from 'react';
import PropTypes from 'prop-types';
import styles from './PopUpListChannel.module.css';
import { BsXCircle } from "react-icons/bs";
const PopUpListChannel = (props) => {

  return (
    <div className={styles.PopUpListChannel}>
      <div className={styles.box}>
        <center><h3>{props.title}</h3></center>
        {props.data.length > 0 ?
          props.data.map((table) => {
            if (props.title === "List of channels") {
              return (
                <div className={"row " + styles.ligne}>
                  <div className={styles.text}>{table.channel}</div>
                </div>
              )
            } else {
              return (
                <div className={"row " + styles.ligne}>
                  <div className={styles.text}>{table.pseudo}</div>
                </div>
              )
            }
          }
          ) :
          <div className={"row " + styles.ligne}>
            <div className={styles.text}>NO CHANNELS</div>
          </div>

        }


        <center><BsXCircle onClick={() => props.closePopUp(false)} className={styles.icon} size={30} color='red'></BsXCircle></center>
      </div>
    </div>)
};

PopUpListChannel.propTypes = {};

PopUpListChannel.defaultProps = {};

export default PopUpListChannel;
