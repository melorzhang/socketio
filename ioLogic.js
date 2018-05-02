const Cfg = require("./CFG");
// console.log(Cfg)
const checkAuth = data => {
  if (data.userName && data.psw) {
    return true;
  }
  console.log(data);
  return false;
};
const withCheckSomeTheme = (valid, cb, errCb) => {
  if (valid) {
    typeof cb === "function" && cb();
  } else {
    typeof errCb === "function" && errCb();
  }
};
const withCheckAuth = (io, data, cb) => {
  withCheckSomeTheme(
    checkAuth(data),
    () => {
      typeof cb === "function" && cb(data);
    },
    () => {
      io.emit(Cfg.EvnetConfig.err, {
        errMsg: Cfg.ErrConfig.err999,
        code: -999
      });
    }
  );
};
const userTokenGen = ({ userName, userType }) => {
  return `${userName}-${Number(new Date())}-xx${userType}xx`;
};
const getTokenHandler = data => {
  if (data.userName !== "test") {
    return userTokenGen(data);
  }
  return Cfg.devToken;
};
const checkToken = data => {
  return /xx[a-z]*xx$/.test(data.token);
};
const withCheckToken = (io, data, cb) => {
  withCheckSomeTheme(
    checkToken(data),
    () => {
      typeof cb === "function" && cb(data);
    },
    () => {
      io.emit(Cfg.EvnetConfig.err, {
        errMsg: Cfg.ErrConfig.err998,
        code: -998
      });
    }
  );
};
const genId=({userName})=>{
  return `${userName}-${Number(new Date())}`;
}
module.exports = function ioLogic(io,users) {
  io.origins((origin,cb)=>{
    if(/melor.top/.test(origin)){
      return cb(null, true);
    }
    if(/localhost/.test(origin)){
      return cb(null, true);
    }
    if(/now.sh/.test(origin)){
      return cb(null, true);
    }
    console.log(("originNotAllow:", Cfg.MsgConfig.originNotAllow));
    return cb(Cfg.MsgConfig.originNotAllow,false)
  })
  io.on("connection", function(socket) {
    console.log("a  user connected");
    socket.on("disconnect", function() {
      console.log("user disconnected");
    });
    socket.broadcast.emit(Cfg.EvnetConfig.sysMsg,Cfg.MsgConfig.newJoin);    
    socket.on(Cfg.EvnetConfig.getToken, data => {
      if (checkAuth(data)) {
        data.id = genId(data);
        users[data.id] = socket;
        socket.emit(Cfg.EvnetConfig.getToken, {
          token: getTokenHandler(data),
          userName:data.userName,
          type:data.type,
          id:data.id,
        });
      }
    });
    socket.on(Cfg.EvnetConfig.chatMsg, function(msg) {
      withCheckToken(io, msg, msg => {
        io.emit(Cfg.EvnetConfig.chatMsg, msg);
      });
    });
  });
}