const { exec } = require("child_process");
const fs = require("fs").promises;
const mc = require("minecraft-protocol");
const extractFrames = require("ffmpeg-extract-frames");
const sharp = require("sharp");

const videoName = "in";
const fps = 30;

(async () => {
    let subtitles = JSON.parse(await fs.readFile("../input/" + videoName + ".json"))
        .map(i => ({ [parseInt(i.start * 1000)]: i.lines.join("\n") }));
    subtitles = Object.assign({}, ...subtitles);

    if ((await fs.readdir("../input/images")).length === 0) {
        console.log("No images found, extracting frames...");
        await extractFrames({
            input: "../input/" + videoName + ".mp4",
            output: "../input/images/%d.jpg",
            fps
        });
        console.log("Finished extracting frames.");

        console.log("Resizing images...");
        for (const image of (await fs.readdir("../input/images"))) {
            await sharp("../input/images/" + image)
                .png()
                .resize(64, 64)
                .toFile("../input/images/" + image.split(".")[0] + ".png");
            await fs.rm("../input/images/" + image); // remove the jpg one
        }
        console.log("Finished resizing images.");
    }

    console.log("Preparing images.");
    const images = [];
    const imageNames = (await fs.readdir("../input/images")).sort((a, b) =>
        parseInt(a.split(".")[0]) - parseInt(b.split(".")[0])
    );

    for (const image of imageNames)
        images.push(await fs.readFile("../input/images/" + image, "base64"));
    console.log("Finished preparing images.");

    console.log("Ready!");
    let startTime;
     mc.createServer({
        "online-mode": false,
        host: "0.0.0.0",
        port: 25565,
        version: "1.8.9",
        beforePing: result => {
            if (!startTime)
                startTime = Date.now();

            let frame = Math.floor((Date.now() - startTime) / (1000 / fps));
            if (frame >= images.length)
                frame = images.length - 1;

            const timestamp = Date.now() - startTime;
            let keys = Object.keys(subtitles).map(i => parseInt(i));
            keys.push(timestamp);
            keys.sort((a, b) => a - b);
            const subtitleIndex = keys.indexOf(timestamp) - 1;

            result.favicon = "data:image/png;base64," + images[frame];
            result.description = Object.values(subtitles)[subtitleIndex] ?? "antonio32a.com";
            result.players.online = frame;
            result.players.max = images.length - 1;

            // quick and simple autoclicker using xdotool, adjust speed depending on how long it takes to process
            // new Promise(resolve => setTimeout(resolve, 1)).then(() => exec("xdotool click --repeat 2 1"));
            return result;
        }
    });
})();
