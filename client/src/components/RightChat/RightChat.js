import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './RightChat.module.css';
import ScrollToBottom from "react-scroll-to-bottom";
import ChatCommands from "../ChatCommands/ChatCommands";


const RightChat = (props) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [lastMessages, setLastMessages] = useState();
  const [popUpCommand, setPopUpCommand] = useState(false);
  const [command, setCommand] = useState({ event: "", pseudo: sessionStorage.getItem('pseudo'), channel: sessionStorage.getItem('channel') });
  const [displayCommandInput, setDisplayCommandInput] = useState(false);

  const lesCommands = (msg) => {
    let array = msg.split(' ')
    if (msg.startsWith("/")) setDisplayCommandInput(true);
    if (msg.startsWith("/nick "))
      setCommand({ ...command, event: "updateNickname", newPseudo: array[1] }) // fait
    if (msg.startsWith("/list"))
      if (array[1]) {
        setCommand({ ...command, event: "channelBeginWith", channel: array[1] }) // fait
      } else {
        setCommand({ ...command, event: "channelsList" })
      }
    if (msg.startsWith("/create "))
      setCommand({ ...command, event: "addChannel", channel: array[1] }) // fait
    if (msg.startsWith("/delete"))
      setCommand({ ...command, event: "deleteUserFromChannel", channel: array[1] }) // fait
    if (msg.startsWith("/join"))
      setCommand({ ...command, event: "joinChannel", channel: array[1], room: sessionStorage.getItem("channel") }) // fait
    if (msg.startsWith("/quit"))
      setCommand({ ...command, event: "quitChannel" }) // fait 
    if (msg.startsWith("/users"))
      setCommand({ ...command, event: "connectedUsersList" }) // fait manque partie codage backend
    if (msg.startsWith("/msg"))
      setCommand({ ...command, event: "msg", data: array[1] })
  }
  useEffect(() => {
    props.socket.emit("getAllChannelMessages", sessionStorage.getItem('channel'));
  }, [props.room])


  useEffect(() => {
    props.socket.on("getAllChannelMessages", (data) => {
      setLastMessages(data);
    })
    return () => { props.socket.off("getAllChannelMessages") }
  }, [props.socket])

  useEffect(() => {
    props.socket.on("ChannelInserted", (data) => {
      var data = { channel: command.channel, pseudo: sessionStorage.getItem('pseudo') }
      props.socket.emit("addUserIntoChannel", data);
      sessionStorage.setItem("channel", command.channel)
    })
    return () => { props.socket.off("ChannelInserted") }
  })

  
  const sendMessage = async () => {
    if (currentMessage !== "" && !currentMessage.startsWith("/")) {
      const messageData = {
        room: props.room,
        author: sessionStorage.getItem('pseudo'),
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      await props.socket.emit("send_message", messageData);
      setCurrentMessage("");
    }

    if (command.event) {
      props.socket.emit(command.event, command);
      console.log("the command has been sent the event "+ command.event)
      setCommand({ ...command, event: "" })
    }
  };
  useEffect(() => {
    props.socket.on("receive_message", (data) => {
      console.log(data);
      setMessageList((list) => [...list, data]);
    });
  },
   [props.socket]);

  useEffect(() => {
    if (currentMessage.startsWith("/")) {
      setPopUpCommand(true);
    } else {
      setPopUpCommand(false);
    }
  });

  return (
    <div className="col-12 col-sm-12 col-lg-8">
      <div className={styles.up + " row"}>
        <div className={styles.borderUp + " col-12"}>
          {!lastMessages ? "" : lastMessages.map((messageContent) => {
            return (
              <div
                className={"message " + styles.containerMsg}
                id={sessionStorage.getItem('pseudo') === messageContent.author ? "you" : "other"}
                style={sessionStorage.getItem('pseudo') === messageContent.author ? { background: '#1C2942' } : { background: '#131b2b' }}
              >
                <div className="row justify-content-between">
                  <div className={"col-3 " + styles.msgData}>
                    {messageContent.author}
                  </div>
                  <div className={"col-3 col-sm-1 col-lg-1  " + styles.msgData}>
                    {messageContent.time}
                  </div>
                </div>
                <div className={styles.message + " row"} style={sessionStorage.getItem('pseudo') === messageContent.author ? { textAlign: 'left' } : { textAlign: 'right' }}>
                  <p>{messageContent.message}</p>
                </div>
              </div>
            );
          })}
          {messageList.map((messageContent) => {
            return (
              <div
                className={"message " + styles.containerMsg}
                id={sessionStorage.getItem('pseudo') === messageContent.author ? "you" : "other"}
                style={sessionStorage.getItem('pseudo') === messageContent.author ? { background: '#1C2942' } : { background: '#131b2b' }}
              >
                <div className="row justify-content-between">
                  <div className={"col-3 " + styles.msgData}>
                    {messageContent.author}
                  </div>
                  <div className={"col-3 col-sm-1 col-lg-1  " + styles.msgData}>
                    {messageContent.time}
                  </div>
                </div>
                <div className={styles.message + " row"} style={sessionStorage.getItem('pseudo') === messageContent.author ? { textAlign: 'left' } : { textAlign: 'right' }}>
                  <p>{messageContent.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className={styles.down + " row"}>
        <div className={styles.borderDown + " col-12"}>
          <div className="row justify-content-between">
            <div className="col-9">
              <center>
                <textarea className={styles.input}
                  value={currentMessage}
                  onChange={(event) => {
                    setCurrentMessage(event.target.value);
                    lesCommands(event.target.value)
                  }}
                  onKeyPress={(event) => {
                    event.key === "Enter" && sendMessage();
                  }}
                  placeholder="Write your message here ..."
                // onChange={(event) => {
                //   setRoom(event.target.value);
                // }}
                />
              </center>
              {popUpCommand ? <ChatCommands command={currentMessage} setStatus={(data) => setCommand({ ...command, status: data })} currentCommand={command}></ChatCommands> : ""}

            </div>
            <div className='col-3'>
              <div onClick={sendMessage} className={styles.buttonMenu}>
                SEND
              </div>
            </div>

          </div>

          <div className="row">

          </div>
        </div>

      </div >
    </div >
  )
};

RightChat.propTypes = {};

RightChat.defaultProps = {};

export default RightChat;
