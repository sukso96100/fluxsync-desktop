const notifyHandler = require('./handlenotify');
const smshandler = require('./handlesms');

exports.handleSocket = function(socket){

  socket.on('notify', (data)=>{
    notifyHandler.handleNotify(socket, data);
  });

  socket.on('sms', (data)=>{
    smshandler.handleSms(socket, data);
  });
}
