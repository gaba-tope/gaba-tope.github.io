// Import video array data
import { videos } from "./video_array.js";

// Store player state in localStorage
const PlayerState = {
    get currentVideo() {
        return JSON.parse(localStorage.getItem('currentVideo')) || null;
    },
    set currentVideo(video) {
        localStorage.setItem('currentVideo', JSON.stringify(video));
    },
    get isPlaying() {
        return JSON.parse(localStorage.getItem('isPlaying')) || false;
    },
    set isPlaying(state) {
        localStorage.setItem('isPlaying', state);
    },
    get isMuted() {
        return JSON.parse(localStorage.getItem('isMuted')) || false;
    },
    set isMuted(state) {
        localStorage.setItem('isMuted', state);
    },
    get currentTime() {
        return parseFloat(localStorage.getItem('currentTime')) || 0;
    },
    set currentTime(time) {
        localStorage.setItem('currentTime', time);
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
    
    // Update thumbnail
    updateThumbnail(storedVideo.id);

    window.onYouTubeIframeAPIReady = function() {
        const storedVideo = PlayerState.currentVideo;
        if (storedVideo) {
            loadVideoWithState(storedVideo.id, PlayerState.currentTime);
            updateSongTitle(storedVideo.title);
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