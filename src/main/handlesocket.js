const notifier = require('node-notifier');

exports.handleSocket = function(socket){
  socket.on('notify', (data)=>{
    notifier.notify(data);
  })
}
