<!-- Please remove this file from your project -->
<template>
  <div id="app" class="web-camera-container">
    <div class="web-camera">
      <div class="camera-button">
        <button
          type="button"
          class="button is-rounded"
          :class="{ 'is-primary': !isCameraOpen, 'is-danger': isCameraOpen }"
          @click="toggleCamera"
        >
          <span v-if="!isCameraOpen">Open Camera</span>
          <span v-else>Close Camera</span>
        </button>
      </div>

      <div v-show="isCameraOpen && isLoading" class="camera-loading">
        <ul class="loader-circle">
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>

      <div v-if="isCameraOpen" v-show="!isLoading" class="camera-box">
        <video
          id="myvideo"
          ref="camera"
          :width="256"
          :height="187"
          autoplay
        ></video>
      </div>

      <div v-if="isCameraOpen && !isLoading" class="camera-shoot">
        <button type="button" class="button" @click="captureImage">
          <img
            src="https://img.icons8.com/material-outlined/50/000000/camera--v2.png"
          />
        </button>
      </div>

      <!-- <div v-if="isCameraOpen">
        <img
          id="my-screenshot"
          class="camera-box"
          style="width: 256px; height: 187px"
        />
      </div> -->
    </div>
    <div class="result-view">
      <div class="danger-range">
        <div class="danger-number">
          <p
            :class="{
              'danger-number-black': dangerNumberClass == 'black',
              'danger-number-orangered': dangerNumberClass == 'orangered',
              'danger-number-red': dangerNumberClass == 'red',
            }"
          >
            {{ dangerNumber }}
          </p>
          <!-- <p>29</p> -->
        </div>
        <div class="danger-graph">
          <b-progress
            style="width: 100%"
            :value="dangerNumber"
            :variant="variant"
            class="mb-3"
          ></b-progress>
        </div>
      </div>
      <div class="object-detect">
        <transition-group class="object-detect" name="list">
          <b-card
            v-for="object in objectList"
            :key="object.class"
            class="object-detect-card"
            :border-variant="object.header"
            :header="object.header"
            :header-bg-variant="object.header"
            header-text-variant="white"
            align="center"
          >
            <b-card-text>{{ object.class }}</b-card-text>
          </b-card>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script>
import captureVideoFrame from 'capture-video-frame'

export default {
  name: 'NuxtTutorial',
  data() {
    return {
      cnt: 0,

      audio: null,
      audioPlayTime: 0,
      frameRate: 1, // 전송할 프레임
      isCameraOpen: false,
      isCaptureStart: false,
      isLoading: false,
      link: '#',
      interverId: '',
      frame: '',
      sendResult: '',
      receiveImg: '',
      dangerNumber: 0,
      detectObject: [],
      detectObjectTimeout: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      objectList: [],
      allObject: [
        { header: 'warning', class: '노인보호', classNum: 0 },
        { header: 'danger', class: '빨간신호등', classNum: 1 },
        { header: 'danger', class: '30km제한구역', classNum: 2 },
        { header: 'warning', class: '유턴금지', classNum: 3 },
      ],
    }
  },

  computed: {
    dangerNumberClass() {
      if (this.dangerNumber < 50) return 'black'
      if (this.dangerNumber < 80) return 'orangered'
      return 'red'
    },
    variant() {
      if (this.dangerNumber < 50) return 'success'
      if (this.dangerNumber < 80) return 'warning'
      return 'danger'
    },
  },

  watch: {
    detectObject: function (val) {
      val = JSON.parse(val)
      if (val.length > 0) {
        // 이미 인식된 중복 요소 제거
        val = val.filter((x) => this.detectObjectTimeout[x.classNum] == 0)

        // 현재 인식한 객체 5초간 재인식 금지
        for (const i of val) {
          this.detectObjectTimeout[i.classNum] = 5 * this.frameRate
        }

        // val을 class가 담긴 객체로 변환
        val = this.allObject.filter((x) => {
          for (const i of val) {
            if (x.classNum == i.classNum) return true
          }
          return false
        })

        // 만약 인식목록에 지금 새로 인식한 object가 있다면, 제거
        this.objectList = this.objectList.filter((x) => {
          for (const i of val) {
            if (x.classNum == i.classNum) return false
          }
          return true
        })

        // 현재 새로 탐지한 val을 화면에 보여줄 objectList에 추가
        this.objectList.splice(3 - val.length, val.length)
        this.objectList.splice(0, 0, ...val.slice(0, 3))

        // 새로 인식된 객체들 음성으로 정보 출력
        for (const i of val.slice(0, 3)) {
          if (i.header == 'danger' && !this.audio) {
            if (i.class == '빨간신호등') {
              this.audio = new Audio(require('../static/sounds/test.mp3'))
              this.audio.play()
              this.audio.addEventListener('ended', () => (this.audio = null))
            } else {
              this.audio = new Audio(require('../static/sounds/test2.mp3'))
              this.audio.play()
              this.audio.addEventListener('ended', () => (this.audio = null))
            }
          }
        }
      }
    },
    audio: function (val) {
      console.log(val)
    },
  },

  mounted() {
    this.socket = this.$nuxtSocket({
      channel: '/image',
      reconnection: false,
    })
  },

  methods: {
    async toggleCamera() {
      // const res = await this.$axios.get(`/api/image`)
      // this.$store.commit('SET_MESSAGE', 'blabla')
      // // this.$store.dispatch('FORMAT_MESSAGE', 'blabla')

      // console.log(this.$store.state.chatMessages) // -> 1
      if (this.isCameraOpen) {
        this.isCameraOpen = false
        this.isCaptureStart = false
        this.stopCameraStream()
      } else {
        this.isCameraOpen = true
        this.createCameraElement()
      }
    },

    createCameraElement() {
      this.isLoading = true

      const constraints = (window.constraints = {
        audio: false,
        video: true,
      })

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          this.isLoading = false
          this.$refs.camera.srcObject = stream
        })
        .catch((error) => {
          this.isLoading = false
          alert("May the browser didn't support or there is some errors.")
        })
    },

    stopCameraStream() {
      let tracks = this.$refs.camera.srcObject.getTracks()

      tracks.forEach((track) => {
        track.stop()
      })
    },

    captureImage() {
      if (this.isCaptureStart == false) {
        console.log('setInterval start')
        const setInterval = window.setInterval
        this.interverId = setInterval(this.sendImage, 1000 / this.frameRate)
      } else {
        clearInterval(this.interverId)
      }
      this.isCaptureStart = !this.isCaptureStart
    },

    async sendImage() {
      console.log(this.cnt++)
      const frame = captureVideoFrame('myvideo', 'png')
      // const img = document.getElementById('my-screenshot')
      // img.setAttribute('src', frame.dataUri)
      this.frame = frame.dataUri.split(',')[1]
      this.imageToServer()

      for (const i in this.detectObjectTimeout) {
        if (this.detectObjectTimeout[i] > 0) this.detectObjectTimeout[i] -= 1
      }
    },

    imageToServer() {
      this.socket.emit('imageToServer')
    },
  },
}
</script>

<style>
body {
  display: flex;
  justify-content: center;
}

.web-camera-container {
  margin-top: 2rem;
  margin-bottom: 2rem;
  padding: 2rem;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 95vw;
  height: 90vh;
}

.web-camera-container .web-camera {
  width: 40%;
  margin-top: 2rem;
  margin-bottom: 2rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.web-camera-container .web-camera .camera-button {
  margin-bottom: 2rem;
}

.web-camera-container .web-camera .camera-box .camera-shutter {
  opacity: 0;
  width: 450px;
  height: 337.5px;
  background-color: #fff;
  position: absolute;
}
.web-camera-container .web-camera .camera-box .flash {
  opacity: 1;
}

.web-camera-container .web-camera .camera-shoot {
  margin: 1rem 0;
}
.web-camera-container .web-camera .camera-shoot button {
  height: 60px;
  width: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
}

.web-camera-container .web-camera .camera-shoot button img {
  height: 35px;
  object-fit: cover;
}

.web-camera-container .web-camera .camera-loading {
  overflow: hidden;
  height: 100%;
  position: absolute;
  width: 100%;
  min-height: 150px;
  margin: 3rem 0 0 -1.2rem;
}
.web-camera-container .web-camera .camera-loading ul {
  height: 100%;
  position: absolute;
  width: 100%;
  z-index: 999999;
  margin: 0;
}

.web-camera-container .web-camera .camera-loading .loader-circle {
  display: block;
  height: 14px;
  margin: 0 auto;
  top: 50%;
  left: 100%;
  transform: translateY(-50%);
  transform: translateX(-50%);
  position: absolute;
  width: 100%;
  padding: 0;
}
.web-camera-container .web-camera .camera-loading .loader-circle li {
  display: block;
  float: left;
  width: 10px;
  height: 10px;
  line-height: 10px;
  padding: 0;
  position: relative;
  margin: 0 0 0 4px;
  background: #999;
  animation: preload 1s infinite;
  top: -50%;
  border-radius: 100%;
}
/* .web-camera-container
  .web-camera
  .camera-loading
  .loader-circle
  li:nth-child(2) {
  animation-delay: 0.2s;
}

.web-camera-container
  .web-camera
  .camera-loading
  .loader-circle
  li:nth-child(3) {
  animation-delay: 0.4s;
} */

.web-camera-container .result-view {
  width: 50%;
  height: 100%;
  padding: 2px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.web-camera-container .result-view .danger-range {
  width: 100%;
  height: 25%;
  padding: 2px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.web-camera-container .result-view .object-detect {
  width: 100%;
  height: 70%;
  margin-top: 2rem;
  padding: 2px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.danger-number {
  width: 100%;
  height: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.danger-number p {
  font-size: 40px;
  font-weight: bold;
}

.danger-number-black {
  color: black;
}

.danger-number-orangered {
  color: orange;
}

.danger-number-red {
  color: red;
  font-size: 50px !important;
}

.danger-graph {
  display: flex;
  height: 50%;
  width: 100%;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  align-content: center;
}

.object-detect-card {
  margin: 5px;
  width: 100%;
  transition: all 0.5s;
  display: inline-block;
}

.list-enter
/* .list-complete-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(-30px);
}
.list-leave-active {
  position: absolute;
  display: none;
}

@keyframes preload {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
  100% {
    opacity: 1;
  }
}
</style>
