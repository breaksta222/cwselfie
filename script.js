const images = [];
const descriptions = {
  "1.webp": "안경셀카🤓",
  "2.webp": "핫팩셀카🔥",
  "3.webp": "생머리🤍",
  "4.webp": "침대셀카🛏",
  "5.webp": "왹냥이🐱",
  "6.webp": "줄이어폰셀카🎧",
  "7.webp": "하찌노채원👽✨",
  "8.webp": "앞없셀카✌",
  "9.webp": "왹멍이🐶",
  "10.webp": "기린머리셀카💙", // 가로 셀카
  "11.webp": "곤약젤리셀카🍬",
  "12.webp": "블소드셀카🖤",
  "13.webp": "채원도도걸💅",
  "14.webp": "오사카곰돌이셀카🤎", 
  "15.webp": "윙크셀카💦", // 가로 셀카
  "16.webp": "추리소설양갈래셀카💘"
};

for (let i = 1; i <= 16; i++) {
  images.push(`images/${i}.webp`);
}

let currentRound = [];
let nextRound = [];
let roundNumber = 1;
let index = 0;

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function getRoundLabel(size) {
  if (size === 16) return "16강";
  if (size === 8) return "8강";
  if (size === 4) return "4강";
  if (size === 2) return "결승";
  return `Round ${roundNumber}`;
}

function updateProgress() {
  const totalMatches = images.length - 1;
  const passed = nextRound.length + Math.floor(index / 2);
  const percent = Math.floor((passed / totalMatches) * 100);

  const bar = document.getElementById("progress-bar");
  if (currentRound.length === 2 && index >= currentRound.length) {
    bar.style.display = "none";
  } else {
    bar.style.display = "block";
    document.getElementById("progress-fill").style.width = `${percent}%`;
    document.getElementById("progress-text").innerText = `${percent}%`;
  }
}

function startGame() {
  currentRound = shuffle([...images]);
  nextRound = [];
  index = 0;
  roundNumber = 1;
  document.getElementById("result").style.display = "none";
  document.getElementById("ranking-box").style.display = "none";
  document.getElementById("game-container").style.display = "flex";
  document.getElementById("progress-bar").style.display = "block";
  showPair();

  // 자동 음악 재생
  const bgm = document.getElementById("bg-music");
  if (bgm) bgm.play();
}

function showPair() {
  if (index >= currentRound.length) {
    if (nextRound.length === 1) {
      showFinalWinner(nextRound[0]);
      return;
    }
    currentRound = nextRound;
    nextRound = [];
    index = 0;
    roundNumber++;
  }

  if (index + 1 >= currentRound.length) {
    showFinalWinner(currentRound[index]);
    return;
  }

  const leftImg = currentRound[index];
  const rightImg = currentRound[index + 1];

  document.getElementById("round-label").innerText = getRoundLabel(currentRound.length);
  document.getElementById("img-left").src = leftImg;
  document.getElementById("img-right").src = rightImg;

  const leftFile = leftImg.split("/").pop();
  const rightFile = rightImg.split("/").pop();

  const leftEl = document.getElementById("img-left");
  const rightEl = document.getElementById("img-right");

  const horizontal = ["10.webp", "15.webp"];
  leftEl.style.objectFit = horizontal.includes(leftFile) ? "cover" : "contain";
  rightEl.style.objectFit = horizontal.includes(rightFile) ? "cover" : "contain";

  document.getElementById("desc-left").innerText = descriptions[leftFile] || "";
  document.getElementById("desc-right").innerText = descriptions[rightFile] || "";

  updateProgress();
}

function selectImage(side) {
  const winner = side === 'left' ? currentRound[index] : currentRound[index + 1];
  nextRound.push(winner);
  index += 2;
  showPair();
}

function recordVote(file) {
  const today = new Date().toISOString().split('T')[0];
  const lastVote = localStorage.getItem("lastVote");
  if (lastVote === today) return;

  localStorage.setItem("lastVote", today);
  const key = `vote_${file}`;
  const count = parseInt(localStorage.getItem(key) || "0");
  localStorage.setItem(key, count + 1);
}

function showFinalWinner(winnerImg) {
  if (!winnerImg) return;

  document.getElementById("game-container").style.display = "none";
  document.getElementById("result").style.display = "block";
  document.getElementById("progress-bar").style.display = "none";
  document.getElementById("final-img").src = winnerImg;

  const file = winnerImg.split("/").pop();
  const desc = descriptions[file] || "";
  document.getElementById("final-desc").innerText = desc;

  recordVote(file);

  const text = encodeURIComponent(`내가 고른 최애 채원 셀카는? "#${desc}" 💜 #tripleS #트리플에스 #김채원 `);
  const url = encodeURIComponent(window.location.href);
  const tweetUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
  document.getElementById("twitter-share").href = tweetUrl;
}

function showRanking() {
  const allVotes = [];
  let totalVotes = 0;

  for (const key in localStorage) {
    if (key.startsWith("vote_")) {
      const file = key.replace("vote_", "");
      const count = parseInt(localStorage.getItem(key));
      allVotes.push({ file, count });
      totalVotes += count;
    }
  }

  allVotes.sort((a, b) => b.count - a.count);
  const top3 = allVotes.slice(0, 3);

  const container = document.getElementById("ranking-list");
  container.innerHTML = "";

  top3.forEach(({ file, count }, i) => {
    const percent = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
    const img = document.createElement("img");
    img.src = "images/" + file;
    img.style.width = "30%";
    img.style.margin = "10px";
    img.style.borderRadius = "10px";

    const div = document.createElement("div");
    div.innerHTML = `<strong>${i + 1}위</strong>: ${descriptions[file]} (${count}표, ${percent}%)`;
    div.appendChild(img);
    container.appendChild(div);
  });

  document.getElementById("ranking-box").style.display = "block";
}

function playMusic() {
  const bgm = document.getElementById("bg-music");
  if (bgm) bgm.play();
}
function pauseMusic() {
  const bgm = document.getElementById("bg-music");
  if (bgm) bgm.pause();
}

startGame();
