const { Notification } = require('electron');
const os = require('os');

exports.handleSocket = function(socket){



  socket.on('notify', (data)=>{
    console.log(data);
    console.log(typeof data);
    let json = JSON.parse(data);
    let title = json.title;
    let content = json.content; //json 파싱으로 title과 content 추출
    let actions = [];
    let mobileNoti;

    if(json.actions == undefined){
      mobileNoti = new Notification({
        title: title,
        body: content
      });
    }else{
      json.actions
      .forEach((item)=>{
        console.log(item);
        actions.push({
          type: "button",
          text: item.toString()
        })
      });
      console.log(actions);
      switch(os.platform()){
        case 'darwin':
          // MacOS
          mobileNoti = new Notification({
            title: title,
            body: content,
            actions: actions
          });
          break;
        case 'win32':
          // Windows
          break;
        case 'linux':
          // Linux Desktop
          break;
          
      }
    }
    
     mobileNoti.show();
     // notifier.notify({
     //   title : title,
     //   message : content
     // })  //추출한 title과 content를 notify의 인자로 넘김
  })
}
