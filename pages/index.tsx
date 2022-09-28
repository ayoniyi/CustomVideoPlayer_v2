import { useRef, useEffect, useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
//import Image from 'next/image'
//import styles from '../styles/Home.module.css'


const Home: NextPage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const videoContainer: any = useRef()
  const video: any = useRef()
  const volumeSlider: any = useRef()
  const totalTime: any = useRef()
  const currentTime: any = useRef()
  const timelineContainer: any = useRef()
  const speedBtn: any = useRef()
  const previewImg: any = useRef()
  const thumbnailImg: any = useRef()
  //const timelineContainer = document.querySelector(".timeline-container") as HTMLElement | null

  //functions
  //1. Play/pause
  const handlePlay = () => {
    videoContainer.current.classList.remove("paused")
  }
  const handlePause = () => {
    videoContainer.current.classList.add("paused")
  }
  const handlePlayPause = () => {
    // togglePlay()
    video.current.paused ? video.current.play() : video.current.pause()
  }

  //2. Volume
  const handleMute = () => {
    video.current.muted = !video.current.muted
  }
  const handleVolumeSlider = (e: any) => {
    video.current.volume = e.target.value
    video.current.muted = e.target.value === 0
  }
  const handleVolumeChange = () => {
    volumeSlider.current.value = video.current.volume
    let volumeLevel
    if (video.current.muted || video.current.volume === 0) {
      volumeSlider.current.value = 0
      volumeLevel = "muted"
    } else if (video.current.volume >= 0.5) {
      volumeLevel = "high"
    } else {
      volumeLevel = "low"
    }
    videoContainer.current.dataset.volumeLevel = volumeLevel
  }

  //3. Duration
  const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
    minimumIntegerDigits: 2,
  })
  const handleVideoDuration = () => {
    totalTime.current.textContent = formatDuration(video.current.duration)
  }
  const formatDuration = (time: any) => {
    const seconds = Math.floor(time % 60)
    const minutes = Math.floor(time / 60) % 60
    const hours = Math.floor(time / 3600)
    if (hours === 0) {
      return `${minutes}:${leadingZeroFormatter.format(seconds)}`
    } else {
      return `${hours}:${leadingZeroFormatter.format(
        minutes
      )}:${leadingZeroFormatter.format(seconds)}`
    }
  }
  const handleTimeUpdate = () => {
    currentTime.current.textContent = formatDuration(video.current.currentTime)
    const percent = video.current.currentTime / video.current.duration
    timelineContainer.current.style.setProperty("--progress-position", percent)
  }

  //4. Playback Speed
  const handlePlayBackSpeed = () => {
    let newPlaybackRate = video.current.playbackRate + 0.25
    if (newPlaybackRate > 2) newPlaybackRate = 0.25
    video.current.playbackRate = newPlaybackRate
    speedBtn.current.textContent = `${newPlaybackRate}x`
  }

  //5. View Modes

  // const toggleTheaterMode = () => {
  //   videoContainer.current.classList.toggle("theater")
  // }
  const toggleFullScreenMode = () => {
    if (document.fullscreenElement == null) {

      videoContainer.current.requestFullscreen() // @ts-ignore 
    } else {
      document.exitFullscreen()
    }
  }
  const toggleMiniPlayerMode = () => {
    if (videoContainer.current.classList.contains("mini-player")) {
      document.exitPictureInPicture()
    } else {
      video.current.requestPictureInPicture()
    }
  }

  //6. Timeline

  const handleTimelineUpdate = (e: any) => {
    const rect = timelineContainer.current.getBoundingClientRect()
    const percent: any = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width
    // const previewImgNumber = Math.max(
    //   1,
    //   Math.floor((percent * video.current.duration) / 10)
    // )
    // const previewImgSrc = `previewImgs/preview${previewImgNumber}.jpg`
    // previewImg.current.src = previewImgSrc
    timelineContainer.current.style.setProperty("--preview-position", percent)

    if (isScrubbing) {
      e.preventDefault()
      //thumbnailImg.current.src = previewImgSrc
      timelineContainer.current.style.setProperty("--progress-position", percent)
    }

  }
  let isScrubbing = false
  let wasPaused: any


  const toggleScrubbing = (e: any) => {
    const rect = timelineContainer.current.getBoundingClientRect()
    const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width
    isScrubbing = (e.buttons & 1) === 1
    if (videoContainer !== null) {
      videoContainer.current.classList.toggle("scrubbing", isScrubbing)
      if (video !== null) {
        if (isScrubbing) {
          wasPaused = video.current.paused
          video.current.pause()
        } else {
          video.current.currentTime = percent * video.current.duration
          if (!wasPaused) video.current.play()
        }
      }
    }

    handleTimelineUpdate(e)
  }
  const skip = (duration: any) => {
    video.current.currentTime += duration
  }


  // keyboard events
  useEffect(() => {
    setIsLoading(false)
    if (!isLoading) {
      document.addEventListener("keydown", e => {
        if (document.activeElement !== null) {
          const tagName: any = document.activeElement.tagName.toLowerCase()
          if (tagName === "input") return

          switch (e.key.toLowerCase()) {
            case " ":
              if (tagName === "button") return
            case "k":
              handlePlayPause()
              break
            // video can be played or paused using the spacebar or letter k
            case "m":
              handleMute()
              break
            // mute can be toggled using "m" on keyboard
            case "arrowleft":
            case "j":
              skip(-4)
              break
            case "arrowright":
            case "l":
              skip(4)
              break
            // fast forward or reverse by 4 seconds using arrow left or right
          }
        }
      })
    }
  }, [isLoading])


  // 
  useEffect(() => {
    //setIsLoading(false)
    document.addEventListener("fullscreenchange", () => {
      videoContainer.current.classList.toggle("full-screen", document.fullscreenElement)
    })
    video.current.addEventListener("enterpictureinpicture", () => {
      videoContainer.current.classList.add("mini-player")
    })
    video.current.addEventListener("leavepictureinpicture", () => {
      videoContainer.current.classList.remove("mini-player")
    })

    const handleVideoDuration = () => {
      totalTime.current.textContent = formatDuration(video.current.duration)
    }
    handleVideoDuration()

    timelineContainer.current.addEventListener("mousemove", handleTimelineUpdate)
    timelineContainer.current.addEventListener("mousedown", toggleScrubbing)
    document.addEventListener("mouseup", e => {
      if (isScrubbing) toggleScrubbing(e)
    })
    document.addEventListener("mousemove", e => {
      if (isScrubbing) handleTimelineUpdate(e)
    })

  }, [])




  return (
    <div >
      <Head>
        <title>Video Player</title>
        <meta name="description" content="Slide video player" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <main >
        <div className="video-container paused"
          data-volume-level="high" ref={videoContainer}>
          <img className="thumbnail-img" alt="thumbnail" ref={thumbnailImg} />
          <div className="video-controls-container">
            <div className="timeline-container"
              ref={timelineContainer}
            // onMouseMove={handleTimelineUpdate}
            // onMouseDown={toggleScrubbing}
            >
              <div className="timeline">
                {/* <img className="preview-img" alt="preview" ref={previewImg} /> */}
                <div className="thumb-indicator"></div>
              </div>
            </div>
            <div className="controls">
              <button className="play-pause-btn" onClick={handlePlayPause}>
                <svg className="play-icon" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
                </svg>
                <svg className="pause-icon" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M14,19H18V5H14M6,19H10V5H6V19Z" />
                </svg>
              </button>
              <div className="volume-container">
                <button className="mute-btn"
                  onClick={handleMute}
                >
                  <svg className="volume-high-icon" viewBox="0 0 24 24">
                    <path fill="currentColor"
                      d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z" />
                  </svg>
                  <svg className="volume-low-icon" viewBox="0 0 24 24">
                    <path fill="currentColor"
                      d="M5,9V15H9L14,20V4L9,9M18.5,12C18.5,10.23 17.5,8.71 16,7.97V16C17.5,15.29 18.5,13.76 18.5,12Z" />
                  </svg>
                  <svg className="volume-muted-icon" viewBox="0 0 24 24">
                    <path fill="currentColor"
                      d="M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z" />
                  </svg>
                </button>
                <input
                  className="volume-slider"
                  type="range"
                  min="0"
                  max="1"
                  step="any"
                  value="1"
                  ref={volumeSlider}
                  onInput={handleVolumeSlider}
                />
              </div>
              <div className="duration-container">
                <div className="current-time" ref={currentTime}>0:00</div>
                /
                <div className="total-time" ref={totalTime}></div>
              </div>

              <button className="speed-btn wide-btn" ref={speedBtn}
                onClick={handlePlayBackSpeed}
              >
                1x
              </button>
              <button className="mini-player-btn"
                onClick={toggleMiniPlayerMode}
              >
                <svg viewBox="0 0 24 24">
                  <path fill="currentColor"
                    d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zm-10-7h9v6h-9z" />
                </svg>
              </button>
              {/* <button className="theater-btn"
                onClick={toggleTheaterMode}
              >
                <svg className="tall" viewBox="0 0 24 24">
                  <path fill="currentColor"
                    d="M19 6H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 10H5V8h14v8z" />
                </svg>
                <svg className="wide" viewBox="0 0 24 24" >
                  <path fill="currentColor"
                    d="M19 7H5c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm0 8H5V9h14v6z" />
                </svg>
              </button> */}
              <button className="full-screen-btn"
                onClick={toggleFullScreenMode}
              >
                <svg className="open" viewBox="0 0 24 24">
                  <path fill="currentColor"
                    d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                </svg>
                <svg className="close" viewBox="0 0 24 24">
                  <path fill="currentColor"
                    d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
                </svg>
              </button>
            </div>
          </div>

          <video src='/slideVideo.mp4'
            ref={video}
            onPlay={handlePlay}
            onPause={handlePause}
            onClick={handlePlayPause}
            onVolumeChange={handleVolumeChange}
            onLoadedData={handleVideoDuration}
            onTimeUpdate={handleTimeUpdate}
          >
          </video>
        </div>
      </main>

      {/* <VideoScript /> */}
    </div>

  )
}

export default Home
