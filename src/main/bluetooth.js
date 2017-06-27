
// Create new Bluetooth Serial Port Object
const BlueToothSerial = require('bluetooth-serial-port');
const btSerial = new BlueToothSerial.BluetoothSerialPort();
const serviceUUID = "";
let isScanning = false;
// Electron IPC Main Module
const {ipcMain} = require('electron');

// When user requests to find new bluetooth device
ipcMain.on('bluetooth.find', (event, arg) => {
	if(!isScanning){
		console.log(`bluetooth.find : ${arg}`);
		// Register device found event
	  btSerial.on('found', (address, name) => {
			console.log(`${address} : ${name}`);
			event.sender.send('bluetooth.found', `${address}\n${name}`);
			// btSerial.findSerialPortChannel(address, (channel) => {
			// 	if(channel == serviceUUID){
			// 		// Let user know device info
			// 		console.log('Found a device');
			// 		event.sender.send('bluetooth.find.callback',
			// 			JSON.stringify(`{"address":${address}, "name":${name}}`));
			// 	}else{
			// 		console.log('Device Found. but not service UUID match.');
			// 	}
			// }, () => {
			// 	// No Device Found!
			// 	console.log('No Device Found!');
			// });

		});
		btSerial.on('finished', ()=>{
			event.sender.send('bluetooth.done', 'done');
		});
		// Start finding device
		btSerial.inquire();
		event.sender.send('bluetooth.find', 'Looking for devices...');
	}else {
		console.log(`bluetooth.find : Already Scanning!`);
	}

});

// When user confirmed found device and requested to connect
ipcMain.on('bluetooth.connect', (event, arg) =>{
	btSerial.connect(address, channel, () => {
		console.log('bluetooth.connect : connected');

		btSerial.write(new Buffer('my data', 'utf-8'), (err, bytesWritten) => {
			if (err) console.log(err);
		});

		btSerial.on('data', (buffer) => {
			console.log(buffer.toString('utf-8'));
		});
	}, () => {
		console.log('bluetooth.connect : cannot connect');
	});
});

ipcMain.on('bluetooth.close', (event, arg) => {
	btSerial.close();
});

// btSerial.on('found', (address, name) => {
// 	btSerial.findSerialPortChannel(address, (channel) => {
// 		btSerial.connect(address, channel, () => {
// 			console.log('connected');
//
// 			btSerial.write(new Buffer('my data', 'utf-8'), (err, bytesWritten) => {
// 				if (err) console.log(err);
// 			});
//
// 			btSerial.on('data', (buffer) => {
// 				console.log(buffer.toString('utf-8'));
// 			});
// 		}, () => {
// 			console.log('cannot connect');
// 		});
//
// 		// close the connection when you're ready
//
// 	}, () => {
// 		console.log('found nothing');
// 	});
// });
