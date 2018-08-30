const { Notification, BrowserWindow } = require('electron');
const os = require('os');

exports.handleSocket = function(socket){

  socket.on('notify', (data)=>{
    console.log(data);
    console.log(typeof data);
    let json = JSON.parse(data);
    let title = json.title;
    let content = json.content; //json 파싱으로 title과 content 추출
    let actions = [];

    if(json.actions == undefined){
      let mobileNoti = new Notification({
        title: title,
        body: content
      });
      mobileNoti.show();
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
          let mobileNoti = new Notification({
            title: title,
            body: content,
            actions: actions
          });
          mobileNoti.show();
          mobileNoti.on('action', (event, index)=>{
            console.log(`Action index: ${index}`)
            socket.emit('notify', {"noti_id":json.noti_id, "index":index});
          })
          
          break;

        case 'win32':
          // Windows
        const notifier = require('node-notifier');
        notifier.notify({
          title: title,
          message: content,
          actions: actions,
          wait: true
        });

        let win = new BrowserWindow({
          show: false,
          opacity: 0.5,
          fullscreen: true})
        notifier.on('click', function(notifieObject, options){
          win.show()
          win.loadURL(url.format({
            pathname: path.join(__dirname, '../res/layout/notification.html'),
            protocol: 'file:',
            slashes: true
          }));
        });

          break;

        case 'linux':
          // Linux Desktop
          break;

      }
    }


     // notifier.notify({
     //   title : title,
     //   message : content
     // })  //추출한 title과 content를 notify의 인자로 넘김
  })
}
