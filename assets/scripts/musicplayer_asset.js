// Import audio array data
import { songs } from "./musicList.js";

// Store player state in sessionStorage
const PlayerState = {
    get currentSong() {
        return JSON.parse(sessionStorage.getItem('currentSong')) || null;
    },
    set currentSong(song) {
        sessionStorage.setItem('currentSong', JSON.stringify(song));
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

let audioPlayer = document.getElementById('audioPlayer');
setupAudioEventListeners();

const audioContainer = document.querySelector('.audio-player');
const muteButton = document.getElementById('muteButton');
const playButton = document.getElementById('playButton');
const nextSongButton = document.getElementById('nextSongButton');

// Format time in MM:SS
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

// Update progress bar and time display
function updateProgressBar() {
    if (!audioPlayer) return;

    try {
        const currentTime = audioPlayer.currentTime;
        const duration = audioPlayer.duration;

        if (duration > 0) {
            const progressPercentage = (currentTime / duration) * 100;
            
            // Update progress bar width
            const progressBarFill = document.querySelector('.progress-bar-fill');
            if (progressBarFill) {
                progressBarFill.style.width = `${progressPercentage}%`;
            }

            // Update time display
            const currentTimeElement = document.getElementById('currentTime');
            const totalTimeElement = document.getElementById('totalTime');

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

// Add progress bar update interval
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
    console.log("Updating UI state: isPlaying =", PlayerState.isPlaying); // Debugging
    muteButton.classList.toggle('muted', PlayerState.isMuted);
    playButton.classList.toggle('stopped', !PlayerState.isPlaying);

    const currentSong = PlayerState.currentSong;
    if (currentSong) {
        updateSongTitle(currentSong.title);
    }
}

// Load audio with stored time
function loadAudioWithState(audioPath, startTime) {
    if (!audioPath) {
        console.error('No audio path provided');
        return;
    }
    
    //console.log("Loading audio with path:", audioPath, "Start time:", startTime); //Debugging

    try {
        audioPlayer.src = audioPath;
        //console.log("Set audio src:", audioPlayer.src);

        audioPlayer.currentTime = startTime || 0;
        audioPlayer.muted = PlayerState.isMuted;
        audioPlayer.volume = 0.2;
        
        // Ensure audio is loaded before allowing play
        audioPlayer.load();
        console.log("Audio Loaded: ", audioPath); // For debugging
        
        // Add error event listener for debugging
        audioPlayer.addEventListener('error', (e) => {
            console.error('Audio loading error:', e);
            //console.log("Audio element state:", {
            //    src: audioPlayer.src,
            //    networkState: audioPlayer.networkState,
            //    readyState: audioPlayer.readyState,
            //    error: audioPlayer.error,
            //});
        });

    } catch (error) {
        console.error('Error loading audio:', error);
    }
}

function setupAudioEventListeners() {
    audioPlayer.addEventListener('ended', () => {
        loadRandomSong();
    });

    audioPlayer.addEventListener('loadedmetadata', () => {
        updateProgressBar();
        const currentSong = PlayerState.currentSong;
        if (currentSong) {
            updateSongTitle(currentSong.title);
        }
    });
}

// Save current time periodically
setInterval(() => {
    if (audioPlayer) {
        PlayerState.currentTime = audioPlayer.currentTime;
    }
}, 1000);

function loadRandomSong() {
    if (!songs || !songs.length) {
        console.error('No songs available');
        return;
    }

    let newIndex;
    let previousSong = PlayerState.currentSong;

    // Ensure the new song is different from the current one
    do {
        newIndex = Math.floor(Math.random() * songs.length);
    } while (songs[newIndex].id === (previousSong ? previousSong.id : null));

    const selectedSong = songs[newIndex];
    // Validate song data
    if (!selectedSong.filename) {
        console.error('Invalid song data:', selectedSong);
        return;
    }

    PlayerState.currentSong = selectedSong;
    
    const songNameElement = document.querySelector('.song-name');
    songNameElement.textContent = selectedSong.title;
    
    // Encode the file paths to handle spaces
    const audioPath = `/assets/music/${encodeURIComponent(selectedSong.filename)}`;

    // Load audio file
    loadAudioWithState(audioPath, 0);
}

// Event listeners
muteButton.addEventListener('click', () => {
    PlayerState.isMuted = !PlayerState.isMuted;
    if (audioPlayer) {
        audioPlayer.muted = PlayerState.isMuted;
    }
    updateUIState();
});

playButton.addEventListener('click', async () => {
    //console.log("play button clicked") // For debugging

    PlayerState.isPlaying = !PlayerState.isPlaying;
    if (PlayerState.isPlaying) {
        try {
            await audioPlayer.play();
            //console.log("Audio started playing");
        } catch (error) {
            console.error("Autoplay blocked or other error:", error);
        }
    } else {
        audioPlayer.pause();
        //console.log("audio paused");
    }
    updateUIState();
});

nextSongButton.addEventListener('click', loadRandomSong);

// Initialize player
document.addEventListener('DOMContentLoaded', () => {
    const storedSong = PlayerState.currentSong;
        
    if (storedSong && storedSong.filename) {
        const audioPath = `/assets/music/${encodeURIComponent(storedSong.filename)}`;
        console.log("loading stored song:", audioPath); //debugging
        loadAudioWithState(audioPath, PlayerState.currentTime);
        updateSongTitle(storedSong.title);
    } else {
        console.log("no stored song found, loading random song"); //debugging
        loadRandomSong();
    }
    updateUIState();
});
