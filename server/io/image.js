require('events').EventEmitter.defaultMaxListeners = 20;

const { spawn } = require('node:child_process');

const images = []

export default function Svc(socket, io) {
    return Object.freeze({
        imageToServer(data) {
            // 모델로 쏘고
            // 결과 받아서
            // console.log(data.slice(10, 20))

            images.push(data)
            if (images.length > 30) images.shift()
            if (images.length < 30) return;

            const danger = spawn('python', ["-u", 'python/capdi.py']);

            danger.stdin.setEncoding('utf-8');
            danger.stdout.pipe(process.stdout);

            danger.stdin.write(images.toString());
            danger.stdin.end();

            danger.stdout.on('data', result => {
                socket.emit('dangerNumber', result.toString())
            });
            danger.stderr.on('data', function (result) {
                console.log(result.toString());
            });


            // const objectDetect = spawn('python', ['python/b.py']);
            // objectDetect.stdin.setEncoding('utf-8');
            // objectDetect.stdout.pipe(process.stdout);
            // objectDetect.stdin.write(data);
            // objectDetect.stdin.end();

            // objectDetect.stdout.on('data', result => {
            //     socket.emit('detectObject', result.toString())
            // });

        },
        echoBack({ evt, data }) {
            socket.emit(evt, data)
            return { evt, data }
        },
    })
}
