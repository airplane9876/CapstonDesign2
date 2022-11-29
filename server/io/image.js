require('events').EventEmitter.defaultMaxListeners = 20;

export default function Svc(socket, io) {
    return Object.freeze({
        imageToServer(data) {
            // 모델로 쏘고
            // 결과 받아서
            const { spawn } = require('node:child_process');
            const danger = spawn('python', ['python/a.py']);
            danger.stdin.setEncoding('utf-8');
            danger.stdout.pipe(process.stdout);
            danger.stdin.write(data);
            danger.stdin.end();

            danger.stdout.on('data', result => {
                socket.emit('dangerNumber', result.toString())
            });

            danger.stderr.on('data', function (result) {
                console.log('error');
            });

            const objectDetect = spawn('python', ['python/b.py']);
            objectDetect.stdin.setEncoding('utf-8');
            objectDetect.stdout.pipe(process.stdout);
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
