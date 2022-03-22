import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './PageApplication.module.css';
import LeftMenu from '../LeftMenu/LeftMenu';
import RightChat from '../RightChat/RightChat';
import PopUpListChannel from '../PopUpListChannel/PopUpListChannel';
import socket from '../../socketConnexion';

import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import RightChatEmpty from '../RightChatEmpty/RightChatEmpty';




const PageApplication = () => {
  const [room, setRoom] = useState("");
  const [connexion, setConnexion] = useState(false);
  const [popUpListRooms, setPopUpListRooms] = useState(false);
  const [popUpChannels, setPopUpChannels] = useState();
  const [popUpConnectedUsers, setPopUpConnectedUsers] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState();

  useEffect(() => {
    socket.on('room', (data) => {
      setRoom(data)
      console.log('Connected, server name is : ' + data)
      sessionStorage.setItem("channel", data)
      socket.emit("connectedUsers", { pseudo: sessionStorage.getItem("pseudo"), channel: sessionStorage.getItem("channel") })
    })
    socket.on('updateNickname', (data) => {
      console.log('nouveau pseudo est : ' + data.pseudo)
      sessionStorage.setItem("token", data.token)
      sessionStorage.setItem("pseudo", data.pseudo)
    })
    return () => { socket.off("room") }
  }, [socket])

  useEffect(() => {
    socket.on('channelsList', (data) => {
      console.log(data);
      setPopUpChannels(data);
      setPopUpListRooms(true);
    })
    return () => { socket.off("channelsList") }
  })

  useEffect(() => {
    socket.on('deleteUserFromChannel', (data) => {
      sessionStorage.removeItem("channel");
      setRoom("")
    })
    return () => { socket.off("deleteUserFromChannel") }
  })

  useEffect(() => {
    socket.on('connectedUsers', (data) => {
      setConnectedUsers(data)
      console.log(data)
    })
    return () => socket.off("connectedUsers")
  })
  useEffect(() => {
    socket.on('connectedUsersList', () => {
      setPopUpConnectedUsers(true);
    })
    return () => socket.off("connectedUsersList")
  })


  useEffect(() => {
    socket.on('quitChannel', (data) => {
      setRoom("")
      console.log('you leave the channel : ' + data)
      sessionStorage.removeItem("channel")
    })
    return () => { socket.off("quitChannel") }
  }, [socket])

  socket.on("connect_error", (err) => {
    console.log(err.message);
  })

  socket.on("err", (err) => {
    console.log(err)
  })
  return (
    <div className="row">
      <LeftMenu socket={socket}  ></LeftMenu>
      {popUpListRooms ? <PopUpListChannel title={"List of channels"} data={popUpChannels} closePopUp={(bool) => setPopUpListRooms(bool)}></PopUpListChannel> : ""}
      {popUpConnectedUsers ? <PopUpListChannel title={"Users connected"} data={connectedUsers} closePopUp={(bool) => setPopUpConnectedUsers(bool)}></PopUpListChannel> : ""}
      {room ? <RightChat socket={socket} room={room}  ></RightChat> : <RightChatEmpty></RightChatEmpty>}
    </div>
  )
};

PageApplication.propTypes = {};

PageApplication.defaultProps = {};

export default PageApplication;
