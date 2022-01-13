"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es.promise.js");

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.array.sort.js");

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.regexp.to-string.js");

var _Users = _interopRequireDefault(require("../Models/Users"));

var _Conversation = _interopRequireDefault(require("../Models/Conversation"));

var _md = _interopRequireDefault(require("md5"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const SearchConversations = async (Data, ConversationResponse) => {
  await _Users.default.findById(Data.query.ID, async (Error, User) => {
    if (!Error) {
      let FinalConversations = [];
      await _Conversation.default.find({
        _id: {
          "$in": [...User.Conversations]
        }
      }).sort([['Conversation.Date', -1]]).exec(async (Error, Conversations) => {
        if (!Error) {
          for (let x = 0; x < Conversations.length; x++) {
            let Conversation = Conversations[x];

            const SearchUsers = async () => {
              let SecondUserID = Conversation.Users.filter(User => User !== Data.query.ID)[0];
              await _Users.default.findById(SecondUserID === "" ? Data.query.ID : SecondUserID, "_id Name Lastname ProfileImage Online", (Error, UserAux) => {
                if (!Error) {
                  let LastMessage = "",
                      LastMessageDate,
                      UnreadedMessages = 0;
                  LastMessage = Conversation.Conversation[Conversation.Conversation.length - 1].Message;
                  LastMessageDate = Conversation.Conversation[Conversation.Conversation.length - 1].Date;

                  for (let y = Conversation.Conversation.length - 1; y >= 0; y--) {
                    if (Conversation.Conversation[y].UserID === SecondUserID) {
                      if (Conversation.Conversation[y].Readed === false) {
                        UnreadedMessages += 1;
                      } else {
                        break;
                      }
                    } else {
                      break;
                    }
                  }

                  if (UserAux._id.toString() !== Data.query.ID.toString()) {
                    Conversation = _objectSpread(_objectSpread({}, Conversation._doc), {}, {
                      Conversation: {
                        LastMessage,
                        LastMessageDate,
                        UnreadedMessages
                      },
                      SecondUser: {
                        _id: UserAux._id,
                        Name: UserAux.Name,
                        Lastname: UserAux.Lastname,
                        ProfileImage: UserAux.ProfileImage,
                        Online: UserAux.Online
                      }
                    });
                  } else {
                    Conversation = _objectSpread(_objectSpread({}, Conversation._doc), {}, {
                      Conversation: {
                        LastMessage,
                        LastMessageDate,
                        UnreadedMessages
                      },
                      SecondUser: {
                        _id: (0, _md.default)(Data.query.ID.toString()),
                        Name: "iTalk",
                        Lastname: "Support",
                        //#region iTalk Profile Image
                        ProfileImage: "iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AABJ6ElEQVR42u2dd3wdxdX3f7PlFnVZliW5yrjhgjEYTE8IoZoWWiAJkPBA6PCEAKElYL+hJISSAAnhSSMBQkjoCb13h+JCMQZsXOUmy7b6vXfLvH9sm92dvU2yri3mq8/V3bs7uztbzpkzZ87MAAKBQCAQCAQCgUAgEAgEAoFAIBAIBAKBQCAQCAQCgUAgEAgEAoFAIBAIBAKBQCAQCAQCgUAgEAgEAoFAIBAIBAKBQCAQCAQCgUAgEAgEAoFAIBAIBAKBQCAQCAQCgUAgEAgEAoFAIBAIBAKBQCAQCAQCgUAgEAgEAoFAIBAIBAKBQCAQCAQCgUAgEAgEAoFAIBAIBAKBQCAQCAQCgUAgEAgEAoFAIBAIBAKBQCAQCAQCgWDHgOI2vATgkKKPIGEurgUt9YUIBHlDSp2BgWQOKL4c8VcMHzlOUjKSWtk8pG7FO0tHmyDjDCPdaGpyo5bqrVDLEnXp9lQNIYjJMSkOQiRCiAQCAgoKUJNSmKZh6kbGyMiyoqsVSlu6M725bEhFu55Kr6sdXrequ61n9eSDx7Z0r89saVnTrf+rpY229hzzVbvtgu2YQfsmnoRPMPqoN9Gg7FWx+sPWKT1beqbpmjaVGubO1KTNlGKkrhkVoNS9BxTEXbYk3X97COAr34n9i4LYKSn8SQgIAVViylZQuk6OSctAyMeyIi2uGFr98cidKz5/adHbvbFV7XgSc0p9ywRfQQaRAjgRP9nt/Hi6m4zt3Ni+j6Ebe1FK99DSxlRTN+L2xRLAk1BGaJkbko8JbxsCodvn/PaUh5eCMqkIpQBkReqVFPKhJMvzYnH1vbK6+H8rm6pW/e31ddoqnFDqGyr4CrBDK4AfT3hOksuTo9pWth2sZ+hhWlrbixq0iVKqADR0bY5wZxfffBUAbzm/fcJ7EACUEolokiyvUeLqe2pCfrZmWNlzsbrm9Te+MUE4FgTbhB1OAfzhokXK+4+s3ivVkT7G0MxDdc2YTE0zBtd8d0TbE3bvYsPL/nUOueXNKuGtvanrHCDgibeznc2dd4xw3hxDhUgkpcRjC2TZ/E95XeUzh1xx2IffOp+YpX4GgsHDDqEA7r20RXr3kY+ndW/q/rae0U/RNaMZFHK4FKfut7OeuL/9Al9MGR6EMkfnfQfT8XLK5tK/5KQioAAlBIYaV5fIcfmhZGXiiVknTP7kjN80mzvIIxRsp2y3b8/3pn+C4WTzsE0rWr+jpY3TtLQ+HRSKP8/5le7bQvi9HBDfMqt6KILCzzsbaxvAvTy/NWKlkWCCglBCiKbE1flqXLp/2Njqf4xcuKTtQlw4EI9FMMjYzhTAStxwSqe05q01+3Vv7jpbS+nHmgatoK59HxZg9ne+gt5/CoBv7ge/eZYB3yrwVw5owDLwLB73rFRW5C1KXP5neU3yDzV7VCy48YkDhb9AkDfbjQK4fPdX4m1fbj0qkzYu1Xq1WQQ0YOLT4MvPEXhve7huH+3t59S/EaytR4ogQ5SA+5WBc0a/UmC9BOHmRxrwM4Suj4JAj8WVl+OVyVtHzNjp1etemKYN4OMT7KCUXAH89Ov/ja//tPU7PVt7LjEyxjSASjzhLcSZx/9tHSd3mvzaAZD1SNEKgF3nWQfEVi1sLqnvuJ4SCG5hc0Bg+QqUD+Jx3FrbmHjsl58dKxSBIJKSKYAr9ngt3rps8wnpHu0KPe0IPhBlRFuZjTbdc/3Of32UQ44VzGxHinYCZvv2+w+iIIzwB8OSQvfHVGPSgrKhVXOHTx/59M+e3c0o5jkJBjcDrgBuOOANafmSzQenOjM3ail9N4BKVkbsspAwpj7NZuJ7y97FZCv1ndKTp0TC26JuUrgF3+/Ey9YCEOUwDFoCuRSB16zoVwJBBUms2EZdjUmvl9dVXD123wnvXvrwVOEjELgMmALYf/T3sJty6vit67pvzqS0o0ChBstAyYqHQbb6frZl/nYSEHrvuASe0c+v3Qc98kElkc2F6N+Wj1Vg34W8lED4bP68SzCZbRQSQSpWFvtnZUPtNbd/OW8NROixAAOkAK6aMa9s3fL1F6c7U1eaJq2C67cKl30Av8Rn1weXw9s8oQ+uZ6Gh8/FuR9guCFYS/FWDXB7+bA5Cf1UgfJxohRPlFwkcjcoyaY1XqD8dO7PxL1e8fJBe5CMVDBK2qQKYe84qtDy6cI/u9vTdekafCVvwrRP7X3lnnZexwgTfc6BlE2pPmP1KJpslEHWLsvUoYG8vjRT+4G8KAhNSQAFktzLYvPBaQYLftn1hxpLqi+U18fNrzlm8bM6cOQU+WcFgYZspgBsPfyv2+Tutl6c6U1dSk1ZYa7OVc/krAf86v+iHBZ9v3hdnDfChoaWooOLcFRbTrgaYBVoB/HvpXxfwOlBZJm3J2vKrJp2+158vuq1ZhBh/BdkmCuC8pv+M7dyS+qOW0g50nHzWyaJL/cLNfb/jjie41HeeaPM+Wxr/8cO9/YI30u9W5NkcweOHIwUdBVCoPyAs/M4ZeDaFvY7AiCfVh2qah138i8WHt+X/lAWDgX5VAH+6dgWZ9/sPD+3e3PsXQzcbrQg+7+XzXuf8Anic314IDFviRws4K7RRQu0XEN6++d0kyl1DcqQhkeu9OxT+BNPxuxpHOTzD38wyVWLKFxVDkqdOOumo9865syLPJy7Y0ek3BXDZrv+WNq0wfpzqTM2lJi1jS1bJfdlyd8rxx7vxhT9KwKOtAX45zJbSwTi/QqoAzjmibmkuK8BLx2sWtPYxISEbI2dUYd8zRmHTsh68fs9KGGnDzY3fyqGRy7IibU3Wlp+7+w9mPvT9X00s6j0Q7Fj0iwK4eMyTyfY27Vep7sw5oFCcFy5c189X+P3Cnu037GPzTPmolgB+LAACx4TvGN7NKqQZ3Wunz6dtn13mKQPTTeM/llou4ZKX9kHd6DJQSvHolYvx3n0tCIcz81oI/MHJRCJaLKnMHX/oxF9e8th+opVgkCP19QA/mvxqzZZN2n2prsz51Cf8cD/RZj/cdazwkwKEnzLCT+w/av9ZtWi468EcI7iNhI7JGuOw0wbTR/+BuQ/OssS5N96HRn4kX/uAZ005H0UlSFQo7v0sr4uB7RoN5pwAfMuhMCfTULWe9NylLyy7+8rx/0xu8zdQUFLkvux80YTnGjZ92faEltIPBfMm8V5oIFtbtV/4AYSUAdwT8KoB/rX+deCuz+YbYM/LT4nAccONgkEfgqcUggII33qErpdvprHH0dMmujdrGDa+DKvmt+OlW5Yh02MElGU2HwACZ4ZkZrTd9JQ+4Vt7/u/TL6/+m+hPMEgpugpw8fjnm9pWb31USxt7wSf84RLMWc+m8U4edsjxlIF37GCd1l+P5zn1cjXtZXMaBsOA+I63bK0HvC5G0YHH+fQX4PUbIACIClDdCqZ07zchmHXaSEw5dBiWvr4J792/GlqPETqy/7m4OaPx8thj9ZMaT79u/uzuYt4TwfZNUQrggtFP1m/dkP63ltZnIQ/hd7ax3156v8BHWQJW+vB2Xprw+uwxfrlaEhDaaqUAggqqOPLtSZhNAbDp2XvcOKUSFz23DyRZAqUU6z/txONXfIyWD7aCtQp4Stm+QqqWqQ9XNlb84BdfntxT5CUKtlMKrgJctc971Ru/2PyoltH3ReCdl0DBNy3zE34g2j+QS/iDZj2vCsFu844d9hGEt/Ha+Z1fbP3aSxv9CfpHwmkQOF6UAgv7GkjoHNVNccw6bTQIISCEoLI+jl2/1QQtbaBlUTu8LgO8swMAJaZmTNG602MPajr5qbc6HhO9CgcRBSmAq/b8ML560bI/ZdL6bASE33NW+cun/IWf11wVNPGj2+yjhJ8ll+CzwuPlOVwF4AurPw3rpPN/2D2CysD/P9s5AH8e+L8pulszAChGTK+GokoAAWRVwvivD0XD5Ep8+cYmaCkjdAzqywsINcxpJlErvjbk+Bff7npM9CgcJOStAM4e86a0ZfWaG9M9mbMQaD2QGA81UFjJzzbMBR2DQQEOCjqb1iG7oshe4geP6z+vPx/BdJ4gE985gk7MqI//PCS0HO3BCB6L+CsIFFg+bzOWvLABTdOrUNWYcK2B+vEVmHjwMKx6fzO6WjNMPvzntK+QmOnMnlIiueXYCce++9KGx/N9dQTbMXlXW88c+p//6Wrr+j2lVGXXO0GrUY4kL2aNcpZ5gSoAPxDHX+vl1fuzOQ/5F58rMj+q/g/wegDkPkfU7ebHCuSKDaAI2gfBNglvXwIKtUzGwZdPxN5nNkNWPB3eszmD3xzwCnq3ZJgrDTYj2k2jhHYn6sqO/2TTGc+/nP/r0wco5swBnqsCeTAG+adjEI+NRYW6HBUfTkRFtYqkokMlGSg0A8VMQyYEkBSYRIVBY9C2JtBduxw9owntbqkhHRc9i+6794Fe9S7on14F8HS2ZzO4yeOqKc5ufG5mR2v7S6ZhVns78j39UTH8vCg/LwN+ZcGrs+cq6SloSIn4LzQsHLyYAjbf+fcNiLqRFMXYylGKwK8ApCxX679u9niEUEyZ3YRjf7ULympibubvOvBVtH7W5Z7Ry7/pfkwYMGEAqrSyYmjyG79bd97yIi4vkr8+TJU36lG7aggaMgSjdYJmyBirK2imGkaZKoYaFNWmjAQoYiaBDAS0YEQkNqEwCYEGipRqosMA2spMbNBNrIaKdYkUWsp1LI1nsLyiFxsvb0LvLhPJoK/q5FQAl098vbplxYY39Iy+i7dTtk49/JKf10efZBFGP04pFG7X9++fzZRnnYzZIwazNRdGpeE3F7JKJzL0BtEWAJvaC6YGvNDgKGXB3odgywAANEypxLE3T0fDzpVY/Mx6PP6jhaCGkw/rTKYr9Dp06DCgwYAOAwaVE/KzTWObj7vz0++nUSCUUlz4ApSNNajrVDGlV8VeGQV7aDImmwSNJlBOCVSwLhlq3wnWMEGOZUY10ICxRAN1L2qtMiWgl5jYrJpYKQMfx3QsLNPx/tB2umzPHtJ58WGDa2KWrApg7jEryLKXF9yZ6kqd76T14vvZDqv5mf3RaZzjRAXnRAt/8HiEoxzA+c1bn73Ez53HqGM4qbz/wZvvV0TOmbItm25cYfAM2R6p3wKSYxKS1Qp62jKgpif8FIb9p0OHZn8y9sdSAhSmWVZVftl1r5x0+8yZM7OckwJnAvecAvnFOMa1VmH/jIL9dBkzdQljTYIKsO4PxldKrE4Q/m/Wl0qZdcxv9woZ5wglAKTAN7NM2bQSWEVBCYUhU7SpJpbIwFtlvXhrbA/eP74MrbOXgOLbO271IWvOz254+qD21o6nqUnj3g7ZA33ya88vRvizCX7woviWRe62fe+83s3JrzqQa3wB/u3mC7w/RXRMQJTHwjsXjTyuv2rgCL9f8DWkoSFjf6dd4TctBQAiSVvrhgzf/8lN13/CHvthSrHoQZAVo1C/IYG9emUcoik4SJMwziSIE7am6Ai7aX1yKgAwaRgF4FMEzCXToFDby44icJQDlazfVLa3O79ZpeEdkkpAl2rgY8XEszUpvDS6gy6850vSg+/vWMogMreXTXutYu3nre/oGW2alzhf059NT0LCz+vxx+IJOr8UD38jS1qeAspeY8+ejjeqED/SgKcYoshWFWDXhZVAtjvhd7GGqyWOHDnGviX2OtLIIA0NKWSQgsaU/q4fwCaRKH964uTJ37p3weXanIcoWVqH2k1JHNqt4OSMjAMMglrA01bEhK80d4Xb9GXcXe8uB02dgPD7nn6gySZUurPrA0qAyvAUgcwoBNlTIoHqAwVgqAZWqSaer9Dwr+EdmGfsip4Hyrd/ZcDNIQXFGdVPXNnTnroBeQzoUYjws6VxVMlJcgh+1Dr/epKXQOdrFYT9DlGDjeWvQMIPghXg6JaBbOHC/hxkhwZEP2OX9mn02oLvlPwZu+6v23swTbiEmE0Tp5+r3HNda5eMEzUZh+gE9aAgruDaAk4MfynvCrDJzZy/xGeNFRrYHt411MZKA7+D1QJXuIOWgByxztnXX62gIKAxA8tUiidqevGPqS1YeOsRMLbXVgZuri4e//KI1pWbFhmaUedPnNv899LxS37rAWUX/mDTYNQ5wtui/AThmAD/MbLV3PNTIrmsgeD52JvP8w7w3m1+6e9PH64a8CwK1q+vu2Z+GilG+J2S3zH7DVAYoLAlmEhQR4xC/OBvQjnqIN0cWiOBQuKa7QajAIImfoTpHhRwyqTnWgRgjhF0+pGwX8BXNXAEmbPsVhlYZcBUE9y0gXW2fyET0/FB0sC9QzrxxP5rsOHy47YvRRDKzeX7vYX1C9bdme7RLmC3B0v8sBVgPQl+W3/+ws87X9S6YHMiT9CimviyCX1+Zn6+PgAnj4UNMZLLIchTALxtvJYFr9TXkUEGGVvw00ghYyuAoMlvqQwKIkuIT98diWOPgbzbVNBEDMQkXinvmO4B8941/b1H5lMENEr4HaFnlt3f3q2NFHCw651d2NKetQSCCoD4S/0oReFTADJgKgj6E6hM0RrX8ciQbvxu5xVYfPtx20drQuidvHDss6M3rdq6yDRojT+h4/13XjXKEXxPGQQddqwoBtvQcwl/NmUQ/h09UEhwa9AcDx8zuqkvV1UgVzXA+5/rwXhVmahSP2gBRCkCx+Q3YECDhgzSyCCFFHp9Jb9j8nvCTwFVRdnMWUh861uQpkwEIIOYlBFw4ivRQxZAQOh9VgAsIfRZBwGHoLNPyJYh/mOELAB467hpAk7CkFIIVgV4VYNgOiXgQ2AUgUTRmzDwdEUGd8xeibcunY2STvHuO/PhOBz15Wffmu5OXxLcFq0AvJKOddzlW/qHA4PCVoV/PfP2gCe0vtfDXud3ekXty+7vd5XlLsnD1xGudvD2y64estXlo+5a0BIgdqlvCb/j38/YdX2/8Kfttn6n5DdBYjEkZu2H8uNPAhk7EoRKlilvADCpK/zBen1ICQQVAALpOeuCzj0CjmBzbkvQ/AciBB8IKQI3La+0l7M4CR0rwf5tKhxlYKexp7rWYgaer87gpumtmHfbgaXxE/jOeNUe79euWPTlZ4Zm1Ee9btEKIMoayG76M93RQtUM3vrguqjfoYuzc5E9Teh1c5ezOwadfbNbA9mOFEXUtCR+BRW+c6w6MkHdcB6rtu+Y/H7h1+0mPhMGqESQnLEnKk45DWTsGBAQS/B1xplncgQ+uMyWb7ztgdseUgi8h+WY/FEald3OcwKyaZheLZRVEJzqAdcZqCDsKJQBMyj8il+BSBJAJFATyKg6/lPfi2tHfopP7zllYKMP3Vt4Ev6JiurYmd3tvX/g3drcFgAvUj1QsQscONxCAAStCmQR/mzNf1H5D15aseLoP3cx1QDPaij0ibMqIFvJb8kotU1+q76fRgq9jPA7bf1sfT/WPAGVJ58KZbfdAEiuA0/SnJLfM9F9jrxAXZ1t2gul43s5wzo4uJxL+INpOOY+ELYCfOvY9EzQENdhyCvlA1UArjUgA0QCFLtqYFB0xnXcM6ITt6T+gY1P3TIw1oB7lr/ftg5PX/PWK5le7cDoxDTyw273lnOZ/tmEP1+HoPPmgPs78oL746Yx5I4YpBEqKHueKGeJVWZRVQCr6m0Jv9WKn0bKru+nbIefI/xOfZ9UVKDy2FOQOOwwQIkDFJCcUl+zlsFrx3eyx/6Osg6yPR5HWQRXBQQ1JLi8G0mQ1ewHclQF2JaCoK+A5yRUOFaBEqEAGKuBypY1IMmARkAlitWVKVw7shMP/n1vksn9NvYN95ZdNvm1Cas/W/8JNU01OnF+CiAs/NlLfl7VgT0n/9t79P51PPhmtOesZNMRN4fZlQXl7Mu3BcJKKh81xFMYNCKlv+nPEX4dhm3yZ9DLCH8GKWTYyD5iIjlzH1SceiakYfWA6Zn7khYw+znmvnNSn8DzIveyX24YEr1MSZb0vGbAoALgWQnB33k4DLnVgoCwcy0AxaomgKkWQLY6I5gERtzAcw1d9JIhy8nn9x2/7awBdyjZ1jVbjqemqYST5GekBoU8/HT91oC1T/4RhVHf2aoD0QQthvA2p6UirDr8+/p7+1OELQEnTe7WAJ41E9VhyQuQttaxPgHH0++F9bAlf5oRfgNSZSVqv3MmYl/7GkBlkAwg2SW+K/hRwo/wOl8zYPh25/doIkwkVuhJhHJw0pCAMiCc0j6Uxrvp3H2cKgFMb5k4SsC0l02AGvZHtr6JbisBg1ECBkCCSsG01hEJclrGES3VZFbHFMw9/X36h7/tgXT/2K+cW/vgXd3kP5c987I1lVdUsujSP2gJOH6VXP0BctX3owQ+vF/xRLn9Cr6JviNGRw3wFU6+TkYrZZTasEp+EzoMu4EvjV77zyr508ggY/fsMxCfPB1VP7wIZNgwEINYgp/x6vpufZ8Vap7ws+37Qaug2AfBborwBXDTZKkGuOvArCOc/bP5DFgLwFEIWWICgtUCU7GXFfithOjmQzOh498NHfTCEfeQNffc079KgADApbu/Vb920ZplhmFW8sXAW8cOABL94df92Ug/ZxpM6+j5lfoENDQASa7LG1CXal65yF0ByLf1wB8s5Jj9mtu632OX/L0B4TcVCVXHfAfxo44FUeKeqZ/J4ejjCDqvN56bITfvOa6XVRRBweati1AC2YQ85EuIWM+tKrDbpcB6NhSYUyXwKQfZE3xTAajqfbtKgKMITBlUpVhe14Nz91yDF286rP9aCggAnDXs34d2bOx6BhEThbB9zFlBZNf5FQMJ7MkKf36DiPBKfb7wR71erHCE0/CrDP2nMPJv7osORsrnGE6lw4Rpt+9n7PK+Fz2+kl+DDh2kqhrVZ/0YyowZgEEgaYCUsT6OyR8y5bPV9YMCT32Zy/qEcl5btno+53dIMUR5/IMKgpeW9zvCL+AKOqMI3D4GbAQh6zB0lEAsoAwUcC0CUwJkgp7KFOZOWIvb/3IQ6Ze5GhQA0DXTN7a/7yFECA8FYcak8Qub50bzaqhs5KB3z/nOQPY34Vgc+YkG4SxFp8mVtjDFkK09i03jOSPzyW34CNT+b7phvZbI97hmf9pt5tOhDB+DqouvgdTQBClNLM9+2q7zO8JvZ43bNTfKAejsw37ne5uyPIBgOUeDxqn92xFmN33AEgjV/yPWgVfvZx4Q6xdwlyW41pHrH5C8D6GeQgBl1tmtKdQEoFpWEEzr26SAxCzDObSEsvYEblo8ClNPXEgvfngGac/7ZYlAAQAjY+yNiOfG3nNP6L1aqJRVNILCzx4pVxNiWPitbdvOI5qNws6aT+q+XYdjN5hwvP0Zu5mvmyP8BuJTd0fl2ZdBKquC1MOY+zr8ffEBX93e+R0UehIh/PnlPbgQ2Og48oJ3LOhEYQXeXnaUBAEjpNRvHTjr2FKedQC6xwFH4IMWAQ0oAufYrFKQvXtIJVvYKSBRe39H0E1b+IOCz1wvlSH1xHDaCgVjjnuTnvzY/tjQl3eJfLygndy41/Mr9Iw+mv+wnFLKEmZnBGCEzH5+j3XrIkzwTHo2XfDjn0q8VGK//eLE9ftL/m50oxu9dj/+jC38yVnfROX3LwKBAkkjvqY9tq5fmTBwwt4dyGgEj75ThXRG8pn4vlh9wCfAFIFt2TOfNR3N4yCUpyRIeP9c1QLCpo/wFWRzEIaW2RiBqMChYCgxa/rHAFO1PiFfAbMPJNCYjoWNFCc9NQ7L/M0i+aM8PmdjNTXp0Hx3YM33/NL76/f+/YJCbwaE328cCyycyUudTj0p2+XXY7v9XOEnBpL7HoyqUy6ApCsgjvAzgs+W7HuP78U+E1MAgGUtMbz3eVnYtHdKWnYd+mD+c3bI25rgWASuYmCPH7QQnOoCU8pT+7drCdjf2ZoHuVaBcz8lJo+c1hHutdj3T7KXTeoZFrCtBdYoy8iYsRZ45thPcMwTlC4pRgko7S0tdaZhqNFJeK0CuZrg/ENT8Bx9fMF3LAoh+FF4Tj/DHrQrbYu/1dqftvvxG9CR3PcQVH37AsiaCpIhViSf0zPPFX5ql+4EqzeqyOiAYRC0bFLdKoCvXz7HAiDhTBZyQUXB84NTgF9NYEr7oOnvXEBI8J31EcqASpxttuOPMKY928uR3wzsR3LuMaNo3WoBmCqBlQeiSxi/qgJPHbMERz9J6eJClYCyeVl3A+VOEMKqM6/Omc9FOFnnddjJT/gFfJx6v+nG9jsNfV54r2aZ/XsdgqoTL4SUUTyTn63bU0AmJg7etRsThmfwzPsV+HxNDHPvr4dpEHR0e+Y/K/SEJ/R9EHhKsqcr5G0g7L4cJeCa905pH7BCohQCW11whZ1RLKyvwZ1HHvBbAs4qnr/E8Vk4dX+75GetABOAROwYJOf4CkAJiE4wdnUSjx+5DLOfAl1ayF1TpIReyX+AjsATVzCLG+We96C8er4Q/vxxmvsMu7nPL/yetz85eQ9Un3QBJE2BlKEgBvE79iiQUEycftBW7D4uBYBAkbpwx2NDsKVd8Ww+yvjFaJ5Cn6PxgxK/AJDAd+hQuV6JiHw4zjlWKbgOQfa4hFFwPD+Bs551GLL1fmc7W/rbnn7HfnesAbYawr2Xsi3s9kbJXu8EHjoWiaMIGL8D0QnGr5Xx2LFv47An9sXa/N4oQIpXJctJxG32jHGvucp7tk49PbhH9mfmdwaaQvjzhK33ewN4sSW/Jfyx0RNRdfplkAwFUsoE0YkX2283PZXHDJx7+BbsPi4NYkvFF2tibru/88L6PlYmstZfAbgvJSXeKtekZQSBPa7PA898HAHO68McM9RqYV8TNZlrY4ctY6MdnQ+ThjDr2dGNQqMdBcc+NLJsD3zAfCRmvWQHaTlWnBQIz3b8OaAgmoSpaxrxj1Nfo1X5vleSSZRE7lfPe87WDY9S//5qQ3grryVACH8uvCY/tt5vlf1p19uvQaoZiprvXwlZqoCUpiCGZI3Uwzj9ymMGzjtiC3YelQEhgK4Dj75RhWf/WwFCrVF9JJ7QB0xWrtA7P+39JfucUkDYg01uoWOyH0Yg891OWCG3hVhyrotJT4PCzgg8qzB9wpvjt9uqwo6ZEFw24B8nMagcdCY2g1EAblVOZ5SEfzh1kpax/xdN+M31f6Kcfj1hFAlG1oiisPGfuxrg7MPCcwpG9t2XCJQyFXJcgpExofdo7qw12wwCyHEFarkCagJaVwamto2HbSOAHJORqIqDSEC6IwM9bbiTdDh3E/DX+52Ovazwm4qMoSdfAqViGKS0CWIQb6w++3BxxcQPD9uC8cM1EAJoOvD3l6rw38VlVmXSOV2039d7mMQn/2FTPh8/LuUshxr/c9/DvHGqAc6yc1qmCkDZfLDpHXPbWcc0DzppQq0C9rGpDO7Ix74WBidPsncr2BgAidP0SILnszx5pCeO057ZH4tvfJvecvW+2cOGFT2l9UaV1+E1NMv95r01gbvvO45jDXhHVCtjmHXmDOzyrXFomFSNWLkKrddA69J2LH5mBebdPR+9bb0FPPHcEFXCzkdNxKzvT8WIXetQPiQOagKbV3Vi2etr8O69i7Fu/tqivdXcc0rAiJmN+Nr/zsSYvRpRPbwcRAK6WlNY+1Eb3rlnEZY88yVMzbQVu9fkl3bFP2WP3W/16qv55qmI7bSr3cxnCb9bggGQCMX3vtGOnUdZwq8bwF+frcH8zxPWM+AJI7tMwpt8DsEszXoRr0FAg/TrY4248eG8RJ7WcRwyCpEV9FALARBqHvStc1oF2HMST9+GmgkdZ6DT/Mc0CUqSFRpMJG8Zdk9E2xchdyZw3Ss1mAfgjay35LSyR76e7sm8jIC/0jPOWRPdZKYC908NFjUugJfWcvbJMCHBYLZbd2DcweNw0u8ORP24SrteGngelKJ9bS8eveR1fPzwp/0ikDU71eLEuw/G5INHgEg8jxWgpU28cut8vHjjPOg9fQ+/jlfFcOQvv4F9ztrZN0Nv8LyLn12Fh897AVtWtsOAYXfr7UU3utCFbvSiGym77h+fsBuGnHEdJFMF0exx+mzHn9PUt/+0Hnz3oHYQQqAbwP3PV+PdT5MgQTc8R5BZ0x7s5nyFnk1byD6lgOPEdJyGQeehbx073RhTSvsGEInoJJQzWMgJElLtQKE4YCRg9SOwg4bcfgT2cQgAxcAXO7Vhv0f2JK1Rlys1TR/VRjjxvDTPp+pPRbhprC38eAAAmHr8BJz12GwMG1/FFX4AIISgZkQZTr//EMz64S7oK7Xjh+K850/ElENG8oXfvhw1IeGQq2fipD8fCTkuF3aSALEKFac/dCT2P3dKtPDb551yxGic+9zxqB1b5Sv903ZfP6dnH0mWo/bYCyzh1+3S3yBeXdQEKpMmTjigA4QQUAo8M68C7/GE33mEgdU+h12gBMurxA/4C7Zb4WfzF6gquL4RNnjK9O4N1yFI/b9DPoBsH46zUNK9jltyGiBOB66gY9Bu6dBkjG+pwQ3XvBfZ2Aop1U03EiLlUbTRHGuzuQZZ4XcUgkX91Hqc8sdDES/Py2cBJSbjhDu+gdH7j84rPQ+1QsWpDxyGoTuV5/UyEkKwx0nNOOjKvYt+eQkBjvrVQZh8eHPe+wybVIuT/3QEaILadX9HAVg9+0xioubQMyDXNPpfhMA8e9aMHZYpuWRlDM+/W+F57ZiAE/f5sc409iVnH1w+sMK/PQt9NgKOShK4L9laA7jOwYAD0acM2O0Gwq0G9vOVNFgduZiQbil4DFvMumP4wX/LcFiU/Eon/Wb6ZkLQGb5u1u3n39mz5rI/Vb+1xJmiQiI4bM5+KHfmqc8TNS7jyJsOAOTi3qrdT9sFzXvWR1ob3GuRCL5+yW6oHlNb1DmbZjRg7zMmFbzfxK8Px/QTp0EjGaZPv1Xvj4+ajLIZB0PSCHe0Xucl7eyScdejQ/DoaxX4y1M1MA278saWcqz3n1fK90Xwd1ThD8JcS7CZNEoR+FoY2BYCtiUgqvnQCAt/ZMtA4FjwlLa6OYlffXcereBdknTAQQldVuWl2a+bUydn1kX7850gH89fwB61enQNph1VXEk+bt96NEwbVviOMsHeZ04rSPgdyqpU7Hn61MLPSYDdvzcFShFVCCIRfO2sXZEhztx99vTcsoQhh/4QEtSw6ci8AJa5SrBsTRwvf1CJrl47D1FmvZ3fogm2GQ9WohQBUzVArtKft41RAqEmyKBCcJQAUwXwKSGbjIypq2rJ2ZgTllIJIJDj6vvBDZQzNghfzAl3Ddv3P2j6O3uM3W8U1HiWunC2+0+AiYc2F7xfZVMVmqbUFHVOEGDcgcP93rA8mXz42OLOCWD0LsOQGJq0Y/yt0r98ygFQGyeEzX627skJhnEDZRAo5fsC2ya/vTv5+htWEQSCitzSPPg7izLIth5BRcAogajxG+1mTdIZxzXHz8bwYPYlAFBU8jZ8VUB/kx5FdBBwdlEIz4njqgJCUDemrKiS2NqdoG5MsuD9qkfXFK10AKB6RA2IXHhJXt0UL/qc8XIFiXoZuj2aHxQFNfucDGJKvjpk4KGHFIATv17kLQ8TDMoZTOZ+oThNg9SvgFnFEGURIFhyR1QdfMdhHIO+wKFgtcJ+FwyC2nW1uOTEB/0SKwFArCL+HiHeEEPBEX6c6wvX+aOedthnwAYJE8AOYujb21JMSyAtZqf+OEAfz2vYk3maMFAx5UAodaP8/flZz7PzIZxPHy/fvZagqf9VFfwgAYsgVHrzWgZoeDm4r2td8SIOg0O3G34F4DgEe1SclRiBJja7EgA0zxi9UokpWf0ArOOPclx6bKQfAmn9x/AqBm0re0GLFChKKTavKDwoqGPVFmjp4iP8tq5pBzWMgvfb0tJT9DlT3Ro2t3bChAHIMqpmfssN9PGN3Evh99hHhc3mCq+lOfYNNusJwjDWQMg5yFMCbKtCVOlvINIq8FUBIqqABkH1lw04ny3EJAC44rHJOlHJi77c53+dvoCg6FSwU3nvzop3WqClihNGSoHPnl9Z8H6d6zrQ8uHmYh8rlr68CtF9WKP57PkVRZ9z2YdrsWVTGwyYSAyfAnXoaLYTiCf8uTz2wR40hUD6uP9XEaczU0ARRLUWsHX8kOXAa14MthZwnIGBORpIr4ofnP4m3BYBtzJcVlP5BNzAUS94JzesgR9WAuHZ77z2gI6Wdnz079VFWdVL32zFxk82FL6jCcz78+JAvH1+9GzV8P59nxZ+Tgp88MAS6EVYHpRSPP3nl6FTDRQmqnc7BoTK/iAUCHncnvGNwxBspQmU+KGeiKz1xbMmGOEP+gH8LUFWXjQZw1fX4VAnb64COPDC/V5XYkrhRSr8Xn4e7PhAsFNSEzB1Ey9c/zZ6tqQLOl8mZeI/V7wKFNlBaMF9H+LLdzYWVP2glOLFmxegY017Uedct2gD3rz7o4L3W/jSF3jpX2/AoAbk8hokRk8PmeGhUXAE2xdst+aA6c8qhmzdjbnBQ5xWASkiGAyAYwlIPTGcsc/R1kpXAfzhylt1JSY9BORV7LtHzP3e8eIAbWVmULQu2YSHznkV6S49rzNqaROP/O/rWDOvpejnoffqeOC0p7FxaVdeSoCaFP+9dzFev+Wd4p15FHjmp29gyfOr8t5l7RetuP28P6E31QsKE2Vj9gSJlYeH6BbCv+MQjBdghJQES/+gEzEwOSu3OZHXGsDEfFAAKQXfmHQVGgFmKLAVeAUHjDxzbU976oeg3pyBQedeuBrIjvdPItLA7hSEgC1gsenzNqz470Y07zsCZbWx6M5A63rx9zNewKIHP+nzc0htTeGjx5eiYVoj6prLuf0BKAW0XgPP3fABnrnqNZiZ4p2HAGBqJj56YhliFXGM3H0YpIhIRkopFj2zFDed/H9YtXyNG/1Xu+/3oNaOcuv7vq6kgh0C9nE5Phs2HoN9pr7na3c4CnU8YjsSOWnYTkcyfLMZ2R2V1HQMH6+8a+4i3+tzzw0fkzdv/OzxdHfmaDt6nGkG5A/d7R/VByCBGYMc34AEgzutmEQoJEJAZCBemcD0Eydh+gkT0DSlGkoyDiOVxsalXfjwsaX44L6Pkd7cv92BIRNMOKQZe5w2DWP2akSySgU1TWxp6cXnL6zCu39ehLbPi3caRr0FI/dowqwzpmHiN0eirDYBIkvIdGWw7K0WvHnfArz3wkJs1begC53oRS+MuIpRZ/wRUrLKc+oI4d8xoXZXDN7w4exMQuxvdrYgdhhxZnoxM2Z/270Fjbg3zLjbs9BWAkkNf9/pPnwv9Aqd1/zCfm0r2141KVGcaT3YMfzZKcEkV5BNdxkhReHtF1QArgIhAJGIPWYbtcxyGYCkAqYG6OiX7r85UQBICgAD0CkzI8O2gygEkiyDSASGriOtp9FDe9CFTnSgA93oQi96ERs5FY0n3QBQ0n+BPIKSYQXDgT+vYLBrcLBbME8JqJ4SMBklYMaZOQZsa4AQIGZg9ew3sFMoJK5maPW8WDz2uvPbP+s8fBaBlybHhXJhRg+ggGlSmAZ1x4+jGgXSGqBhYIQfsBRNRgcyAyP8AEB1CiOtQ+vNwNAMmNR0p/c2YMKACQqKspHTrSG7hPAPCoJjFvpiOYIOPF5EZ9C5x+7rHI83tbu9mJExYskuGBdSADe9P8uoaKiYIxFoud81yvznXiaTMjwYGPvthLBSk/Y9Wm8HxZntx7SF34QBChMUJmINOwmTfzDBBgoF4wQCQV2hzkaUo0A4yiTUMcw7NShANpRhb25Q/PqGiW/GkuojtI9lb35RBGw/wf4aeHzHhNoqwBF+0/4jsgK1dkSpsyfYBrhNg6wS4Ak4EBJ8kuWb1/8g0FpPMjKmcxXA4+8206q68muILHdEN/QxnclRmLAHj0ED2z3r4KulDqhb3nt/FBRSrAxSWU2psyfob9gYuWDYNUf4nW+fEgjEErBRhb71wfBgAAbBpMhucb9ddeiXZRXKDSRUG+bN8AfOuogmrkDgcLhvAQmc66sAdf9MtxJguupAKq8DiZWVOpOCbQGvKsAT/oBi8O0T0a8gqBzc48NtRRoTqQAIIRg7o+EONSHPY9cHOwUxh4skav5gflrniI7wD347wLunnhKgjAWgJmtF9X8ww/QZcBx1vsFasnTw4lYDoiIJqXcIAMjIqM/aMf661/ZNVw0tP0eSpQ6ekId7++Uj4NknB/fWsQ2Qg1sFeJWpsPlPQYHysmL6Hwl2JLKV/EzId7bXIOQDyNaKAECiKM85Msbv1xz+cVll7Mcg4Mbq8icHy+93rrTMpQ1qO8B6LuyfXwmoJAYxe9IgJ2AFRPoAEC3YbrpAqDHPCgAAA8hnaByCxmmN98aT6gMIFMX+kjt3H1Feqc/b5qVh5xga3AIQFn3PAiBqZamzJxgIaB7r2To8IpYDlkBISdiYEuS8xsa66c29jfrm6ovVuPJOUAyDHX2iSvjwIKIktOxcQniwEef4g9cKAMI+AHcotmQ5Bns1SACvL0BQYPMZuh4IVRdCVgDHYshvMH4Aty0+uOOCnZ7+7tY13a/oGW2sd1qrOxpbVvPmBuTBCrpT3odjDb86k4cGLQBXEfS0YzBYQLIMjB0ONI8AaiuBVAZYsxH4YiXQVfyASTkZNgTYaSQwtMYKNtuwGfhyDdC2FdskspICqCoDdhoFDK8HFBnY2mmds2VjAQfKN2/B0j3QZBhlBUgUZt4KAAB+++URK/+n6pETTIM8Qw3aQJhjsiMHWufmK4EoRRFM7x3TuReDVSFQnw/Ab/xbWzS9nXNHdhwkAuw1Hfj2ocCIBuu3O88etYT/hXnAEy8DXf3Y12tUA/Dd2cCMnQE18KanMsC8D4F/PANs2tp/5yxPAiceAhw0CyhL+p+YYQKfrQD+/jSwZDl//z5H3tlCT23Bp4FRo9gTyCYyBQ5vOxfzUw+tf+Wv699Pd6aPg0kThBF6/9yA4S7BXtfg4D78ocVZ/zgJrBlsSsCZ/deZ/DONtDsBiDJkFConHoAdUQEoMnDGt4DTjgJqqvzCD1jL8RgweSdg1i7AR18AHd19P+/+uwE/OQNoHm7lITg4qqpY2/bf3SqZN/ZDh8+RDcB15wJ7TLGuKXhOSbKskQN2BwwDWLIi4kAEdme47B+nI1HUOrZHofuxOwZRKz+dBY+PTQjB+poDXo2r5DQQ2gnwHXj5wmsJ4A066tyXQo69o+ApZy8WkB2K3di6YYfsHyFJlvAfvp+1nIsRw4CrzgRqq/pwUgrMmgZccIpVGmcz8QmxzvWTM4BJY/p2rfW1wE/Ptq4hV7UipgLfOxI4+utRGQtfk+8b8L8PbBOf85szJFgwlkDRsKWoAfIfmZ9A+5AF/04m1O8SWXLHyPKPAMAL/PGH/gbhOQq9z45rAueCMPfFZEx/Bz3dCRj5jZi0PTFjZ+CQvQurZzcOBU4/uvi6eXUl8MMTLCHLl/IkcPZJhe3DQmCdc2hN/vtIEnDK4cCoxjx3CAivr8kQgW2cqELuyFEEa4ueIePRlpuQnjT6P0NGDzlakklLVBNfISX2VyXwN3jVHp4dwKL3boaZ6izoqKVGloATD7Ycf4Wyz66W86wYDtqrOAtidKNlORTDuFHAjEmFK614DDj2QH9pnjXgK9jWj7D3Hxzh54oVARSK5cVPkQPggYV7A/FRb5SVqbPVuPKZcyp+jH8+Do78a/aDtUmQjXkg9p+ppaB3FuI+Lj1N9cC4kcXtqyrAnkVMwQgAX59ZnPUgSda+xbxV+8woTtERAuwx1bJAAHgmfDZYQWc7+vB6DgYCfxzl4vhfVR0f9kkBAMBdSybjj50nfVg1NPZNNa6+xWQhZMazV5HdMuBFCJLI7YMBwrHP3PWUIr1peeEHLSGjmwCloDYmPzsVoTwqyy0nW7GMagLUIgR5Yh/8B+VJf54p4Pee8z5BOB2EXLxxAK2fzPZKHQv6rAAc7mo5vqVh5+oj4uXxPxBCjCjhj3LwBYnyg/B+DRaI+4fQUmrD0r4efkCpKu/b/rXVhe+TiOXnbIwiphZXklf2oaMmIZ4FQBlhdT75lJME8M0dEFQClFEezmrZRM+EzXi/3xQAANy86IiuUTNrzy+rSZ4tycRtWGFHDRSE4Qk+AYEECZK93LN6Iai54zgCu/vYnt/RVfg+aQ0w+zCUm64Xt39frpVSoDcFf9RfUGCztan7DgZ+nd9pDmT2j+tY8MGCIpoBczH39UMNedrEP1cPq/yaElfeBeOuyL/vgP8K8u94vKNCXZHnfwgyHWuhby5+LoSBZvV6K/ClWL5cU/g+nd3A5vbC93No2QhktML3W7a6+HP2pq0YBGeUYMoR9JC9GxACn8VP/d9uev9xqUrx4nVHWWOP9ju/e2NX3LnuuE+GNg85OFEeu5lIkqsj/aP+BKERy4Mb50olSJDtct8Tf+sPponuFR+UOqt5s2YD0FLEzG0AoBvA+0VM/UAp8NZCFBUzQSnw1oLiHIj//ag4y4FSYNFndvQjW+oHSzu2SpDXgZlvL/rOCsKyVplDuunTh4wj2CYKwOFXn83urBpWe1XV8CEHKXHlvwChwWCebGW7f+yhwasQHNPfEXbZFX/Zpwq6l70NahY+M3Ep0A3gsZeLE8b3P7EsiGJ44R3LEiiUdZuAtxcVd85Pl1uhvYVcK6VAOgM8+Sr8k7pyhN9HlOkflcQ+JgEQk6wAw7iBFbt8TBYC2LYKAABuWT6b3rHmmHlDx9Z8M1mVuILIZAsJNXiwV5vdTTg41YB1tZbwy+5/yWcDEPRs+Az61rWlzmzevL3QKh0LoW0rcO8TQBFztwKw4vrvf6qw6kc6A/zpUaAnVdw5TRO451+FdWgyKfDka8CXLbY1HFX3Z78RWB+Fv4MOJAIkJCBGAFkCrdJx342nQwOYqcG2NW9uelA7+Oj/fVtp0x8xTbOGGsbOoFTxKz3KVYTh+H/PYTZYcEKAdOjIIAMNeqBbMIVJdchqGRKjZ3CnT9veMG0Td0SDFSKbiw1twM33FthjjsPyFiCVBqaMy+3V70kBv/8n8O7HfTtnR7fV0We3yVZrRLbHY5jAU68DDz1nLbuTg9h+ADaWn50OzP2WOL8JQOypwNwJRRSAxgApDiTigKwAsoT08B6c/+E9lpO+JG/Rj3Z9QlLatD17Nndda/T0Hk5gSpZA+2cOsjLohcZ4/QG9DsiDBQoKAwZ60IMOdKDLnhFIgwbd/eiQK4dg9Kl3Q0pU9P2kA4SqALMPsD68cNl0xqq7P/CU1W22v5g23gq3nTAGoZEvdMPqePT3py2F0V/U11o9EPfaxQstJlYoByi1qjYPvwi8s9Aebddx/vFmBWKnBpOZbTLzm+noA2bZjAE0AdByQCkH4mVW5GG5iedOXIkjjj+M5GVMbEMobpn9Vv3SFz5ZCU1P5qMAHI/BYFUAJkykkEKn/deLXndiUAM6NPu74dDLUDn1m6XOcsGUJ4FJzcDYEUBdjdX8tWYD8PFSy3TfFh2eZMnqpTex2VI+hgls2mLV2ddvKr6qkYuhNVYPx2FDrNJ3czuwdBWwYi2gafA79nIogNBvVikwigBOqe8ogCRAKoB4BVAWBxoSMIalcczPp5CnnXz2IVarrxCsm//gEKqb8exdhMLR8oNN+L3rJJAgQ7H/ZPvPqQbIdpVg6/xHUTHpABAlVuosF0R3LzD/U+szUBgmsHKd9RlINm0F3pgfvd1tBWOa+dg2fxqoB2cNCrK7G7OtB0QCoACKatX/hynASAMLR6/F8+yu29wJmI14bVUTqEn8fQh59X9vsLHB3mFIhgQFClSorhLwGget5fSm5ej+/A0MVpfooIZ6whzy/rNt/tmUQJQyYH0CMiCrQEwBqhSgOQZjWBq/+P7BxBdNVlIF0LN2Y1O4qxA7smDUWEeDs/R3mgIdBcAqAfZPgoSt7/8rQ7XMjhMaKPA882y4L5BduKM94tEfCSCqVfpXKECTCjQRvFezCU8Es1RSBWBSeTjyiL0IDho6+MTff3UKFMTsP08JKJCJYsaV5GeV5XU3DVFieyfL1NshzIAdA1v4fS10EUJPIywCMMu+h86kJxJAbNO/LAbUx4DmGNLxLvzk09cQinMsoQ+AQpb/NpxEmvfest8pOLghIJAhQ4WKOOLUJKYhyfLyWAwvJqqr/qGq8rs7mU2pG9ecjwur71i5YTOOM0yML3W+BVlghZ+pr7OdfwBwTXuCQAQg8dY5x3F/285AogKxOFAbA0bFQOspHkq34M05c8LSUzIFcP/9wLwzM8ODkX7hmQe/OhA7gluW1a5ETJ2vxMqeKy9TX1Tj8uL0flu6//DAT8G+IdoqbC6rxxWd3XgIJVXmgrzIEfFHOeY824ff5+QDJ70EEBlQYkBlDGiMAaNktMibcMVphxGuUJXspck8s0aSVdJopsPdhNj7ZX07ymHQlf8UBCaR5S1EkRcTicyT4/E3q0Y3vIvm4a0bP6kyf7N0gpVyBQD8zLfzPfcQXPdr+vjnGdyX1vADDH4DaceDY/qzkX+h78DuTnpeSLBTjXBKf6fun4gDdXGgOQ6tMoNLj9kTkYHVJVMAy959VTZS6aFBz3/47g0KKAgxiURSINIWIpPVUkz9UFLIIjWhzk/WD1uSqTA7t67sMm9p+S6wBUCecelzf0TMi26kV65vw36GiYmlvlBBALbUZuvqCJToxN8MmPV4AeuBOLEEilX6V8eBMQnQRuD+zV/gYbJz9AFLZzYqdQkiddXBnXKQ9fzzrnsbFG4EKUmRX5GTCaJ39zZJcbXaSGmVhNAYiBSjuiHBcdA7e/ix5+4ilMhEo4aZlhKJXqplNinl5euNVHqVpJAVSnniS0mNr5JiyhqlrGzTjP/ZvefYS0dS4J8Avg30sY36zqvJxrOupf+zpRPPUEDMI7a9EFX6w/N8E8J39FGeKcwc1vdG2nV/SQXKE8CIJOgYBYukdlx6xtEka6+IkikAVelNEtOo8AJ7wmMAwN3Wz8IvS91yWdnjaiJ2e2xsfP7cd2fQj94dRT5/MxF7a+59iRFTqtR0vKm69e0PyiqGJmJyPKbIcVWBosjMradGbyrTvX5rrxmv00fuPbK95bX5XY1HHpPZ9YJU7yFfH0sBGUgDCPZOu9RZ+Ha/XdJOI/DWpytwVXcKv8EA9vEQ5EFEUx5lzHjwFAIDd53Td0C2PP/xGFCfAMbF0VaRwZlH7k625JO1knBFwwM792xs+wTU6gfAXiY7KXg/KgAKWepUyhKPJhrqbzbHjvzshhf26sOQFdsfP7uDysta8OveNM4n27irtyAHTG88X7Me47AzbdPflGwPfrBTENM5yNcHgA37jQFIAEoSqKsF9qhD7ziC04+eTB7OJ5slswBitRUNPRtanVvkrieh5r8+Cz+FTLqUhPq3ZF3NXfE99vjsmkd3ptixhtjLi59fTIxLbqZXrGvFqIyOYyCcgjseTF0hZA0wcXGUwLLzFMv0TySB8RXQx8j46Wfv4ZF8T1cyBZBat3EkYWo6fsH3D2ZS9K2Upa2yKt2frK24Y+mwrcseXHQqxapSXfHAcPvl6Ln0VpyxZgP+renYF0IJlJY87n64r4v3w53njwZ8BU4HIAWQ48DoShjDKX61+iP85rJTSd7e8xIpgH8Ccs8YuP4QnvAXXfpToshtckX5vfHa+ruM2p5VP5//HdpXR9sOAyG4Fdhy3vX0pLat+LduYHcIJVBS3Lq+byUYbxLcIXKo2+7HLPPG97OrASQGDKuAMakKd9YRXHvCiaSgIaNK8mIcjfXYuerxOzMdPRdamXCm/mItgYLFnxJFblUqkr9PNgz9w7gjjltz+q+/2u/92XPp8K2deFIogRJA4Qbam4E2e0eITeLV/WmWZd8AH6pV76cJgJYBdbUwdxuC309Qccnx00mm0GyWxAJoxCvE0MyR1j3hCX9BbyslClmrJOJ/rBhd//trF3+yHlvPBj4rxZVtX/zfdWTtOT+nR29pxyO6gb0hlMDAElGPZfoEWeY9rB/OeAjOeneZ3Zl4yqC6DMb4Svx6NMFVx08nRYxnXKLOQHvdfCSRFNIQLfy531MKUKIqa5Ty+DUVTTW7HXbUrDnXLj5pPTCnFJe03XLPz8i6EcNwZEzBkxQYNJFVOwycWXmDH8qmyzK3nxPwAxmoSiI1RsHP4r248ju7Fyf8QIlKhJ9OejDevWzjx6ZujA8G/+Qh/JTEYyuU8vLfVIwfed/zVXdvfvPFR0txGTsQFBffjLJNbbg5lcF5KHEv0K8EgWZAN/gnUA1wTX5OWLDbDKgAUK1RfswEkKxEe2MZzt+tFg+efWD+Dj8eJakCJKuGJrulTXUEXnf2XIJPASqp8hdKedldtTs3/3V+3T4d/3pqxxkXr7QQ3PET9Fx/F714SQuW96ZwPQUSpc7VVwnWs+98sfFBbKRgcB0h9qxfEmhMwbIa4Izpabx59oF9L79LUhKY3ZuroGnOnKi5hN8kivR5vLbsh9Xjhs8s69pw51XzDhHCXwQ/vZCYk0bgtqoKHCdJaIGoEmw7mMq7U0az9XqneS80qSdbDYA1pDcFYEowYzJeqif4xl++wJvnndI/xntJqgBXDrtvZrq19V3QLAqIwJTiiU8kVbp9yPjaf1254Ntdg7A3YEmglOL8G9C8uR2/13QcCuEc3DawxTnbJ4Dp+eeY/25PQKeeb9f1TRmgMaQSCfyqqQY33fkD9Pbn4ypJFSCWVBrTUcJPYEix2IJYTeXtQ2bOeOTyp3dNYwFwFU4uRVYHJdacAnTFdXfjmGUrcWlvBldSikoIRdC/sDY99ToAsZaACxv5R70AGUXBksoELrrz+3i5urZv9f2oLA4wFJcmf3um2Zv5g+/8BIYUU+bHqituKBve+OzPFs5OD3zevnpc/HOKFMXMrR24R8QLbCMCzYGUcQ6ynYEoLKcfsXr2peNx/GlINX722wuweVs9lgF/2CfgeYyvW3Ndpm3rdbCq/4akyG+rFYlbKsc1PnvN+8cWHMwg6DuX3kbLNrTivN40rqYUtRCKoH8JKgHAb/bbH0kBjcXxSTKBy+qH4IWbzybbtMPagD/ko5ufxqSNS39r9OpnS8nEG7HKqlsTTYlnr11wgrEjTHc1mJk9m2LMvhi3pQPXZzQcD0CFUAQhqC3MBd+YgE+AHSIcBFRRsSWZwG9G1uO2+U+i69lnt/2tH/CHe37jQlKjLrnK7O5aMGTKiBd/8ubhmnjHti+uuYNK61rx9a5e/NKuFojxBRCeuaio8ooZJMRZQyT0JhJ4sLIcN0yoxfLLzhs4eSiJ5C28dyEe/8HjmCOi9rZjKK74NWLrWnFCKo2rdANT8RULIIqaqqyvhiql9hh+ABQZKysrcPysSVhwzin97+TLhSh6BTm5+g6aXLMe301l8CPdwGQMUouAhhYs+r1malsBJgUUBZ/          uOgHTf3YOKckkL0IBCPLm8ltp2YbNOCadxoWagT0xCHwEIaEnvq9tfl5FQeuYJjTf8mPSU4rr36EfnqA0XP87qixfj7170jhL03CMSVGDHeRdou4/hmIcev2RDwCQkJrUjLG/uIis78vximWHeGiC7ZNzrqSkrA6NrZtxWkbDd3UDU2AFl20/71WwCyQbolvCXDIKwKitxG5/nkM+KkU+tp8HJdiBobjut4it2YDpqQyOzeg42TDQjBIrg37x2m8jTCfyj4A2DcWhd19NXixFPrajWyIYDMyZQ1E7HrGPvsCMnjSO1A0cpeuYCiCGAX7fWAXgRtxtJ5hwhwCjiQRO/8eN5P5S5GM7uiWCwch1v6Pypi3YqaMbB+o6DtUMzDJNNGAAFcL2aAm4CkACrSzHVfG1+OUf/zjwGdsOboXgq8K3P6YY8xzK2rvQ3JvGTF3HfibFnoaBsSZFBbzOadvkvdxuFAG1FYDV84+qKm7Tk7js0esGPkNiRlnBgPHPaQQAegAstj70vhtvBOkqQ+XmDozrTmEX3cBEamKSSTGRUowwTZRTIB44VFGSQrxx96zGAG88vlL6KQiAkaoRHv5vIBAKQFBCCK6+GhRAB4AFABaMWENx8F0gci3IEBWJmEJr120iTXEVI9s70RCPYXh3L6rjMdQaBmozOuKyhKQsIQkCd5YpdwwOCl3X0SXJSMcUtKc1tFYk0ZpKY21tFdZ192JYbxr/qxuYDivScWAC8Fn/BMGwqY2leQJCAQi2K1pGEvzVGzujx/60AHgfALAbtd7a94DvXAk8/i+QT14AnTQpWnDJCNB9vwYyvQb0/jSAMQBu9lTFT+/CP1avx5GpNK7U9AHq+8DkVjfQqFnnHPBoQOEDEAgAABS33gv1o6WY3ZvGpZqOfbCtCkjqHxNAVbFp/Eg033QR6e7bgQvnK9W5QyCIhuDSHxDt3uvJE5Ob8Y3aKhylKHgVgIb+rpsHqgC6jkrdQHkprlooAIEgwJwLiPGnueS5KWPpwVUVOExV8Dz62zz3OyvUrh6MKMW1CgUgEEQw53zJuPfn5JWxI3FETSUOUhU8CSCDfrQICABqgug6mtA88IM0Cx+AQJAnc++gUstWzOzowlUZDbPRl2AmJhaAEtBEDOcu24j/e+/PAyuSQgEIBIVAKa6+B6RtI2Z0dOPH6Qy+jWK6RTOOQBDQ8iTm3H8D+X8DfTmiCiAQFAIhuPFcQu+5liwgk3Da0FrMjKv4KwF63Iku8zoOvIoEBcloKEkkgLAABII+8sDDFG98gontPfhJRsPJlKIc+cgWYwXEYnh8j6Nw3OUHDKxICgtAIOgj3zuR4PfXkc9Pno2z6mvpbok47iIE3cjlLHRGBrbCnhqa2gd+qDVhAQgE/cx3Hqao+5yO2dJBLkln8H2TohpRsmZbAZKEZdUVmPbnuSQ1kHkVFoBA0M88eCLBXVdLK8va8KPhwzA1GccthGAreBaBN21YzfChKBvovAoLQCDY1txEcTFBY9sWnJfWcIFJMQRh2eutKMfkv11PVg5k1oQCEAgGDIof30LrNmwiF6Y1nGsYaCBeV2SzYQj2vvtn5L2BzJGoAggEAwbBbZdJbQ/8gswdOYxOKU/iaknCOljdlpHKoH6gcyQUgEBQAn59hbTl/pvIL5pHYHIyjksUGaszGkaWOl8CgUAgEAgEAoFAIBAIBAKBQCAQCAQCgUAgEAgEAoFAIBAIBAKBQCAQCAQCgUAgEAgEAoFAIBAIBAKBQCAQCAQCgUAgEAgEAoFAIBAIBAKBQCAQCAQCgUAgEAgEAoFAIBAIBAKBQCAQCAQCgUAgEAgEAoFAIBAIBAKBQCAQCAQCgUAgEAgEAoFAIBAIBAKBQCAQCAQCgUAgEAgEAoFAIBAIBAKBQCAQCAQCgUAgEAgEAsF2xv8H/0j9ySYmTDMAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjEtMDgtMjRUMTg6Mjg6MTQrMDA6MDCmSixUAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIxLTA4LTI0VDE4OjI4OjE0KzAwOjAw1xeU6AAAAABJRU5ErkJggg==",
                        //#endregion iTalk Profile Image
                        Online: true
                      }
                    });
                  }

                  FinalConversations[x] = Conversation;

                  if (x === User.Conversations.length - 1) {
                    ConversationResponse.send(FinalConversations);
                  }
                } else {
                  ConversationResponse.send("Error: ".concat(Error.message));
                }
              });
            };

            await SearchUsers();
          }
        } else {
          ConversationResponse.send("Error: ".concat(Error.message));
        }
      });
    } else {
      ConversationResponse.send("Error: ".concat(Error.message));
    }
  });
};

const Recieve = async (Data, ConversationResponse) => {
  await _Conversation.default.findById(Data.query.ID, (Error, Conversation) => {
    if (!Error) {
      ConversationResponse.send(Conversation);
    } else {
      ConversationResponse.send("Error: ".concat(Error.message));
    }
  });
};

const NewMessage = async (_ref, Socket) => {
  let {
    ConversationID,
    EmitterID,
    RecieverID,
    Message
  } = _ref;
  await _Conversation.default.findById(ConversationID, async (Error, Conversation) => {
    if (Conversation !== null) {
      let NewConversation = Conversation.Conversation;
      let NewMessage = {
        ConversationID,
        UserID: EmitterID,
        Message,
        Date: new Date(),
        Readed: false
      };
      NewConversation.push(NewMessage);
      NewMessage._id = NewConversation[NewConversation.length - 1]._id;
      Conversation.Conversation = NewConversation;
      Conversation.save();
      Socket.emit(EmitterID, NewMessage);
      Socket.emit(RecieverID, NewMessage);
    } else {
      await _Conversation.default.create({
        _id: ConversationID,
        Users: [EmitterID, RecieverID],
        Conversation: [{
          UserID: EmitterID,
          Message,
          Date: new Date(),
          Readed: false
        }]
      }, async (Error, Conversation) => {
        await _Users.default.findById(EmitterID, (Error, User) => {
          User.Conversations.push(ConversationID);
          User.save();
        });
        Conversation.Conversation[0].ConversationID = ConversationID;

        if (RecieverID !== "") {
          await _Users.default.findById(RecieverID, (Error, User) => {
            User.Conversations.push(ConversationID);
            User.save();
          });
          Socket.emit(RecieverID, Conversation.Conversation[0]);
        }

        Socket.emit(EmitterID, Conversation.Conversation[0]);
      });
    }
  });
};

const MessagesReaded = async (Data, ConversationResponse) => {
  await _Conversation.default.findById(Data.body.ConversationID, (Error, Conversation) => {
    if (!Error) {
      if (Conversation !== null && Conversation.Conversation[Conversation.Conversation.length - 1].UserID !== Data.body.UserID) {
        for (let x = Conversation.Conversation.length - 1; x >= 0; x--) {
          if (Conversation.Conversation[x].Readed === false) {
            Conversation.Conversation[x].Readed = true;
          } else {
            break;
          }
        }

        Conversation.save();
        ConversationResponse.send("Done");
      }
    } else {
      ConversationResponse.send("Error: ".concat(Error.message));
    }
  });
};

var _default = {
  SearchConversations,
  Recieve,
  NewMessage,
  MessagesReaded
};
exports.default = _default;
//# sourceMappingURL=Conversation.js.map