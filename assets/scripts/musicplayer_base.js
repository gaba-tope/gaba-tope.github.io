const videos = [
    { id: 'dH3GSrCmzC8', title: 'Bill Evans - Waltz for Debby' },
    { id: 'K9D9gXnH6eY', title: 'Duke Jordan - Glad I Met Pat, Take 3' },
    { id: 'eo9GCpQDFXQ', title: '岩崎琢 - The Message from The Past'},
    { id: '7MHQfOtaBQU', title: '神前暁 - The Mysterious' },
    { id: 'MOzZe_yVIcc', title: '남구민 - Reminiscence' },
  ];
 
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
  let isMuted = false; // 음소거 상태를 추적
  
  let isPlaying = true; // 초기 상태
  const playButton = document.getElementById('playButton');
  
  // 다음 노래 버튼
  const nextSongButton = document.querySelector('.next-song');
  
  // YouTube API 스크립트 추가
  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  
  // 즉시 호출 함수 표현식으로 전역 함수 설정
  (function () {
    window.onYouTubeIframeAPIReady = function () {
      loadRandomVideo(); // 페이지 로드 시 랜덤 비디오 재생
    };
  })();
  
  // mute 버튼 클릭 이벤트 리스너
  muteButton.addEventListener('click', () => {
    isMuted = !isMuted; // 상태 반전
    if (player) {
      player.isMuted() ? player.unMute() : player.mute(); // 플레이어의 음소거 상태 변경
    }
    muteButton.classList.toggle('muted', isMuted); // 클래스 토글하여 아이콘 변경
  });
  
  // play 버튼 클릭 이벤트 리스너
  playButton.addEventListener('click', () => {
    isPlaying = !isPlaying; // 상태 반전
    if (isPlaying) {
      player.playVideo(); // 비디오 재생
      playButton.classList.remove('stopped'); // 재생 중 클래스 제거
    } else {
      player.pauseVideo(); // 비디오 일시 정지
      playButton.classList.add('stopped'); // 일시 정지 클래스 추가
    }
  });
  
  // next 버튼 클릭 이벤트 리스너
  nextSongButton.addEventListener('click', loadRandomVideo); // 다음 노래 로드
  
  // 랜덤 비디오 로드 함수
  function loadRandomVideo() {
    // 랜덤으로 비디오 선택
    const randomIndex = Math.floor(Math.random() * videos.length);
    const selectedVideo = videos[randomIndex];
  
    // YouTube embed 코드 동적으로 생성
    youtubeContainer.innerHTML = `
        <iframe 
          id="player"
          width="560" 
          height="315" 
          src="https://www.youtube.com/embed/${selectedVideo.id}?enablejsapi=1&autoplay=1" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen>
        </iframe>
    `;
  
    // 노래 제목 설정
    const songNameElement = document.querySelector('.song-name');
    songNameElement.textContent = selectedVideo.title;
  
    // iframe이 로드될 때 player 객체 초기화
    player = new YT.Player('player', {
      events: {
        onStateChange: onPlayerStateChange, // 상태 변화 감지
      },
    });

    // Wait a bit before setting volume to ensure player is ready
    setTimeout(() => {
        if (player && typeof player.setVolume === 'function') {
            player.setVolume(10); // Set volume to 10%
        }
    }, 1000); // Delay for 1 second

  }
  
  // 플레이어 상태 변화 처리
  function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
      loadRandomVideo(); // 노래가 끝나면 랜덤으로 다음 비디오 로드
    }
  }
  