# faviconfuckery
Simple tool which displays videos in the Minecraft server list using the favicon and description.

This does not produce audio.

## Demos
https://i.antonio32a.com/CPmNBw.mp4
https://i.antonio32a.com/OIYDrW.mp4
https://i.antonio32a.com/9KRlNG.mp4

## Requirements
- ffmpeg
- node 14

## Usage
- clone this repository and cd into it
- run `npm i`
- create a directory called `input` with a second directory called `images` in it
- download a video from youtube which has subtitles and download captions for it using [savesubs.com](https://savesubs.com), captions must be in JSON format
- move the video to the `input` directory, rename it to `in.mp4`, move the captions as well and name them `in.json`
- run `npm start`
- wait for the server to start, you will see a `Ready!` in the console
- add `localhost` to your Minecraft servers (use version 1.8.9) and spam the refresh button (using an autoclicker is recommended)
