// Load bluetooth-serial-port module
const BlueToothSerial = require('bluetooth-serial-port');
const btSerial = new BlueToothSerial.BluetoothSerialPort();
let isScanning = false;
// Electron IPC Main Module
const {ipcMain} = require('electron');

// When user requests to find new bluetooth device
ipcMain.on('bluetooth.find', (event, arg) => {
	if(!isScanning){
		console.log(`bluetooth.find : ${arg}`);
		// Register device found event
		isScanning = true;
	  btSerial.on('found', (address, name) => {
			console.log(`${address} : ${name}`);
			event.sender.send('bluetooth.found', JSON.stringify({"name":name, "address":address}));

		});
		// Start finding device
		btSerial.inquire();
		event.sender.send('bluetooth.find', 'Looking for devices...');
		btSerial.on('finished', ()=>{
			event.sender.send('bluetooth.done', 'done');
		});
	}else {
		console.log(`bluetooth.find : Already Scanning!`);
	}

});

// When user requested to connect
ipcMain.on('bluetooth.connect', (event, arg) =>{
	btSerial.findSerialPortChannel(arg, (channel) => {
		btSerial.connect(arg, channel, () => {
			console.log(`bluetooth.connect : connected with ${arg} ${channel}`);
			event.sender.send('bluetooth.connected', arg)
			btSerial.write(new Buffer('my data', 'utf-8'), (err, bytesWritten) => {
				if (err) console.log(err);
			});

			btSerial.on('data', (buffer) => {
				console.log(buffer.toString('utf-8'));
			});
		}, () => {
			console.log('bluetooth.connect : cannot connect');
		});
	}, () => {
		// No Device Found!
		console.log('No Device Found!');
	});

});

ipcMain.on('bluetooth.close', (event, arg) => {
	btSerial.close();
});
