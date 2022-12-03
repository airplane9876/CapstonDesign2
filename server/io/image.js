require('events').EventEmitter.defaultMaxListeners = 20;

const { spawn } = require('node:child_process');

const danger = spawn('python', ["-u", 'python/capdi.py']);
danger.stdin.setEncoding('utf-8');
// danger.stdout.pipe(process.stdout);


export default function Svc(socket, io) {
    danger.stdout.on('data', result => {
        for (const i of result.toString().split('\r')) {
            // console.log(Number(i))
            if (Number(i) > 0) {
                // console.log(Number(i))
                socket.emit('dangerNumber', Number(i) * 100)
            }
        }
    });
    danger.stderr.on('data', function (result) {
        console.log(result.toString());
    });
    return Object.freeze({
        imageToServer(data) {
            // 모델로 쏘고
            // 결과 받아서
            // console.log(data.slice(10, 20))

            danger.stdin.write(`${data}\n`);
        },
        imageToDetectObject(data) {
            const objectDetect = spawn('python', ['python/b.py']);
            objectDetect.stdin.setEncoding('utf-8');
            // objectDetect.stdout.pipe(process.stdout);
            objectDetect.stdin.write(data);
            objectDetect.stdin.end();

            objectDetect.stdout.on('data', result => {
                socket.emit('detectObject', result.toString())
            });
        },
        echoBack({ evt, data }) {
            socket.emit(evt, data)
            return { evt, data }
        },
    })
}
