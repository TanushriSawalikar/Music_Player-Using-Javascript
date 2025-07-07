document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const audio = new Audio();
    const albumArt = document.getElementById('album-art');
    const songTitle = document.getElementById('song-title');
    const artist = document.getElementById('artist');
    const progressBar = document.getElementById('progress-bar');
    const currentTimeElement = document.getElementById('current-time');
    const durationElement = document.getElementById('duration');
    const playBtn = document.getElementById('play-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const volumeSlider = document.getElementById('volume-slider');
    const playlistElement = document.getElementById('playlist');
    const albumArtContainer = document.querySelector('.album-art');

    // Playlist data
    const playlist = [
        {
            title: "Midnight Echoes",
            artist: "Luna Nox",
            src: "assets_music_music-1.mp3",
            cover: "music1.jpg"
        },
        {
            title: "Cloudy Vibes",
            artist: "Drift Theory",
            src: "assets_music_music-2.mp3",
            cover: "music2.jpg"
        },
        {
            title: "Echoes of you",
            artist: "Violet Reverie",
            src: "assets_music_music-3.mp3",
            cover: "music3.jpg"
        },
        {
            title: "Sleepy Skies",
            artist: "Chill Kami",
            src: "assets_music_music-4.mp3",
            cover: "music4.jpg"
        },
        {
            title: "Lo-fi lane",
            artist: "jazzy Pixel",
            src: "assets_music_music-5.mp3",
            cover: "music5.jpg"
        }
    ];

    let currentSongIndex = 0;
    let isPlaying = false;

    // Initialize the player
    function initPlayer() {
        loadSong(currentSongIndex);
        renderPlaylist();
        
        // Set initial volume
        audio.volume = volumeSlider.value;
    }

    // Load a song
    function loadSong(index) {
        const song = playlist[index];
        songTitle.textContent = song.title;
        artist.textContent = song.artist;
        albumArt.src = song.cover;
        audio.src = song.src;
        
        // Highlight current song in playlist
        const playlistItems = document.querySelectorAll('#playlist li');
        playlistItems.forEach((item, i) => {
            if (i === index) {
                item.classList.add('playing');
            } else {
                item.classList.remove('playing');
            }
        });
    }

    // Play the current song
    function playSong() {
        isPlaying = true;
        audio.play();
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        albumArtContainer.classList.add('playing');
    }

    // Pause the current song
    function pauseSong() {
        isPlaying = false;
        audio.pause();
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        albumArtContainer.classList.remove('playing');
    }

    // Play next song
    function nextSong() {
        currentSongIndex = (currentSongIndex + 1) % playlist.length;
        loadSong(currentSongIndex);
        if (isPlaying) playSong();
    }

    // Play previous song
    function prevSong() {
        currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
        loadSong(currentSongIndex);
        if (isPlaying) playSong();
    }

    // Update progress bar
    function updateProgress() {
        const { currentTime, duration } = audio;
        const progressPercent = (currentTime / duration) * 100;
        progressBar.style.setProperty('--progress', `${progressPercent}%`);
        
        // Update time display
        currentTimeElement.textContent = formatTime(currentTime);
        
        // Update duration display
        if (!isNaN(duration)) {
            durationElement.textContent = formatTime(duration);
        }
    }

    // Format time in mm:ss
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // Set progress when clicking on progress bar
    function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        audio.currentTime = (clickX / width) * duration;
    }

    // Render playlist
    function renderPlaylist() {
        playlistElement.innerHTML = '';
        
        playlist.forEach((song, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div>
                    <strong>${song.title}</strong>
                    <span>${song.artist}</span>
                </div>
                <span class="song-duration">2:30</span>
            `;
            
            li.addEventListener('click', () => {
                currentSongIndex = index;
                loadSong(currentSongIndex);
                playSong();
            });
            
            playlistElement.appendChild(li);
        });
    }

    // Event listeners
    playBtn.addEventListener('click', () => {
        isPlaying ? pauseSong() : playSong();
    });

    nextBtn.addEventListener('click', nextSong);
    prevBtn.addEventListener('click', prevSong);

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', nextSong);
    audio.addEventListener('loadedmetadata', () => {
        durationElement.textContent = formatTime(audio.duration);
    });

    progressBar.addEventListener('click', setProgress);

    volumeSlider.addEventListener('input', () => {
        audio.volume = volumeSlider.value;
    });

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        switch(e.code) {
            case 'Space':
                e.preventDefault();
                isPlaying ? pauseSong() : playSong();
                break;
            case 'ArrowRight':
                nextSong();
                break;
            case 'ArrowLeft':
                prevSong();
                break;
            case 'ArrowUp':
                volumeSlider.value = Math.min(parseFloat(volumeSlider.value) + 0.1, 1);
                audio.volume = volumeSlider.value;
                break;
            case 'ArrowDown':
                volumeSlider.value = Math.max(parseFloat(volumeSlider.value) - 0.1, 0);
                audio.volume = volumeSlider.value;
                break;
        }
    });

    // Initialize the player
    initPlayer();
});