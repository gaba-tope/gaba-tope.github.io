---
title: How to Make Youtube-Based Music Player in Jekyll Blog
tags: [jekyll]
categories: work
cover: /files/cover/2025-02-04-music-player.png
id: 2025-02-04-music-player
---

An embeddable music player in a Jekyll blog was created using HTML, CSS and JavaScript!
<!--more-->
This work is **largely based on the music player script of** [**estInLOV3's homepage**](https://lov3ndpeace.naru.pub/){:target='_blank'}, which is placed at the right-side fixed navigation menu.

**[Copyright infringement is a serious offense!]**<br><br> **Unauthorized use of copyrighted music may result in legal action**. Please ensure you have the necessary rights or licenses for any music used with this player. Consider using royalty-free music or obtaining permission from the copyright holder.
{:.error}

## Modifications I made

1. **Hiding the YouTube Video**
    - The original music player displayed a small YouTube video, but I modified it to be invisible, keeping only the audio controls.
2. **Adding playtime feature**
    - I added a feature to dispaly the playtime while the song is playing.
3. **Adding YouTube thumbnail**
    - I added a YouTube thumbnail of the video.
4. **Features to play music persistently even when page is changed**
    - I added JavaScript to make sure that the playing music is uninterrupted by navigation and page change.
5. **Separately saved video array**.
    - A list of video to be played is saved separately in `video_array.js`, which is then imported to main JS file `musicplayer.js`
6. **Customizing the styles**


## Implementation

### 1. HTML for the Music Player

<details>
<summary>Click to see the full HTML</summary>

{% highlight html %}
<meta charset="UTF-8">

<head>
	<link rel="stylesheet" href="/assets/css/musicplayer_audio.css"> <!--audio only-->
	<link rel="stylesheet" href="/assets/css/lightbox.css">
</head>

<body>
<div class="soundplayer">
	<figure>
		<a href="" data-lightbox="soundplayer">
			<img id="thumbnail" class="thumbnail" src="" alt="YouTube Thumbnail">
		</a>
	</figure>
	<div class="youtube"></div>
	<div class="mute" id="muteButton"></div>
	<div class="go-stop" id="playButton"></div>
	<div class="next-song"></div>
	<div class="song-container">
		<span class="song-name" id="songTitle">Click 'Next' button to play music :)</span>
	</div>
	<div class="time-display">
        <span class="current-time">0:00</span> / 
        <span class="total-time">0:00</span>
    </div>
  </div>

  <script type="module" src="/assets/scripts/musicplayer.js"></script>
  <script src="/assets/scripts/lightbox-plus-jquery.js"></script>
</body>
{% endhighlight %}
</details>

#### Step 1: Create musicplayer.html file

I created a `_includes/musicplayer.html`, which will be embedded to the Jekyll blog.

#### Step 2: Add the Meta Tag

`<meta charset> ="UTF-8"` for character encoding.

#### Step 3: Import necessary files.

In the `<head>` section of your HTML, add the required CSS and JavaScript files.

- CSS file: `/assets/css/musicplayer_audio.css` and `/assets/css/lightbox.css`. It is better to include lightbox CSS and JS file in your base page file if you use it frequently.
- JavaScript file: `/assets/scripts/musicplayer.js` and `/assets/scripts/lightbox-plus-jquery.js`. Make sure that `musicplayer.js` is loaded with `type="module"` as it imports another JavaScript file.

#### Step 4: Make `<div>` elements in `<body>` as shown in the code.

 Make sure each element correspond to each music player components. Correct class and id should be designated to be styled and used by JavaScript.

- `<figure>` is where YouTube thumbnail of the video is shown. I used lightbox scripts so that viewers can click on the thumbnail in a bigger size.
- `<div class="time-display">` is where total time and current time is shown.

### 2. CSS for the Music Player

Create `/assets/css/musicplayer_audio.css` or in appropriate directory. 

<details>
<summary>Click to see the full CSS</summary>

{% highlight css %}
/*.music-player{
  position: sticky;
  bottom: 0;
  right: 50%;
  }*/

.soundplayer {
    /*width: 84%;*/
    width: 277px; /*109px*/
    height: 50px; /*25%;*/
    background: #F1F8FF;
    /*background: url('./images/v8_365.png');*/
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
    opacity: 0.8;
    position: sticky;
    top: 10px;
    border-style: solid;
    border-color: #3282F6;
    border-radius: 10px;
    margin: auto;
    overflow: hidden;
  }
  .thumbnail {
    width: 85.4px; /* Adjust size as needed */
    height: 48px;
    border-radius: 10px; /* Optional: Rounded corners */
    object-fit: cover; /* Keeps aspect ratio without distortion */
    position: absolute;
    left: 0px; /* Adjust positioning */
    top: 50%;
    transform: translateY(-50%);
    z-index: 2;
  }
  .youtube {
    width: 1px;
    height: 1px;
    background: rgba(179, 179, 179, 1);
    opacity: 0;
    position: absolute;
    top: 0px;
    left: 0px;
    overflow: hidden;
  }
  .musiciframe {
    width: 1px;
    height: 1px;
    visibility: hidden;
  }
  .next-song {
    width: 20px;
    height: 20px;
    background: url('../images/next-song-icon.png');
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
    opacity: 1;
    position: absolute;
    top: 17px;
    left: calc(50% + 90px);
    overflow: hidden;
    z-index: 10; /* Ensure controls are above hidden video*/
  }
  .next-song:hover {
    cursor: pointer;
  }
  .go-stop {
    width: 20px;
    height: 20px;
    background: url('../images/go-stop-icon.png');
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
    opacity: 1;
    position: absolute;
    top: 17px;
    left: calc(50% + 30px);
    overflow: hidden;
    z-index: 10; /* Ensure controls are above hidden video*/
  }
  .go-stop:hover {
    cursor: pointer;
  }
  .go-stop.stopped {
    background: url('../images/go-stop-icon-true.png');
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
  }
  .mute {
    width: 20px;
    height: 20px;
    background: url('../images/mute-icon.png');
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
    opacity: 1;
    position: absolute;
    top: 17px;
    left: calc(50% - 25px);
    overflow: hidden;
    z-index: 10; /* Ensure controls are above hidden video*/
  }
  .mute.muted {
    background: url('../images/mute-icon-true.png');
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
  }
  .mute:hover {
    cursor: pointer;
  }

  /* Parent container to clip overflow */
  /* .song-container {
    width: calc(100% - 110px);
    position: absolute;
    top: 5px;
    left: 45px;
    overflow: hidden; 
    white-space: nowrap;
    }*/
  .song-name {
    width: fit-content;/*calc(100% - 100px);*/
    /*width: 109px;*/
    color: rgba(0, 0, 0, 1);
    position: absolute;
    top: 0px;
    right: 0%;
    left: 100%; /* so that it won't overlap with thumbnail img.*/
    font-size: 12px;
    opacity: 1;
    text-align: center;
    white-space: nowrap;
    animation: scroll 20s linear infinite;
    overflow: hidden;
    z-index: 1; /* Ensure controls are above hidden video*/
  }
  .song-name:hover {
    animation-play-state: paused;
  }
  .time-display {
    position: relative;
    bottom: 1px;
    top: 20px;
    left: 155px;
    color: black;
    font-size: 10px;
    z-index: 1;
    padding-top: 4px;
    margin: auto;
  }

@keyframes scroll {
  0% {
    left: 100%;
  }
100% {
    left: -90%; 
  }
}
{% endhighlight %}
</details>

Some styles are modified from the original source to make it fit into my blog. Below is the brief explanation. Mostly basic CSS.

- The original music player displayed a small YouTube video, but I modified it to be invisible, keeping only the audio components. `width`, `height`, `visibility` of `youtube` class or `musiciframe` class can be modified.
- In styles of `thumbnail` class, I set `z-index: 2;`, so that `song-name` class with `z-index: 1;` doesn't overlap with the thumbnail.
- Images for each class was retrieved using `background: url('../images/imageName.png');`, where is the directory you'll put your icon for the music player.
- Song name was animated using `animation: scroll 20s linear infinite;` which is accompanied by `@keyframes scroll` block. Also, the `z-index: 1;` was set, so that it moves under the thumbnail.

-----(Update 2025-02-08)-----

- CSS without thumbnail but YouTube video was created as the following script. Please diable `thumbnail` class elements in HTML too if you are to show the YouTube video instead of its thumbnail image.

<details>
<summary>Click to see full CSS script for YouTube Video</summary>

{% highlight css %}
/*.music-player{
  position: sticky;
  bottom: 0;
  right: 50%;
  }*/

.soundplayer {
    /*width: 84%;*/
    width: 277px; /*109px*/
    height: 50px; /*25%;*/
    background: #F1F8FF;
    /*background: url('./images/v8_365.png');*/
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
    opacity: 0.8;
    position: sticky;
    top: 10px;
    border-style: solid;
    border-color: #3282F6;
    border-radius: 10px;
    margin: auto;
    overflow: hidden;
  }
  /* .thumbnail {
    width: 85.4px; /* Adjust size as needed */
  /*  height: 48px;
    border-radius: 10px; /* Optional: Rounded corners */
  /*  object-fit: cover; /* Keeps aspect ratio without distortion */
  /*  position: absolute;
    left: 0px; /* Adjust positioning */
  /*  top: 50%;
    transform: translateY(-50%);
    z-index: 2;
    } */
  .youtube {
    width: 85.4px; /* 85.4px*/
    height: 48px; /*48px*/
    background: rgba(179, 179, 179, 1);
    opacity: 100;
    position: absolute;
    top: 50%;
    left: 0px;
    transform: translateY(-50%);
    z-index: 5;
    overflow: hidden;
  }
  .musiciframe {
    width: 85.4px; /* 85.4px*/
    height: 48px; /*48px*/
    z-index: 2;
  }
  .next-song {
    width: 20px;
    height: 20px;
    background: url('../images/next-song-icon.png');
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
    opacity: 1;
    position: absolute;
    top: 17px;
    left: calc(50% + 90px);
    overflow: hidden;
    z-index: 10; /* Ensure controls are above hidden video*/
  }
  .next-song:hover {
    cursor: pointer;
  }
  .go-stop {
    width: 20px;
    height: 20px;
    background: url('../images/go-stop-icon.png');
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
    opacity: 1;
    position: absolute;
    top: 17px;
    left: calc(50% + 30px);
    overflow: hidden;
    z-index: 10; /* Ensure controls are above hidden video*/
  }
  .go-stop:hover {
    cursor: pointer;
  }
  .go-stop.stopped {
    background: url('../images/go-stop-icon-true.png');
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
  }
  .mute {
    width: 20px;
    height: 20px;
    background: url('../images/mute-icon.png');
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
    opacity: 1;
    position: absolute;
    top: 17px;
    left: calc(50% - 25px);
    overflow: hidden;
    z-index: 10; /* Ensure controls are above hidden video*/
  }
  .mute.muted {
    background: url('../images/mute-icon-true.png');
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
  }
  .mute:hover {
    cursor: pointer;
  }

  /* Parent container to clip overflow */
  /* .song-container {
    width: calc(100% - 110px);
    position: absolute;
    top: 5px;
    left: 45px;
    overflow: hidden; 
    white-space: nowrap;
    }*/
  .song-name {
    width: fit-content;/*calc(100% - 100px);*/
    /*width: 109px;*/
    color: rgba(0, 0, 0, 1);
    position: absolute;
    top: 0px;
    right: 0%;
    left: 100%; /* so that it won't overlap with thumbnail img.*/
    font-size: 12px;
    opacity: 1;
    text-align: center;
    white-space: nowrap;
    animation: scroll 20s linear infinite;
    overflow: hidden;
    z-index: 1; /* Ensure controls are above hidden video*/
  }
  .song-name:hover {
    animation-play-state: paused;
  }
  .time-display {
    position: relative;
    bottom: 1px;
    top: 20px;
    left: 155px;
    color: black;
    font-size: 10px;
    z-index: 1;
    padding-top: 12px;
    margin: auto;
  }

@keyframes scroll {
  0% {
    left: 100%;
  }
100% {
    left: -90%; 
  }
}
{% endhighlight %}
</details>

-----(Update 2025-02-15)-----
Now, YouTube iframe element has its own class `musiciframe`. This is to style iframe of the music player only, so that no other iframes are affected. Accordingly, `iframe` style was changed to `.musiciframe` style in CSS.

### 3. JavaScript for the Music Player

This is the core functional component of the music player. 

<details>
<summary>Click to see the full JavaScript</summary>

{% highlight javascript %}
(Last Updated in 2025-02-08)
// Import video array data
import { videos } from "./video_array.js";

// Store player state in sessionStorage
const PlayerState = {
    get currentVideo() {
        return JSON.parse(sessionStorage.getItem('currentVideo')) || null;
    },
    set currentVideo(video) {
        sessionStorage.setItem('currentVideo', JSON.stringify(video));
    },
    get isPlaying() {
        return JSON.parse(sessionStorage.getItem('isPlaying')) || false;
    },
    set isPlaying(state) {
        sessionStorage.setItem('isPlaying', state);
    },
    get isMuted() {
        return JSON.parse(sessionStorage.getItem('isMuted')) || false;
    },
    set isMuted(state) {
        sessionStorage.setItem('isMuted', state);
    },
    get currentTime() {
        return parseFloat(sessionStorage.getItem('currentTime')) || 0;
    },
    set currentTime(time) {
        sessionStorage.setItem('currentTime', time);
    }
};

let player;
const youtubeContainer = document.querySelector('.youtube');
const muteButton = document.getElementById('muteButton');
const playButton = document.getElementById('playButton');
const nextSongButton = document.querySelector('.next-song');

// For Progress Bar
// Format time in MM:SS
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}
// Update progress bar and time display
function updateProgressBar() {
    if (!player) return;

    try {
        const currentTime = player.getCurrentTime();
        const duration = player.getDuration();

        if (duration > 0) {
            const progressPercentage = (currentTime / duration) * 100;
            
            //Update progress bar width
            const progressBarFill = document.querySelector('.progress-bar-fill');
            if (progressBarFill) {
                progressBarFill.style.width = `${progressPercentage}%`;
            }

            // Update time display
            const currentTimeElement = document.querySelector('.current-time');
            const totalTimeElement = document.querySelector('.total-time');

            if (currentTimeElement) {
                currentTimeElement.textContent = formatTime(currentTime);
            }

            if (totalTimeElement) {
                totalTimeElement.textContent = formatTime(duration);
            }
        }
    } catch (error) {
        console.error('Error updating progress bar:', error);
    }
}
// Add progress bar update to existing interval or create a new one
const progressUpdateInterval = setInterval(() => {
   updateProgressBar();
}, 1000);


// Function to update song title
function updateSongTitle(title) {
    const songTitleElement = document.getElementById('songTitle');
    if (songTitleElement) {
        songTitleElement.textContent = title || 'Loading...';
    }
}

document.addEventListener('DOMContentLoaded', updateSongTitle);

// Update UI based on stored state
function updateUIState() {
    muteButton.classList.toggle('muted', PlayerState.isMuted);
    playButton.classList.toggle('stopped', !PlayerState.isPlaying);
    // Update title from stored state
    const currentVideo = PlayerState.currentVideo;
    if (currentVideo) {
        updateSongTitle(currentVideo.title);
    }
}

// Load video with stored time
function loadVideoWithState(videoId, startTime) {
    youtubeContainer.innerHTML = `
        <iframe
            id="player"
            class="musiciframe"
            width="560"
            height="315"
            src="https://www.youtube.com/embed/${videoId}?enablejsapi=1&start=${Math.floor(startTime)}"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen>
        </iframe>
    `;

    player = new YT.Player('player', {
        events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
        },
    });
}

function onPlayerReady(event) {
    if (PlayerState.isMuted) {
        player.mute();
    }
    if (PlayerState.isPlaying) {
        player.playVideo();
    }
    player.setVolume(20);

    // Ensure title is displayed after player is ready
    const currentVideo = PlayerState.currentVideo;
    if (currentVideo) {
        updateSongTitle(currentVideo.title);
    }

    // Initial progress bar and time display update
    updateProgressBar();
    
    // Ensure progress bar is updated when video changes
    if (currentVideo) {
        updateSongTitle(currentVideo.title);
    }
}

// Save current time periodically
setInterval(() => {
    if (player && player.getCurrentTime) {
        PlayerState.currentTime = player.getCurrentTime();
    }
}, 1000);

// Function to update the thumbnail and lightbox link
function updateThumbnail(videoId) {
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`; // High-quality thumbnail
    const lightboxLink = document.querySelector("a[data-lightbox='soundplayer']");
    const thumbnailImg = document.getElementById("thumbnail");

    if (lightboxLink && thumbnailImg) {
        lightboxLink.href = thumbnailUrl;  // Update <a> href
        thumbnailImg.src = thumbnailUrl;   // Update <img> src
    }
}

function loadRandomVideo() {
    let newIndex;
    let previousVideo = PlayerState.currentVideo;

     // Ensure the new video is different from the current one
     do {
        newIndex = Math.floor(Math.random() * videos.length);
    } while (videos[newIndex].id === (previousVideo ? previousVideo.id : null));

    // const randomIndex = Math.floor(Math.random() * videos.length);
    const selectedVideo = videos[newIndex];
    PlayerState.currentVideo = selectedVideo;
    
    const songNameElement = document.querySelector('.song-name');
    songNameElement.textContent = selectedVideo.title;
    
    // Update thumbnail
    //document.getElementById('thumbnail').src = `https://img.youtube.com/vi/${selectedVideo.id}/hqdefault.jpg`;
    updateThumbnail(selectedVideo.id);

    // Reset progress bar
    //const progressBarFill = document.querySelector('.progress-bar-fill');
    //if (progressBarFill) {
    //    progressBarFill.style.width = '0%';
    //}
    loadVideoWithState(selectedVideo.id, 0);
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
        loadRandomVideo();
    }
}

// Event listeners
muteButton.addEventListener('click', () => {
    PlayerState.isMuted = !PlayerState.isMuted;
    if (player) {
        PlayerState.isMuted ? player.mute() : player.unMute();
    }
    updateUIState();
});

playButton.addEventListener('click', () => {
    PlayerState.isPlaying = !PlayerState.isPlaying;
    if (PlayerState.isPlaying) {
        player.playVideo();
    } else {
        player.pauseVideo();
    }
    updateUIState();
});

nextSongButton.addEventListener('click', loadRandomVideo);

// Initialize player
(function() {
    // Update title immediately when page loads
    const storedVideo = PlayerState.currentVideo;
    if (storedVideo) {
        updateSongTitle(storedVideo.title);
    }

    // Update thumbnail
    //document.getElementById('thumbnail').src = `https://img.youtube.com/vi/${storedVideo.id}/hqdefault.jpg`;
    updateThumbnail(storedVideo.id);

    window.onYouTubeIframeAPIReady = function() {
        const storedVideo = PlayerState.currentVideo;
        if (storedVideo) {
            loadVideoWithState(storedVideo.id, PlayerState.currentTime);
        } else {
            loadRandomVideo();
        }
        updateUIState();
    };
})();

// Load YouTube API
const tag = document.createElement('script');
tag.src = 'https://www.youtube.com/iframe_api';
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
{% endhighlight %}
</details>

Here, only key functions and blocks were covered.

#### 3-1. Import video data

Import video data using `import { videos } from "./video_array.js";`.
Here, the imported JavaScript is located in the same directory as the importing JavaScript.

#### 3-2. Store and Retrieve Player State in localStorage
Each information is stored as a JSON string in `localStorage`, and retrieved from `localStorage`. It's a key in storing the information of the last played video when switching between pages. It also ensures that video resume from the same point with the same mute/play settings when the page is refreshed.

-----(Update 2025-02-08)-----

- All `localStorage` in previous scripts were replaced with `sessionStorage`, as reflected in the above full JavaScript. This is to ensure that music play records are stored only when the session is active.

#### 3-3. Declare Key Variables

`player`, `youtubeContainer`, `muteButton`, `playButton`, `nextSongButton` were declared by selecting the elements in the HTML file respectively.

#### 3-4. Create Functions for Features

1. **`formatTime()`** return times that will be used to show current time and total time.
2. **`updateSongTitle()`** updates song title. This function is used (1) when DOM Contents are loaded, (2) whenever UI state is updated, (3) when music starts to be played.
3. **`LoadVideoWithState()`** make sure that the video is loaded with stored starting time. It's a key function that enables video not to start over when the page is changed.
4. **`setInterval()`** save current time periodically, so that function `LoadVideoWithState()` can use an appropriately stored time value.
5. **`updateThumbnail()`** updates thumbnail and lightbox link. 
6. **`loadRandomVideo()`** load random video, in a way that the next random video isn't same as the previous video. This is achieved by `do {} while ()` formula. Whenever the random video is loaded, song name and thumbnail will be updated.
7. **`onPlayerStateChange()`** loads random video when the played video is ended.

#### 3-5. Add EventListener

Each `add.EventListner('click', ...)` enables mute button, play button, and next song button respectively.

#### 3-6. Initialize Player

Using `(function() {...})`, the defined function is called immediately.

1. Load the stored video information with `const storedVideo`. It retrieves the **last played video** from `sessionStorage`.
2. `updateThumbnail()` is called to **update the video thumbnail** using the stored video's ID.
3. `window.onYoutubeIframeAPIReady = function() {...}` runs **when the YouTube Iframe APi is ready**. 
    - Load the stored video (`storedVideo.id`) at the saved timestamp `PlayerState.currentTime`. 
    - Updates the song title.
    - If there is **no stored video**, then loads a **random video**.
    - `updateUIState()` is called to enable or disable the UI elements based on the stored playback information.

- `//Initialize player` block will initiate the player. If there is a data of stored video, the player starts playing the stored video starting at the stored time. When there is no data of stored video, it loads random video.

#### 3-7. Load YouTube iframe API

1. `const tag` creates new `<script>` element.
2. `tag.src` sets the `src` attribute to YouTube's iframe API URL.
3. `firstScriptTag = document.getElementsByTagName('script')[0];` finds the first `<script>` tag in the document. Then the new `<script>` is inserted before the first script tag, so that it is loaded early.

After the API is loaded, the `window.onYoutubeIframeAPIReady` function is called.

-----(Update 2025-02-15)-----
Now, YouTube iframe element has its own class `musiciframe`. This is to style iframe of the music player only, so that no other iframes are affected.

### 4. JavaScript for Video Data

Creates `/assets/scripts/video_array.js`. It stores the video information to be loaded. Following is the example code.

<details>
<summary>Click to see the full JS code</summary>

{% highlight javascript %}
export const videos = [
    { id: 'dH3GSrCmzC8', title: 'Bill Evans - Waltz for Debby' },
    { id: 'K9D9gXnH6eY', title: 'Duke Jordan - Glad I Met Pat, Take 3' }
];
{% endhighlight %}
</details>

Suppose the video you would like to play has the URL of "https://www.youtube.com/watch?v=f5uLwyk2HEQ". Here, the `id` would be `f5uLwyk2HEQ`.
You can store the video's `id` and the title in the array format in the script.

### 5. Embed the HTML to Your Jekyll Blog

Lastly, embed the HTML to your Jekyll Blog :)!!! For my blog, I added this snippet `{% raw %}<div class="music-player"> {% include musicplayer.html %} </div> {% endraw %}` to the `_includes/footer.html` at an appropriate position.

## Conclusion

It took me some time to modify the existing scripts, but I finally did it! 

Hope you have your own music player for your blog too :)

## Reference

- [estInLOV3's homepage](https://lov3ndpeace.naru.pub/){:target='_blank'}

