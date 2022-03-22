import React, { useEffect, useState } from 'react';
import styles from './RoomsForms.module.css';

const RoomsForms = (props) => {
  const [joinRoom, setJoinRoom] = useState({ channel: "", pseudo: sessionStorage.getItem('pseudo'), room: sessionStorage.getItem('channel') });
  const [createRoom, setCreateRoom] = useState({ channel: "", pseudo: sessionStorage.getItem('pseudo'), room: sessionStorage.getItem('channel') });
  const [notifJoinError, SetNotifJoinError] = useState(false);
  const [notifCreateError, SetNotifCreateError] = useState(false);

  const joinRoomSubmit = async () => {
    if (sessionStorage.getItem('pseudo') !== "" && joinRoom.channel !== "") {
      console.log("the channell is : " + joinRoom.channel)
      await props.socket.emit("joinChannel", joinRoom);
      sessionStorage.setItem("channel", joinRoom.channel)
    }
  };

  const createRoomSubmit = async () => {
    if (sessionStorage.getItem('pseudo') !== "" && createRoom.channel !== "") {
      await props.socket.emit("addChannel", createRoom);
    }
  };

  useEffect(() => {
    props.socket.on("ChannelInserted", (data) => {
      var data = { channel: createRoom.channel, pseudo: sessionStorage.getItem('pseudo') }
      props.socket.emit("addUserIntoChannel", data);
      sessionStorage.setItem("channel", createRoom.channel)
    })
    return () => { props.socket.off("ChannelInserted") }
  })

  props.socket.on("channel_name_doesnt_exist", (data) => {
    SetNotifJoinError(true)
  })
  props.socket.on("channel_name_already_exist", (data) => {
    SetNotifCreateError(true)
  })




  return (
    <div className={styles.RoomsForms}>
      <div className={styles.container + " row"}>
        <center> <h3 className={styles.h3}>Join A Chat</h3></center>
        <div className="row">
          <center>
            <input className={styles.input}
              onChange={(event) => {
                setJoinRoom({ ...joinRoom, channel: event.target.value });
              }}
              type="text"
              placeholder="Room ID..."

            />
          </center>
        </div>
        <div className="row">
          <center>
            <div className="col-6">
              <div onClick={() => joinRoomSubmit()} className={styles.buttonMenu}>
                JOIN
              </div>
            </div>
            {notifJoinError ? "The channel doesn't exist" : ""}
          </center>
        </div>
      </div>

      <div className={styles.container + "  row"}>
        <center> <h3 className={styles.h3} >Create a room</h3></center>
        <div className="row">
          <center>
            <input className={styles.input}
              onChange={(event) => {
                setCreateRoom({ ...createRoom, channel: event.target.value });
              }}
              type="text"
              placeholder="Room ID..."

            />
          </center>
        </div>
        <div className="row">
          <center>
            <div className="col-6">
              <div onClick={() => createRoomSubmit()} className={styles.buttonMenu}>
                CREATE
              </div>
            </div>
            {notifCreateError ? "Used name" : ""}
          </center>
        </div>
      </div>
    </div>
  )
};

RoomsForms.propTypes = {};

RoomsForms.defaultProps = {};

export default RoomsForms;
