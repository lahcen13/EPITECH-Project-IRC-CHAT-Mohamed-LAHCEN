import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './RoomsList.module.css';
import { BsXCircle } from "react-icons/bs";

const RoomsList = (props) => {
  const [channels, setChannels] = useState(false)
  const [channelDeleted, setChannelDeleted] = useState(false)


  const joinRoomSubmit = async (newChannel) => {
    let joinRoom = { channel: newChannel, pseudo: sessionStorage.getItem('pseudo'), room: sessionStorage.getItem('channel') }
    if (sessionStorage.getItem('pseudo') !== "" && joinRoom.channel !== "") {
      console.log("the channell is : " + joinRoom.channel)
      await props.socket.emit("joinChannel", joinRoom);
      sessionStorage.setItem("channel", joinRoom.channel)
    }
  };

  useEffect(async () => {
    await props.socket.emit("getUserData", { pseudo: sessionStorage.getItem('pseudo') })
  }, [props.socket])

  // if (channelDeleted) {
  //   props.socket.emit("getUserData", { pseudo: sessionStorage.getItem('pseudo') })
  //   setChannelDeleted(false);
  //   console.log("hello")
  // }


  props.socket.on("getUserData", async (data) => {
    setChannels(data.channels);
  })

  const deleteChannel = async (channelName) => {
    await props.socket.emit("deleteUserFromChannel", { pseudo: sessionStorage.getItem('pseudo'), channel: channelName })
    await console.log(channelName + " SUCCESS")
    // setChannelDeleted(true);
  }

  return (
    <div className={styles.scroll}>
      {channels ?
        channels.map((channel) => {
          return (
            <div onClick={()=> joinRoomSubmit(channel) }className={styles.room + " row justify-content-between"}>
              <div className={styles.title + " col-10"}>
                {channel}
              </div>
              <div className={"col-2 col-sm-1 col-lg-2"}>
                <BsXCircle onClick={() => deleteChannel(channel)} className={styles.iconClose}></BsXCircle>
              </div>
            </div>
          )
        })
        : " No channels"
      }

    </div>
  )
};

RoomsList.propTypes = {};

RoomsList.defaultProps = {};

export default RoomsList;
