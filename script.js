const birthday = new Date(2026, 9, 31, 0, 0, 0); // October is month 9
const $ = (id) => document.getElementById(id);

function updateCountdown() {
  const now = new Date();
  let target = birthday;
  if (now > birthday && now.toDateString() !== birthday.toDateString()) {
    target = new Date(now.getFullYear() + 1, 9, 31, 0, 0, 0);
  }
  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  $('days').textContent = String(days).padStart(2,'0');
  $('hours').textContent = String(hours).padStart(2,'0');
  $('minutes').textContent = String(minutes).padStart(2,'0');
  $('seconds').textContent = String(seconds).padStart(2,'0');
  $('countdownLabel').textContent = diff === 0 ? "TODAY IS YOUR SPECIAL DAY ♥" : "COUNTING DOWN TO YOUR DAY";
}
updateCountdown();
setInterval(updateCountdown, 1000);

$('menuToggle').addEventListener('click', () => $('navLinks').classList.toggle('open'));
document.querySelectorAll('#navLinks a').forEach(a => a.addEventListener('click', () => $('navLinks').classList.remove('open')));

$('openLetter').addEventListener('click', () => {
  $('letterContent').classList.toggle('open');
  $('letterContent').setAttribute('aria-hidden', String(!$('letterContent').classList.contains('open')));
  $('openLetter').style.display = 'none';
});

const songs = [
  { title: 'Birthday song', artist: 'A song for you', src: 'song-1.mp3.mpeg' },

];
let songIndex = 0;
const audio = $('audio');
function loadSong(index) {
  songIndex = (index + songs.length) % songs.length;
  $('songTitle').textContent = songs[songIndex].title;
  $('songArtist').textContent = songs[songIndex].artist;
  audio.src = songs[songIndex].src;
  $('progress').value = 0;
  $('currentTime').textContent = '0:00';
  $('duration').textContent = '0:00';
  $('playSong').textContent = '▶';
  document.querySelector('.record').classList.remove('playing');
}
function togglePlay() {
  if (audio.paused) {
    audio.play().then(() => {
      $('playSong').textContent = 'Ⅱ';
      document.querySelector('.record').classList.add('playing');
    }).catch(() => {
      alert('Add your MP3 songs to the music folder first. See README.txt for instructions. ❤️');
    });
  } else {
    audio.pause();
    $('playSong').textContent = '▶';
    document.querySelector('.record').classList.remove('playing');
  }
}
function formatTime(time) {
  if (!Number.isFinite(time)) return '0:00';
  return `${Math.floor(time/60)}:${String(Math.floor(time%60)).padStart(2,'0')}`;
}
$('playSong').addEventListener('click', togglePlay);
$('prevSong').addEventListener('click', () => { loadSong(songIndex - 1); togglePlay(); });
$('nextSong').addEventListener('click', () => { loadSong(songIndex + 1); togglePlay(); });
audio.addEventListener('timeupdate', () => {
  if (audio.duration) $('progress').value = (audio.currentTime / audio.duration) * 100;
  $('currentTime').textContent = formatTime(audio.currentTime);
});
audio.addEventListener('loadedmetadata', () => $('duration').textContent = formatTime(audio.duration));
audio.addEventListener('ended', () => { loadSong(songIndex + 1); togglePlay(); });
$('progress').addEventListener('input', () => {
  if (audio.duration) audio.currentTime = (Number($('progress').value) / 100) * audio.duration;
});
loadSong(0);

$('surpriseButton').addEventListener('click', () => {
  $('surpriseMessage').classList.add('show');
  $('surpriseButton').textContent = 'Your surprise is unlocked ♥';
  $('surpriseButton').disabled = true;
  launchConfetti();
  $('surpriseMessage').scrollIntoView({behavior:'smooth', block:'center'});
});

function launchConfetti() {
  const canvas = $('sparkles');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;
  ctx.scale(devicePixelRatio, devicePixelRatio);
  const pieces = Array.from({length:150}, () => ({
    x: Math.random()*window.innerWidth, y: -20-Math.random()*window.innerHeight*.4,
    size: 2+Math.random()*5, speed: 2+Math.random()*4,
    drift: (Math.random()-.5)*2, angle: Math.random()*6, spin:(Math.random()-.5)*.15,
    color: ['#d9b77a','#c77d86','#f1d9c0','#8c344e'][Math.floor(Math.random()*4)]
  }));
  let frame = 0;
  function draw() {
    ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
    pieces.forEach(p => {
      p.y += p.speed; p.x += p.drift; p.angle += p.spin;
      ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.angle); ctx.fillStyle=p.color;
      ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size*1.7); ctx.restore();
    });
    frame++;
    if(frame < 220) requestAnimationFrame(draw);
    else ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
  }
  draw();
}

// Soft floating sparkle field
const canvas = $('sparkles'), ctx = canvas.getContext('2d');
let stars = [];
function resizeCanvas() {
  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;
  ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
  stars = Array.from({length:55},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:.4+Math.random()*1.3,a:Math.random(),v:.003+Math.random()*.008}));
}
function animateStars() {
  ctx.clearRect(0,0,innerWidth,innerHeight);
  stars.forEach(s=>{s.a+=s.v;if(s.a>1||s.a<0)s.v*=-1;ctx.globalAlpha=Math.max(0,s.a);ctx.fillStyle='#e6c58f';ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill();});
  ctx.globalAlpha=1; requestAnimationFrame(animateStars);
}
resizeCanvas(); animateStars();
window.addEventListener('resize', resizeCanvas);
