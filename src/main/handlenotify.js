exports.handleNotify = (socket, data) => {
    const os = require('os');
    const { Notification, BrowserWindow } = require('electron');

    console.log(data);
    console.log(typeof data);
    let json = JSON.parse(data);
    let title = json.title;
    let content = json.content; //json 파싱으로 title과 content 추출
    let actions = [];

    let Iconv = require('iconv').Iconv;
    let iconv = new Iconv('UTF-8', 'CP949//translit//ignore'); //한글 인코딩

    let ctitle = iconv.convert(title);
    console.log(ctitle);
    console.log(title);

    let mcontent = iconv.convert(content);
    console.log(mcontent);
    console.log(content);

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
            message: content
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
}
