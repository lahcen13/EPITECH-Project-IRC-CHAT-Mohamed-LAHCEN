const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const socketioJwt = require('socketio-jwt');
const jwt = require('jsonwebtoken');
app.use(cors());
app.use(express.json())


const crudUser = require("./models/user")
const crudMessage = require("./models/message")
const crudChannel = require("./models/channel");
const { send } = require("process");


const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

var connected = [];



// io.use((socket, next) => {
//   var token = socket.handshake.query.token
//   const decodedToken = jwt.verify(token, process.env.LYAN);
//   crudUser.selectUser({ pseudo: decodedToken.pseudo }).then(result => {
//     if (!result) {
//       throw "bad token"
//     } else {
//       next()
//     }
//   })
//     .catch(err => {
//       console.error(err)
//       socket.emit("error", err)
//     })
// // })


// if (process.env.LYAN !== pseudo) {
//   throw 'invalid token ! go away HACKER !!!';
// } else {
//   next();
// }
// if (authParams == undefined) {
//   console.log("client could not connect")
// }
// if (authParams == pseudo) {
//   next()
// }
// }

io.on("connection", (socket) => {
  all = io;
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    const decodedToken = jwt.verify(token, process.env.LYAN);
    crudUser.selectUser({ pseudo: decodedToken.pseudo }).then(result => {
      if (!result) {
        const err = new Error("not authorized");
        err.data = { content: "Please connect your account" };
        next(err);
      } else {
        next()
      }
    })
      .catch(err => {
        console.error(err)
        socket.emit("error", err)
      })
  });

  socket.on("connectedUsers", (data) => {
    connected = connected.filter(user => user.id !== socket.id)
    var table = { id: socket.id, pseudo: data.pseudo, channel: data.channel }
    connected.push(table)
    socket.emit("connectedUsers", connected)
  })
  socket.on("connectedUsersList", () => {
    socket.emit("connectedUsersList")
  })

  socket.on("join_room", (data) => {
    socket.join(data.channel);
    socket.emit("room", data.channel)
  });

  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  socket.on("quitChannel", (data) => {
    connected = connected.filter(user => user.id !== socket.id)
    var table = { id: socket.id, pseudo: data.pseudo, channel: data.channel }
    connected.push(table)
    socket.emit("connectedUsers", connected)

    socket.leave(data.channel);
    socket.emit("quitChannel", data.channel)
  });


  socket.on("disconnect", () => {
    connected = connected.filter(user => user.id !== socket.id)
    socket.emit("connectedUsers", connected)
    console.log("User Disconnected", socket.id);
  });

  //@@@@@@@@@@@@\\ CHANNEL //@@@@@@@@@@@@\\
  //@@@@@@@@@@@@@@\\```````//@@@@@@@@@@@@@@\\
  socket.on("addChannel", (data) => {
    crudChannel.selectChannel(data.channel).then(result => {
      if (result) {
        socket.emit("channel_name_already_exist");
      } else {
        socket.leave(data.actualChannel)
        crudChannel.insertChannel(data).then(result => {
          socket.emit("ChannelInserted");
        }).catch(err => {
          console.error(err)
          socket.emit("bad_credentials")
        })
      }
    }).catch(err => {
      console.error(err)
      socket.emit("bad_credentials")
    })
  });

  socket.on("joinChannel", (data) => {
    crudChannel.selectChannel(data.channel).then(result => {
      if (result) {
        connected = connected.filter(user => user.id !== socket.id)
        var table = { id: socket.id, pseudo: data.pseudo, channel: data.channel }
        connected.push(table)
        socket.emit("connectedUsers", connected)
        socket.leave(data.room)
        socket.join(data.channel);
        socket.emit("room", data.channel)
        //vérifier si la channel n'existe pas déjà dans la base de donnée si non, on appelle la fonction en bas.
        crudUser.addUserIntoChannel(data.pseudo, data.channel);
      } else {
        socket.emit("channel_name_doesnt_exist")
      }
    }).catch(err => {
      console.error(err)
      socket.emit("bad_credentials")
    })

  });

  socket.on("selectChannel", (data) => {
    crudChannel.selectChannel(data).then(result => {
      if (result) {
        socket.emit("channelFounded");
      }
    }).catch(err => {
      console.error(err)
      socket.emit("bad_credentials")
    })
  });

  socket.on("channelBeginWith", (data) => {
    crudChannel.channelBeginWith(data.channel).then(result => {
      socket.emit("channelsList", result);
    }).catch(err => {
      console.error(err)
      socket.emit("bad_credentials")
    })
  });



  socket.on("channelsList", () => {
    crudChannel.channelsList().then(result => {
      socket.emit("channelsList", result);
    }).catch(err => {
      console.error(err)
      socket.emit("bad_credentials")
    })
  });

  socket.on("deleteChannel", (data) => {
    crudChannel.deleteChannel(data).then(result => {
      socket.emit("channelDeleted");
    }).catch(err => {
      console.error(err)
      socket.emit("bad_credentials")
    })
  });

  //@@@@@@@@@@@@\\   USER  //@@@@@@@@@@@@\\
  //@@@@@@@@@@@@@@\\```````//@@@@@@@@@@@@@@\\

  socket.on("updateNickname", (data) => {
    crudUser.selectUser({ pseudo: data.newPseudo }).then(result => {
      if (!result) {  //si le  pseudo n'existe pas déjà dans la BDD
        console.log("le pseudo n'existe pas")
        crudUser.updateUser(data.pseudo, data.newPseudo).then(result => {
          console.log("on update le user")
          var token = jwt.sign({
            pseudo: data.newPseudo
          }, process.env.LYAN);
          socket.emit("updateNickname", { pseudo: data.newPseudo, token: token })
          crudMessage.updateMessage(data.pseudo, data.newPseudo).then(result => {
            crudMessage.selectAllChannelMessages(data.channel).then(result => {
              socket.emit("getAllChannelMessages", result)
            })
          }).catch(err => {
            console.error(err)
          })

        }).catch(err => {
          console.error(err)
          socket.emit("errorDetected", err)
        })
      } else {  //si le  pseudo existe  déjà dans la BDD
        socket.emit("pseudoExist")
      }
    }).catch(err => {
      console.error(err)
      socket.emit("errorDetected", err)
    })
  });





  socket.on("register", (data) => {
    crudUser.selectUser(data).then(result => {
      if (!result) {
        crudUser.insertUser(data)
        console.log('sucesse')
      } else {
        console.log('pseudo already exist')
        socket.emit("bad_register_credentials")
      }
    })
      .catch(err => {
        console.error(err)
        socket.emit("error", err)
      })
  });

  socket.on("sign_in", (data) => {
    crudUser.selectUser(data).then(result => {
      if (!result) {
        socket.emit("bad_sign_in_credentials")
      } else {
        //créer une variable d'envrinnement 
        var token = jwt.sign({
          data
        }, process.env.LYAN);
        console.log(token)
        socket.emit("sign_in_success", token)
      }
    })
      .catch(err => {
        console.error(err)
        socket.emit("error", err)
      })
  });



  socket.on("addUserIntoChannel", (data) => {

    crudUser.addUserIntoChannel(data.pseudo, data.channel).then(result => {
      connected = connected.filter(user => user.id !== socket.id)
      var table = { id: socket.id, pseudo: data.pseudo, channel: data.channel }
      connected.push(table)
      socket.emit("connectedUsers", connected)
      socket.join(data.channel);
      socket.emit("room", data.channel)
    }).catch(err => {
      console.error(err)
      socket.emit("error detected")
    })
  });

  socket.on("deleteUserFromChannel", (data) => {
    crudUser.deleteUserFromChannel(data.pseudo, data.channel).then(result => {
      socket.emit("deleteUserFromChannel")
    }).catch(err => {
      console.error(err)
      socket.emit("error detected")
    })
  });

  //permet d'avoir aussi les channels du user.
  socket.on("getUserData", (data) => {
    crudUser.selectUser(data).then(result => {
      socket.emit("getUserData", result);
    }).catch(err => {
      console.error(err)
      socket.emit("error detected")
    })
  });

  socket.on("getChannelMessages", (data) => {
    crudUser.selectUser(data.user, data._id).then(result => {
      socket.emit("getChannelMessages", result);
    }).catch(err => {
      console.error(err)
      socket.emit("error detected")
    })
  });

  socket.on("getUserInTheChannel", (data) => {
    crudUser.selectChannelUsers(data.channel).then(result => {
      socket.emit("getUserInTheChannel", result);
    }).catch(err => {
      console.error(err)
      socket.emit("error detected")
    })
  });

  //@@@@@@@@@@@@\\ MESSAGE //@@@@@@@@@@@@\\
  //@@@@@@@@@@@@@@\\```````//@@@@@@@@@@@@@@\\

  socket.on("getAllChannelMessages", (data) => {
    crudMessage.selectAllChannelMessages(data).then(result => {
      socket.emit("getAllChannelMessages", result)
    }).catch(err => {
      console.error(err)
      socket.emit("error detected")
    })
  });


  socket.on("send_message", (data) => {
    crudMessage.insertMessage(data).then(result => {
      socket.emit("receivedMessage", data.message);
      all.to(data.room).emit("receive_message", data);
    }).catch(err => {
      console.error(err)
      socket.emit("error detected")
    })
  });

  socket.on("message", (data) => {
    socket.emit("receivedMessage", data);

  });

  socket.on("deleteMessage", (data) => {
    crudMessage.deleteMessage(data._id).then(result => {
      socket.emit("deletedMessage");
    }).catch(err => {
      console.error(err)
      socket.emit("error detected")
    })
  });

});

app.post('/connexion', (req, res) => {
  let data = { pseudo: req.body.data.pseudo, password: req.body.data.password };
  crudUser.selectUser(data).then(result => {
    if (!result) {
      res.status(401).send('error');
    } else {
      //créer une variable d'envrinnement 
      var token = jwt.sign({
        pseudo: req.body.data.pseudo
      }, process.env.LYAN);
      res.status(200).send(token);
    }
  })
    .catch(err => {
      console.error(err)
    })
})

app.post('/register', (req, res) => {
  crudUser.selectUser(req.body.data).then(result => {
    if (!result) {
      crudUser.insertUser(req.body.data)
      res.status(200).send("success")
    } else {
      res.status(404).send("error")
    }
  })
    .catch(err => {
      console.error(err)
    })
})

server.listen(3001, () => {
  console.log("SERVER RUNNING");
});