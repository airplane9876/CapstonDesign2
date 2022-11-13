<!-- Please remove this file from your project -->
<template>
  <div id="app" class="web-camera-container">
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

    <div v-if="isCameraOpen">
      <img
        id="my-screenshot"
        class="camera-box"
        style="width: 256px; height: 187px"
      />
    </div>

    <div v-if="isCameraOpen">
      <img
        id="receive-screenshot"
        class="camera-box"
        style="width: 256px; height: 187px"
      />
    </div>
    <!-- <textarea
      v-model="sendResult"
      placeholder="[chatMessages] Formatted messages will appear here"
      rows="3"
      max-rows="6"
    ></textarea> -->
  </div>
</template>

<script>
import captureVideoFrame from 'capture-video-frame'

export default {
  name: 'NuxtTutorial',
  data() {
    return {
      isCameraOpen: false,
      isCaptureStart: false,
      isLoading: false,
      link: '#',
      interverId: '',
      frame: '',
      sendResult: '',
      receiveResult: '',
    }
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
        this.interverId = setInterval(this.sendImage, 100)
      } else {
        clearInterval(this.interverId)
        console.log('here?')
      }
      this.isCaptureStart = !this.isCaptureStart
    },

    async sendImage() {
      const frame = captureVideoFrame('myvideo', 'png')
      const img = document.getElementById('my-screenshot')
      img.setAttribute('src', frame.dataUri)
      this.frame = frame.dataUri
      this.imageToServer()

      const img2 = document.getElementById('receive-screenshot')
      img2.setAttribute('src', this.receiveResult)
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
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 500px;
}

.web-camera-container .camera-button {
  margin-bottom: 2rem;
}

.web-camera-container .camera-box .camera-shutter {
  opacity: 0;
  width: 450px;
  height: 337.5px;
  background-color: #fff;
  position: absolute;
}
.web-camera-container .camera-box .flash {
  opacity: 1;
}

.web-camera-container .camera-shoot {
  margin: 1rem 0;
}
.web-camera-container .camera-shoot button {
  height: 60px;
  width: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
}

.web-camera-container .camera-shoot button img {
  height: 35px;
  object-fit: cover;
}

.web-camera-container .camera-loading {
  overflow: hidden;
  height: 100%;
  position: absolute;
  width: 100%;
  min-height: 150px;
  margin: 3rem 0 0 -1.2rem;
}
.web-camera-container .camera-loading ul {
  height: 100%;
  position: absolute;
  width: 100%;
  z-index: 999999;
  margin: 0;
}

.web-camera-container .camera-loading .loader-circle {
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
.web-camera-container .camera-loading .loader-circle li {
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
.web-camera-container .camera-loading .loader-circle li:nth-child(2) {
  animation-delay: 0.2s;
}

.web-camera-container .camera-loading .loader-circle li:nth-child(3) {
  animation-delay: 0.4s;
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
