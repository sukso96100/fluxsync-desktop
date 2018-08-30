exports.handleSms = (socket, data) => {
    const os = require('os');
    const { Notification, BrowserWindow } = require('electron');

    console.log(data);
    console.log(typeof data);
    let json = JSON.parse(data);

    let mobileNoti = new Notification({
        title: json.name,
        body: json.body
      });
      mobileNoti.show();
};