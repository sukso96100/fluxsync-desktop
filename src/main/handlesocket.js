const { Notification,BrowserWindow } = require('electron');
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

    let Iconv = require('iconv').Iconv;
    let iconv = new Iconv('UTF-8', 'EUC-KR//translit//ignore');
    
    let ctitle = iconv.convert(title);
    console.log(ctitle);
    console.log(title);
    let mcontent = iconv.convert(content);
    console.log(mcontent); //
    console.log(content);

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
          mobileNoti.on('action', (event, index)=>{
            console.log(`Action index: ${index}`)
            socket.emit('notify', {"noti_id":json.noti_id, "index":index});
          })
          mobileNoti.show();
          break;

        case 'win32':
          // Windows


        const notifier = require('node-notifier');
        notifier.notify({
          title: ctitle,
          message: mcontent,
          // actions: actions,
          wait: true
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
