# salsita-dancing-santa

```
# npm install
# npm start
```

Server runs by default on port 8080 or set the `PORT` variable before starting the server.

# FAQ

**How do you make Santa dance to the music?**

Glad you asked! We rerender the scene using `requestAnimationFrame`. The [Web Audio API](https://webaudio.github.io/web-audio-api/) is used to analyze the frequencies of the music at that particular instant. We then use specific hand-crafted offsets and thresholds in the audio data to move and rotate the animated elements (left mustache, right mustache and arm).

Check out the [code](src/js/app.js) for more details.
