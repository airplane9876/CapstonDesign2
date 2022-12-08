require('events').EventEmitter.defaultMaxListeners = 20;

const { spawn } = require('node:child_process');

const danger = spawn('python', ["-u", 'python/capdi.py']);
danger.stdin.setEncoding('utf-8');
// danger.stdout.pipe(process.stdout);

<<<<<<< HEAD
// const objectDetect = spawn('python', ['python/b.py']);
const objectDetect = spawn('python', ['Yolov5-master/detect.py']);
=======

const objectDetect = spawn('python', ['python/b.py']);
>>>>>>> origin/master
objectDetect.stdin.setEncoding('utf-8');
objectDetect.stdout.pipe(process.stdout);

export default function Svc(socket, io) {

    danger.stdout.on('data', result => {
        for (const i of result.toString().split('\r')) {
            if (Number(i) > 0) {
<<<<<<< HEAD
                socket.emit('dangerNumber', Number(i))
=======
                socket.emit('dangerNumber', Number(i) * 100)
>>>>>>> origin/master
            }
        }
    });
    danger.stderr.on('data', function (result) {
        console.log(result.toString());
    });

    objectDetect.stdout.on('data', result => {
        socket.emit('detectObject', result.toString())
    });
    return Object.freeze({
        imageToServer(data) {
            danger.stdin.write(`${data}\n`);
        },
        imageToDetectObject(data) {
<<<<<<< HEAD
=======
            console.log('here?')
>>>>>>> origin/master
            objectDetect.stdin.write(`${data}\n`);
        },
        echoBack({ evt, data }) {
            socket.emit(evt, data)
            return { evt, data }
        },
    })
}
