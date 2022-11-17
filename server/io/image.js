require('events').EventEmitter.defaultMaxListeners = 20;

export default function Svc(socket, io) {
    return Object.freeze({
        imageToServer(data) {
            // 모델로 쏘고
            // 결과 받아서
            const { spawn } = require('node:child_process');
            const child = spawn('python', ['python/a.py']);

            child.stdin.setEncoding('utf-8');
            child.stdout.pipe(process.stdout);

            child.stdin.write(data);

            child.stdin.end();

            child.stdout.on('data', result => {
                socket.emit('receiveResult', result.toString())
            });

            child.stderr.on('data', function (result) {
                console.log('error');
            });

            // child.on('close', (code) => {
            //     console.log(`child process exited with code ${code}`)
            // })

            // socket.emit('receiveImg', data)
        },
        echoBack({ evt, data }) {
            socket.emit(evt, data)
            return { evt, data }
        },
    })
}
