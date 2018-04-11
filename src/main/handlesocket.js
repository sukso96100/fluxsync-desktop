const { Notification } = require('electron');

exports.handleSocket = function(socket){



  socket.on('notify', (data)=>{
    console.log(data);
    console.log(typeof data);
     let json = JSON.parse(data);
     let title = json.title;
     let content = json.content; //json 파싱으로 title과 content 추출

     let mobileNoti = new Notification({
       title: title,
       body: content
     });

     mobileNoti.show();
     // notifier.notify({
     //   title : title,
     //   message : content
     // })  //추출한 title과 content를 notify의 인자로 넘김
  })
}
