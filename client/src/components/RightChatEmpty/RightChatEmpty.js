import React from 'react';
import PropTypes from 'prop-types';
import styles from './RightChatEmpty.module.css';

const RightChatEmpty = () => (
  <div className="col-12 col-sm-12 col-lg-8">
    <div className={styles.up + " row"}>
      <div className={styles.borderUp + " col-12"}>
      </div>
    </div>
    <div className={styles.down + " row"}>
      <div className={styles.borderDown + " col-12"}>
        <div className="row justify-content-between">
          <div className="col-9">
            <center>
              <textarea disabled={true} className={styles.input}
                placeholder="Write your message here ..."
            
              />
            </center>

          </div>
          <div className='col-3'>
            <div disabled={true} className={styles.buttonMenu}>
              SEND
            </div>
          </div>
        </div>
        <div className="row">
        </div>
      </div>
    </div >
  </div >
);

RightChatEmpty.propTypes = {};

RightChatEmpty.defaultProps = {};

export default RightChatEmpty;
