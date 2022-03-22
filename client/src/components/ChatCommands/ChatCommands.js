import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './ChatCommands.module.css';

const ChatCommands = (props) => {

  const LesCommands = () => {
    if (props.command == "/") {
      return "/nick - /list - /create - /delete - /join - /quit - /users - /msg"
    }
    if (props.command.startsWith("/n")) {
      return "/nick nickname"
    }
    if (props.command.startsWith("/l")) {

      return "/list channel_name (display the channels that start with the name) "
    }
    if (props.command.startsWith("/c")) {
      return "/create channel_name"
    }
    if (props.command.startsWith("/d")) {
      return "/delete channel_name"
    }
    if (props.command.startsWith("/j")) {
      return "/join channel_name"
    }
    if (props.command.startsWith("/q")) {
      return "/quit channel_name"
    }
    if (props.command.startsWith("/u")) {
      return "/users (display users currently in the channel)"
    }
    if (props.command.startsWith("/m")) {
      return "/msg nickname message"
    }
  }
  // utiliser les socket.on déjà créer.

  useEffect(() => {
 
  }, [props.command.status]
  )
  return (
    <div className={styles.ChatCommands}>
      {LesCommands()}
    </div>
  )
}

ChatCommands.propTypes = {};

ChatCommands.defaultProps = {};

export default ChatCommands;
