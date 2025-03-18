# CustomVideoPlayer

A full-featured, customizable video player built with React and Next.js. This project provides a modern, responsive video player with an intuitive user interface and extensive keyboard controls.

## Features

- **Playback Controls**: Play/pause, volume adjustment, muting
- **Time Display**: Current time and total duration
- **Timeline Scrubbing**: Click and drag to navigate through the video
- **Playback Speed**: Adjustable playback speed (0.25x - 2x)
- **Viewing Modes**:
  - Picture-in-Picture mode
  - Fullscreen mode
- **Keyboard Controls**:
  - Spacebar or "K": Play/pause
  - "M": Mute/unmute
  - Left Arrow or "J": Rewind 4 seconds
  - Right Arrow or "L": Fast forward 4 seconds
- **Responsive Design**: Adapts to different screen sizes with mobile support
- **Custom UI**: Modern, clean interface with hover effects

## Technologies Used

- **Next.js**: React framework for production
- **React**: UI component library
- **TypeScript**: Type-safe JavaScript
- **CSS**: Custom styling with responsive design

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/CustomVideoPlayer_v2.git
   cd CustomVideoPlayer_v2
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Usage

The player loads with a default video (`slideVideo.mp4`). To use your own video:

1. Add your video file to the `public` directory
2. Update the video source in `pages/index.tsx`:

```tsx
<video
  src="/your-video-file.mp4"
  ref={video}
  onPlay={handlePlay}
  onPause={handlePause}
  onClick={handlePlayPause}
  onVolumeChange={handleVolumeChange}
  onLoadedData={handleVideoDuration}
  onTimeUpdate={handleTimeUpdate}
></video>
```

## Customization

You can customize the appearance of the video player by modifying the CSS in:

- `styles/home.css`: Contains specific styling for the video player
- `styles/globals.css`: Contains global styles

## Project Structure

- `pages/index.tsx`: Main component with video player implementation
- `styles/home.css`: Video player-specific styles
- `public/`: Contains video assets

## Browser Compatibility

The video player is compatible with modern browsers and uses standard HTML5 video APIs. For the best experience, use the latest versions of Chrome, Firefox, Safari, or Edge.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
