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

                // 이미지 검출 테스트용 코드
                const detectObject = [];
                if (Number(result.toString()) >= 50 && Number(result.toString()) <= 60) {
                    detectObject.push({ header: 'warning', class: '어린이보호', classNum: 3 })
                }
                if (Number(result.toString()) >= 55 && Number(result.toString()) <= 65) {
                    detectObject.push({ header: 'danger', class: 'Red Light', classNum: 2 })
                }
                if (Number(result.toString()) >= 20 && Number(result.toString()) <= 30) {
                    detectObject.push({ header: 'danger', class: '유턴 금지', classNum: 1 })
                }
                if (Number(result.toString()) >= 20 && Number(result.toString()) <= 30) {
                    detectObject.push({ header: 'warning', class: 'Yello Light', classNum: 0 })
                }
                socket.emit('detectObject', detectObject)
            });

            danger.stderr.on('data', function (result) {
                console.log('error');
            });

        },
        echoBack({ evt, data }) {
            socket.emit(evt, data)
            return { evt, data }
        },
    })
}
