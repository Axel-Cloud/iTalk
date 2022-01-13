"use strict";

var _express = _interopRequireDefault(require("express"));

var _cors = _interopRequireDefault(require("cors"));

var _http = require("http");

var _socket = require("socket.io");

require("./Database/db");

var _Users = _interopRequireDefault(require("./Database/Controllers/Users"));

var _Conversation = _interopRequireDefault(require("./Database/Controllers/Conversation"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//Controllers
require('dotenv').config();

const App = (0, _express.default)();
const httpServer = (0, _http.createServer)(App);
const SocketIO = new _socket.Server(httpServer, {
  cors: {
    origin: '*'
  }
});
/* Server Settings */

process.setMaxListeners(0);
App.set("Port", process.env.Port || 3003);
/* Middlewares */

App.use((0, _cors.default)());
App.use(_express.default.json({
  limit: '2mb'
}));
/* Server Routes */

App.use("/api/Users", require("./Routes/Users"));
App.use("/api/Conversation", require("./Routes/Conversation")); //SocketIO

SocketIO.on("connection", Socket => {
  Socket.on("SetUser", UserID => {
    Socket.join(UserID.UserID);

    _Users.default.UpdateOnline({
      ID: UserID.UserID,
      Online: true
    });
  });
  Socket.on("UnsetUser", UserID => {
    Socket.leave(UserID.UserID);

    _Users.default.UpdateOnline({
      ID: UserID.UserID,
      Online: false
    });
  });
  Socket.on("Message", _ref => {
    let {
      ConversationID,
      EmitterID,
      RecieverID,
      Message
    } = _ref;

    _Conversation.default.NewMessage({
      ConversationID,
      EmitterID,
      RecieverID,
      Message
    }, SocketIO);
  });
});
/* Server Listen */

httpServer.listen(App.get("Port"), () => {
  console.log("Listen on port ".concat(App.get("Port")));
});
//# sourceMappingURL=Index.js.map