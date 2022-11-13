export default function Svc(socket, io) {
    return Object.freeze({
        imageToServer(data) {
            // 모델로 쏘고

            // 결과 받아서

            socket.emit('receiveResult', data)
            // return data
            // return new Promise((resolve, reject) => {
            //     // console.log(data)
            //     resolve(data)
            // })
        },
        echoBack({ evt, data }) {
            socket.emit(evt, data)
            return { evt, data }
        },
    })
}
