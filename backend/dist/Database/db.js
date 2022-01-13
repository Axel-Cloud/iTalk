"use strict";

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongoose.default.set('useNewUrlParser', true);

_mongoose.default.set('useFindAndModify', false);

_mongoose.default.set('useCreateIndex', true);

_mongoose.default.set('useUnifiedTopology', true);

_mongoose.default.connect("mongodb+srv://iTalkAdmin:26ax02st@italk1.ic8sx.mongodb.net/iTalk1?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = _mongoose.default.connection;
db.on('error', () => {
  console.log("Error on connection");
});
db.once('open', () => {
  console.log("Connected");
});
//# sourceMappingURL=db.js.map