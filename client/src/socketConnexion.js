import io from "socket.io-client";

var socket = () => {
}
if (sessionStorage.getItem("token")) {
    socket = io('http://localhost:3001', {
        auth: {
            token: sessionStorage.getItem("token"),
        },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5
    })
}

export default socket;


