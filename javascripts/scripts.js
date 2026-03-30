//console.log("JS есть");//
//окошко
window.onload = function () {
  const startBtn = document.getElementById("openModal");
  const windowIds = ["win-1", "win-2", "win-3", "win-4"];
  let currentStep = 0;

  if (startBtn) {
    startBtn.onclick = function () {
      if (currentStep >= windowIds.length) {
        currentStep = 0;
        console.log("Цикл завершен, начинаем заново с первого окна");
      }

      const nextId = windowIds[currentStep];
      const win = document.getElementById(nextId);

      if (win) {
        win.style.display = "block";

        win.style.zIndex = 1000 + currentStep + (new Date().getTime() % 100);

        console.log(
          `Открыто окно: ${nextId}. Шаг: ${currentStep + 1} из ${windowIds.length}`,
        );

        currentStep++;
      }
    };
  }

  document.addEventListener("click", (e) => {
    if (
      e.target.classList.contains("close-x") ||
      e.target.classList.contains("ok-btn")
    ) {
      const parentWindow = e.target.closest(".fake-window");
      if (parentWindow) {
        parentWindow.style.display = "none";
        console.log("Окно закрыто пользователем");
      }
    }
  });
};
// карта и элементы
const itemsData = {
  mountains: {
    image: "../images/sword.svg",
    name: "меч короля",
    owner: "принцу",
    price: "10 шоп-коинов",
    action: "поймать айтем",
  },

  hut: {
    image: "../images/armor.svg",
    name: "медные доспехи",
    owner: "рыцарю",
    price: "7 шоп-коинов",
    action: "познать мудрость",
  },

  forest: {
    image: "../images/blouse.svg",
    name: "элегантная блуза",
    owner: "королеве",
    price: "15 шоп-коинов",
    action: "обойти препядствия",
  },

  castle: {
    image: "../images/armor2.svg",
    name: "штаны с доспехами",
    owner: "рыцарю",
    price: "50 шоп-коинов",
    action: "помочь дракону",
  },
};

const mapObjects = document.querySelectorAll(".map-object");
const itemWindow = document.getElementById("itemWindow");
const itemInfo = document.getElementById("itemInfo");
const closeBtn = document.getElementById("closeBtn");

const itemImage = document.getElementById("itemImage");
const itemName = document.getElementById("itemName");
const itemOwner = document.getElementById("itemOwner");
const itemPrice = document.getElementById("itemPrice");
const itemAction = document.getElementById("itemAction");

mapObjects.forEach((button) => {
  button.addEventListener("click", () => {
    const key = button.dataset.object;
    const item = itemsData[key];

    itemImage.src = item.image;
    itemImage.alt = item.name;
    itemName.textContent = item.name;
    itemOwner.textContent = item.owner;
    itemPrice.textContent = item.price;
    itemAction.textContent = item.action;

    itemWindow.classList.add("active");
    itemInfo.classList.add("active");
  });
});

closeBtn.addEventListener("click", () => {
  itemWindow.classList.remove("active");
  itemInfo.classList.remove("active");
});

// горы
localStorage.removeItem("game1Passed");
const mountainsGame = document.getElementById("mountainsGame");
const itemsLayer = document.getElementById("itemsLayer");
const gameModal = document.getElementById("gameModal");
const gameModalTitle = document.getElementById("gameModalTitle");
const gameModalText = document.getElementById("gameModalText");
const restartGameBtn = document.getElementById("restartGameBtn");
const okGameBtn = document.getElementById("okGameBtn");

const TOTAL_ITEMS = 15;

const itemImages = [
  "../images/falling-book.svg",
  "../images/falling-crown.svg",
  "../images/falling-guitar.svg",
  "../images/falling-map.svg",
  "../images/falling-sword.svg",
];

let gameStarted = false;
let gameCompletedSuccessfully = false;
let spawnedCount = 0;
let finishedCount = 0;
let caughtCount = 0;
let missedCount = 0;
let spawnTimer = null;
let activeAnimations = new Set();

function resetGameState() {
  clearInterval(spawnTimer);
  spawnTimer = null;

  activeAnimations.forEach((id) => cancelAnimationFrame(id));
  activeAnimations.clear();

  itemsLayer.innerHTML = "";

  spawnedCount = 0;
  finishedCount = 0;
  caughtCount = 0;
  missedCount = 0;
  gameStarted = false;
}

function startGame() {
  if (gameStarted || gameCompletedSuccessfully) return;

  resetGameState();
  gameStarted = true;

  const startLabel = mountainsGame.querySelector(".game-start");
  if (startLabel) startLabel.textContent = "Лови предметы";

  spawnTimer = setInterval(() => {
    if (spawnedCount >= TOTAL_ITEMS) {
      clearInterval(spawnTimer);
      spawnTimer = null;
      return;
    }

    spawnFallingItem();
    spawnedCount++;
  }, 850);
}

function spawnFallingItem() {
  const itemWrap = document.createElement("div");
  itemWrap.className = "falling-item-wrap";

  const item = document.createElement("img");
  item.className = "falling-item";

  const randomImage = itemImages[Math.floor(Math.random() * itemImages.length)];
  item.src = randomImage;
  item.alt = "item";

  itemWrap.appendChild(item);
  itemsLayer.appendChild(itemWrap);

  const gameRect = mountainsGame.getBoundingClientRect();

  const itemSize = gameRect.width * 0.05;
  const clickSize = itemSize * 1.8;
  const maxLeft = gameRect.width - clickSize;

  const left = Math.random() * maxLeft;

  const duration = 4200 + Math.random() * 1800;

  itemWrap.style.left = `${left}px`;
  itemWrap.style.width = `${clickSize}px`;
  itemWrap.style.height = `${clickSize}px`;

  item.style.width = `${itemSize}px`;
  item.style.height = `${itemSize}px`;

  let startTime = null;
  let wasCaught = false;
  let animationId = null;

  itemWrap.addEventListener("click", (e) => {
    e.stopPropagation();
    if (wasCaught) return;

    wasCaught = true;
    caughtCount++;
    finishedCount++;

    itemWrap.classList.add("caught");
    setTimeout(() => itemWrap.remove(), 180);

    checkGameEnd();
  });

  function animate(timestamp) {
    if (!startTime) startTime = timestamp;

    const elapsed = timestamp - startTime;
    const progress = elapsed / duration;

    if (wasCaught) return;

    if (progress >= 1) {
      missedCount++;
      finishedCount++;
      itemWrap.remove();
      checkGameEnd();
      return;
    }

    const top = progress * (gameRect.height + clickSize) - clickSize;
    itemWrap.style.top = `${top}px`;

    animationId = requestAnimationFrame(animate);
    activeAnimations.add(animationId);
  }

  animationId = requestAnimationFrame(animate);
  activeAnimations.add(animationId);
}

function checkGameEnd() {
  if (finishedCount < TOTAL_ITEMS) return;

  gameStarted = false;
  clearInterval(spawnTimer);
  spawnTimer = null;

  const startLabel = mountainsGame.querySelector(".game-start");

  if (missedCount === 0 && caughtCount === TOTAL_ITEMS) {
    gameCompletedSuccessfully = true;
    localStorage.setItem("game1Passed", "true");

    if (startLabel) {
      startLabel.textContent = "Игра пройдена";
    }

    showModal("Игра пройдена", "Ты поймал все предметы.", "success");

    spawnRewardItem();
  } else {
    localStorage.setItem("game1Passed", "false");

    if (startLabel) {
      startLabel.textContent = "Нажми, чтобы начать";
    }

    showModal(
      "Игра не пройдена",
      `Поймано: ${caughtCount} из ${TOTAL_ITEMS}. Попробуй ещё раз.`,
      "fail",
    );
  }
}

function showModal(title, text, mode) {
  gameModalTitle.textContent = title;
  gameModalText.textContent = text;

  if (mode === "success") {
    restartGameBtn.classList.add("hidden-btn");
    okGameBtn.classList.remove("hidden-btn");
  } else {
    restartGameBtn.classList.remove("hidden-btn");
    okGameBtn.classList.add("hidden-btn");
  }

  gameModal.classList.remove("hidden");
}

function hideModal() {
  gameModal.classList.add("hidden");
}

mountainsGame.addEventListener("click", () => {
  if (gameCompletedSuccessfully) return;
  if (!gameStarted) startGame();
});

restartGameBtn.addEventListener("click", () => {
  hideModal();
  resetGameState();
  startGame();
});

okGameBtn.addEventListener("click", () => {
  hideModal();
});

const rewardContainer = document.getElementById("rewardContainer");

function spawnRewardItem() {
  if (!rewardContainer) return;

  if (rewardContainer.querySelector(".reward-item")) return;

  const reward = document.createElement("img");
  reward.src = "../images/sword.svg";
  reward.alt = "Новый предмет";
  reward.className = "reward-item";
  rewardContainer.appendChild(reward);
}

if (localStorage.getItem("game1Passed") === "true") {
  gameCompletedSuccessfully = true;
  spawnRewardItem();
}

// елки
const forestGame = document.getElementById("forestGame");
const treesLayer = document.getElementById("treesLayer");
const dragonPlayer = document.getElementById("dragonPlayer");

const forestModal = document.getElementById("forestModal");
const forestModalTitle = document.getElementById("forestModalTitle");
const forestModalText = document.getElementById("forestModalText");
const restartForestBtn = document.getElementById("restartForestBtn");
const okForestBtn = document.getElementById("okForestBtn");

const forestRewardContainer = document.getElementById("forestRewardContainer");

const TOTAL_TREES = 15;

const treeImages = [
  "../images/tree_1.svg",
  "../images/tree_2.svg",
  "../images/tree_3.svg",
];

let forestStarted = false;
let forestCompletedSuccessfully = false;
let forestCollisionHappened = false;

let treeSpawnedCount = 0;
let treeFinishedCount = 0;
let treeSpawnTimer = null;
let activeTreeAnimations = new Set();

let isDraggingDragon = false;
let dragonOffsetY = 0;

localStorage.removeItem("forestGamePassed");

function resetDragonPosition() {
  if (!dragonPlayer || !forestGame) return;

  const gameRect = forestGame.getBoundingClientRect();
  const dragonRect = dragonPlayer.getBoundingClientRect();
  const startTop = (gameRect.height - dragonRect.height) / 2;

  dragonPlayer.style.left = "1.2vw";
  dragonPlayer.style.top = `${startTop}px`;
  dragonPlayer.style.transform = "none";
}

function resetForestGameState() {
  clearInterval(treeSpawnTimer);
  treeSpawnTimer = null;

  activeTreeAnimations.forEach((id) => cancelAnimationFrame(id));
  activeTreeAnimations.clear();

  if (treesLayer) {
    treesLayer.innerHTML = "";
  }

  forestStarted = false;
  forestCollisionHappened = false;
  treeSpawnedCount = 0;
  treeFinishedCount = 0;
  isDraggingDragon = false;

  resetDragonPosition();
}

function showForestModal(title, text, mode) {
  if (!forestModal || !forestModalTitle || !forestModalText) return;

  forestModalTitle.textContent = title;
  forestModalText.textContent = text;

  if (mode === "success") {
    if (restartForestBtn) restartForestBtn.classList.add("hidden-btn");
    if (okForestBtn) okForestBtn.classList.remove("hidden-btn");
  } else {
    if (restartForestBtn) restartForestBtn.classList.remove("hidden-btn");
    if (okForestBtn) okForestBtn.classList.add("hidden-btn");
  }

  forestModal.classList.remove("hidden");
}

function hideForestModal() {
  if (!forestModal) return;
  forestModal.classList.add("hidden");
}

function spawnForestRewardItem() {
  if (!forestRewardContainer) return;

  if (forestRewardContainer.querySelector(".reward-item")) return;

  const reward = document.createElement("img");
  reward.src = "../images/blouse.svg";
  reward.alt = "Новый предмет";
  reward.className = "reward-item";
  forestRewardContainer.appendChild(reward);
}

function rectsIntersect(rect1, rect2) {
  const dragonHitbox = {
    left: rect1.left + rect1.width * 0.22,
    right: rect1.right - rect1.width * 0.22,
    top: rect1.top + rect1.height * 0.2,
    bottom: rect1.bottom - rect1.height * 0.2,
  };

  const treeHitbox = {
    left: rect2.left + rect2.width * 0.28,
    right: rect2.right - rect2.width * 0.28,
    top: rect2.top + rect2.height * 0.12,
    bottom: rect2.bottom - rect2.height * 0.12,
  };

  return !(
    dragonHitbox.right < treeHitbox.left ||
    dragonHitbox.left > treeHitbox.right ||
    dragonHitbox.bottom < treeHitbox.top ||
    dragonHitbox.top > treeHitbox.bottom
  );
}

function checkDragonCollision(tree) {
  if (!dragonPlayer || !tree || forestCollisionHappened || !forestStarted) {
    return;
  }

  const dragonRect = dragonPlayer.getBoundingClientRect();
  const treeRect = tree.getBoundingClientRect();

  if (rectsIntersect(dragonRect, treeRect)) {
    forestCollisionHappened = true;
    endForestGameFail();
  }
}

function spawnTreePair() {
  if (!forestGame || !treesLayer || !dragonPlayer) return;

  const gameRect = forestGame.getBoundingClientRect();
  const dragonRect = dragonPlayer.getBoundingClientRect();

  const treeWidth = gameRect.width * 0.085;
  const treeHeight = treeWidth * 1.5;

  const safeMarginTop = 12;
  const safeMarginBottom = 12;

  const gapHeight = dragonRect.height * 1.6;

  const minGapTop = safeMarginTop + treeHeight * 0.45;
  const maxGapTop =
    gameRect.height - safeMarginBottom - gapHeight - treeHeight * 0.45;

  const gapTop = minGapTop + Math.random() * Math.max(1, maxGapTop - minGapTop);
  const gapBottom = gapTop + gapHeight;

  const topTree = document.createElement("img");
  topTree.className = "tree-obstacle tree-obstacle--top";
  topTree.src = treeImages[Math.floor(Math.random() * treeImages.length)];
  topTree.alt = "Ёлка";

  const bottomTree = document.createElement("img");
  bottomTree.className = "tree-obstacle tree-obstacle--bottom";
  bottomTree.src = treeImages[Math.floor(Math.random() * treeImages.length)];
  bottomTree.alt = "Ёлка";

  treesLayer.appendChild(topTree);
  treesLayer.appendChild(bottomTree);

  topTree.style.width = `${treeWidth}px`;
  bottomTree.style.width = `${treeWidth}px`;

  topTree.style.left = `${gameRect.width + 20}px`;
  bottomTree.style.left = `${gameRect.width + 20}px`;

  topTree.style.top = `${gapTop - treeHeight}px`;

  bottomTree.style.top = `${gapBottom}px`;

  const duration = 4600 + Math.random() * 1200;

  let startTime = null;
  let animationId = null;

  function animate(timestamp) {
    if (!forestStarted || forestCollisionHappened) return;

    if (!startTime) startTime = timestamp;

    const elapsed = timestamp - startTime;
    const progress = elapsed / duration;

    if (progress >= 1) {
      topTree.remove();
      bottomTree.remove();
      treeFinishedCount++;
      checkForestGameEnd();
      return;
    }

    const left =
      gameRect.width + 20 - progress * (gameRect.width + treeWidth + 60);

    topTree.style.left = `${left}px`;
    bottomTree.style.left = `${left}px`;

    checkDragonCollision(topTree);
    checkDragonCollision(bottomTree);

    animationId = requestAnimationFrame(animate);
    activeTreeAnimations.add(animationId);
  }

  animationId = requestAnimationFrame(animate);
  activeTreeAnimations.add(animationId);
}

function checkForestGameEnd() {
  if (forestCollisionHappened) return;
  if (treeFinishedCount < TOTAL_TREES) return;

  endForestGameSuccess();
}

function endForestGameFail() {
  if (!forestStarted) return;

  forestStarted = false;
  clearInterval(treeSpawnTimer);
  treeSpawnTimer = null;

  activeTreeAnimations.forEach((id) => cancelAnimationFrame(id));
  activeTreeAnimations.clear();

  localStorage.setItem("forestGamePassed", "false");

  const startLabel = forestGame?.querySelector(".game-start--forest");
  if (startLabel) {
    startLabel.textContent = "Нажми, чтобы начать";
  }

  showForestModal(
    "Игра не пройдена",
    "Дракон столкнулся с ёлкой. Попробуй ещё раз.",
    "fail",
  );
}

function endForestGameSuccess() {
  forestStarted = false;
  forestCompletedSuccessfully = true;

  clearInterval(treeSpawnTimer);
  treeSpawnTimer = null;

  activeTreeAnimations.forEach((id) => cancelAnimationFrame(id));
  activeTreeAnimations.clear();

  localStorage.setItem("forestGamePassed", "true");

  const startLabel = forestGame?.querySelector(".game-start--forest");
  if (startLabel) {
    startLabel.textContent = "Игра пройдена";
  }

  spawnForestRewardItem();

  showForestModal(
    "Игра пройдена",
    "Ты успешно провел дракона между ёлками. В\u00A0корзине тебя ждет новая одежда.",
    "success",
  );
}

function startForestGame() {
  if (!forestGame || !treesLayer || !dragonPlayer) return;
  if (forestStarted || forestCompletedSuccessfully) return;

  resetForestGameState();
  forestStarted = true;

  const startLabel = forestGame.querySelector(".game-start--forest");
  if (startLabel) {
    startLabel.textContent = "Веди дракона";
  }

  treeSpawnTimer = setInterval(() => {
    if (treeSpawnedCount >= TOTAL_TREES) {
      clearInterval(treeSpawnTimer);
      treeSpawnTimer = null;
      return;
    }

    spawnTreePair();
    treeSpawnedCount++;
  }, 950);
}

function startDragonDrag(e) {
  if (!forestStarted || forestCompletedSuccessfully || !dragonPlayer) return;

  e.preventDefault();
  e.stopPropagation();

  const dragonRect = dragonPlayer.getBoundingClientRect();

  isDraggingDragon = true;
  dragonPlayer.classList.add("dragging");
  dragonOffsetY = e.clientY - dragonRect.top;
}

function moveDragon(e) {
  if (!isDraggingDragon || !forestGame || !dragonPlayer) return;

  e.preventDefault();

  const gameRect = forestGame.getBoundingClientRect();
  const dragonHeight = dragonPlayer.offsetHeight;

  let newTop = e.clientY - gameRect.top - dragonOffsetY;

  if (newTop < 0) newTop = 0;
  if (newTop > gameRect.height - dragonHeight) {
    newTop = gameRect.height - dragonHeight;
  }

  dragonPlayer.style.top = `${newTop}px`;
}

function stopDragonDrag() {
  isDraggingDragon = false;
  if (dragonPlayer) {
    dragonPlayer.classList.remove("dragging");
  }
}

if (forestGame) {
  forestGame.addEventListener("click", (e) => {
    if (e.target === dragonPlayer) return;

    if (!forestStarted && !forestCompletedSuccessfully) {
      startForestGame();
    }
  });
}

if (dragonPlayer) {
  dragonPlayer.addEventListener("mousedown", startDragonDrag);
}

document.addEventListener("mousemove", moveDragon);
document.addEventListener("mouseup", stopDragonDrag);

if (restartForestBtn) {
  restartForestBtn.addEventListener("click", () => {
    hideForestModal();
    resetForestGameState();
    startForestGame();
  });
}

if (okForestBtn) {
  okForestBtn.addEventListener("click", () => {
    hideForestModal();
  });
}

if (
  forestRewardContainer &&
  localStorage.getItem("forestGamePassed") === "true"
) {
  spawnForestRewardItem();
}

//лабиринт
const mazeGame = document.getElementById("mazeGame");
const mazeBg = document.querySelector(".maze-bg");
const mazeDragon = document.getElementById("mazeDragon");
const mazeCastle = document.getElementById("mazeCastle");

const mazeUpBtn = document.getElementById("mazeUpBtn");
const mazeDownBtn = document.getElementById("mazeDownBtn");
const mazeLeftBtn = document.getElementById("mazeLeftBtn");
const mazeRightBtn = document.getElementById("mazeRightBtn");

const mazeModal = document.getElementById("mazeModal");
const mazeModalTitle = document.getElementById("mazeModalTitle");
const mazeModalText = document.getElementById("mazeModalText");
const okMazeBtn = document.getElementById("okMazeBtn");

const mazeRewardContainer = document.getElementById("mazeRewardContainer");

let mazeStarted = false;
let mazeCompletedSuccessfully = false;

localStorage.removeItem("mazeGamePassed");

const MAZE_COLS = 17;
const MAZE_ROWS = 17;

// 0 = проход, 1 = стена
const mazeMap = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], //1
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], //2
  [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1], //3
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1], //4
  [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1], //5
  [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1], //6
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1], //7
  [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1], //8
  [1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1], //9
  [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0], //10
  [1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1], //11
  [1, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1], //12
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1], //13
  [1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1], //14
  [1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1], //15
  [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1], //16
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], //17
];

let dragonCell = { col: 16, row: 9 };

const castleCell = { col: 1, row: 15 };

function cellToPosition(col, row) {
  if (!mazeGame || !mazeBg) {
    return {
      left: 0,
      top: 0,
      cellWidth: 0,
      cellHeight: 0,
    };
  }

  const gameRect = mazeGame.getBoundingClientRect();
  const bgRect = mazeBg.getBoundingClientRect();
  const offsetLeft = bgRect.left - gameRect.left;
  const offsetTop = bgRect.top - gameRect.top;

  const innerOffsetX = 0;
  const innerOffsetY = 0;
  const innerWidth = bgRect.width;
  const innerHeight = bgRect.height;

  const cellWidth = innerWidth / MAZE_COLS;
  const cellHeight = innerHeight / MAZE_ROWS;

  return {
    left: offsetLeft + innerOffsetX + col * cellWidth + cellWidth * 0.1,
    top: offsetTop + innerOffsetY + row * cellHeight + cellHeight * 0.08,
    cellWidth,
    cellHeight,
  };
}

const MAZE_BASE_WIDTH = 660;
const MAZE_BASE_HEIGHT = 650;

function placeMazeObjects() {
  if (!mazeGame || !mazeDragon || !mazeCastle) return;

  const dragonPos = cellToPosition(dragonCell.col, dragonCell.row);
  const castlePos = cellToPosition(castleCell.col, castleCell.row);

  const scaleX = mazeGame.offsetWidth / MAZE_BASE_WIDTH;
  const scaleY = mazeGame.offsetHeight / MAZE_BASE_HEIGHT;

  mazeDragon.style.left = `${dragonPos.left - 100 * scaleX}px`;
  mazeDragon.style.top = `${dragonPos.top - 90 * scaleY}px`;

  mazeCastle.style.left = `${castlePos.left - 170 * scaleX}px`;
  mazeCastle.style.top = `${castlePos.top - 160 * scaleY}px`;
}

function resetMazeGameState() {
  mazeStarted = false;
  dragonCell = { col: 16, row: 9 };
  placeMazeObjects();
}

function showMazeModal(title, text) {
  if (!mazeModal || !mazeModalTitle || !mazeModalText) return;

  mazeModalTitle.textContent = title;
  mazeModalText.textContent = text;
  mazeModal.classList.remove("hidden");
}

function hideMazeModal() {
  if (!mazeModal) return;
  mazeModal.classList.add("hidden");
}

function spawnMazeRewardItem() {
  if (!mazeRewardContainer) return;
  if (mazeRewardContainer.querySelector(".reward-item")) return;

  const reward = document.createElement("img");
  reward.src = "../images/armor2.svg";
  reward.alt = "Новый предмет";
  reward.className = "reward-item";
  mazeRewardContainer.appendChild(reward);
}

function startMazeGame() {
  if (mazeCompletedSuccessfully) return;

  mazeStarted = true;

  const startLabel = mazeGame?.querySelector(".game-start--maze");
  if (startLabel) {
    startLabel.textContent = "Веди дракона к замку";
  }

  placeMazeObjects();
}

function canMoveTo(col, row) {
  if (col < 0 || col >= MAZE_COLS || row < 0 || row >= MAZE_ROWS) {
    return false;
  }

  return mazeMap[row][col] === 0;
}

function checkMazeWin() {
  if (dragonCell.col === castleCell.col && dragonCell.row === castleCell.row) {
    mazeCompletedSuccessfully = true;
    mazeStarted = false;

    localStorage.setItem("mazeGamePassed", "true");

    const startLabel = mazeGame?.querySelector(".game-start--maze");
    if (startLabel) {
      startLabel.textContent = "Игра пройдена";
    }

    spawnMazeRewardItem();

    showMazeModal(
      "Игра пройдена",
      "Ты успешно довел дракона до замка. В\u00A0корзине тебя ждет новая одежда.",
    );
  }
}

function moveDragonInMaze(dx, dy) {
  if (mazeCompletedSuccessfully) return;

  if (!mazeStarted) {
    startMazeGame();
  }

  const newCol = dragonCell.col + dx;
  const newRow = dragonCell.row + dy;

  if (!canMoveTo(newCol, newRow)) return;

  dragonCell = { col: newCol, row: newRow };
  placeMazeObjects();
  checkMazeWin();
}

if (mazeUpBtn) {
  mazeUpBtn.addEventListener("click", () => {
    moveDragonInMaze(0, -1);
  });
}

if (mazeDownBtn) {
  mazeDownBtn.addEventListener("click", () => {
    moveDragonInMaze(0, 1);
  });
}

if (mazeLeftBtn) {
  mazeLeftBtn.addEventListener("click", () => {
    moveDragonInMaze(-1, 0);
  });
}

if (mazeRightBtn) {
  mazeRightBtn.addEventListener("click", () => {
    moveDragonInMaze(1, 0);
  });
}

if (okMazeBtn) {
  okMazeBtn.addEventListener("click", () => {
    hideMazeModal();
  });
}

window.addEventListener("load", () => {
  placeMazeObjects();

  if (
    mazeRewardContainer &&
    localStorage.getItem("mazeGamePassed") === "true"
  ) {
    mazeCompletedSuccessfully = true;
    spawnMazeRewardItem();

    const startLabel = mazeGame?.querySelector(".game-start--maze");
    if (startLabel) {
      startLabel.textContent = "Игра пройдена";
    }
  }
});

window.addEventListener("resize", () => {
  placeMazeObjects();
});

//мудрый старец
const sageScene = document.getElementById("sageScene");
const sageOldman = document.getElementById("sageOldman");
const sageTopLabel = document.getElementById("sageTopLabel");
const sageSpeech = document.getElementById("sageSpeech");
const sageRewardContainer = document.getElementById("sageRewardContainer");

const sageLines = [
  "Кто не спешит, тот чаще приходит вовремя.",
  "Слушай тишину\u00A0— в ней прячется верный ответ.",
  "Даже маленький шаг лучше красивой мысли без дела.",
  "Не спорь с\u00A0дорогой — просто смотри, куда она ведет.",
  "Смелость растет там, где\u00A0ты идешь дальше страха.",
];

let sageCurrentLineIndex = 0;
let sageCompletedSuccessfully = false;
let sageCanAdvance = true;
let sageShowingPause = false;
let sageTimeoutId = null;

localStorage.removeItem("sageWisdomPassed");

function spawnSageRewardItem() {
  if (!sageRewardContainer) return;
  if (sageRewardContainer.querySelector(".reward-item")) return;

  const reward = document.createElement("img");
  reward.src = "../images/armor.svg";
  reward.alt = "Новый предмет";
  reward.className = "reward-item";
  sageRewardContainer.appendChild(reward);
}

function clearSageTimer() {
  if (sageTimeoutId) {
    clearTimeout(sageTimeoutId);
    sageTimeoutId = null;
  }
}

function setSageSpeech(text) {
  if (!sageSpeech) return;

  sageSpeech.textContent = text;
  sageSpeech.classList.remove("hidden");

  sageSpeech.classList.remove("sage-speech--pause", "sage-speech--final");

  if (text === "а еще...") {
    sageSpeech.classList.add("sage-speech--pause");
  }

  if (text === "все, иди с богом") {
    sageSpeech.classList.add("sage-speech--final");
  }
}

function showNextSageLine() {
  if (!sageSpeech || !sageTopLabel) return;
  if (sageCompletedSuccessfully) return;
  if (!sageCanAdvance) return;

  sageCanAdvance = false;
  sageShowingPause = false;

  const line = sageLines[sageCurrentLineIndex];
  setSageSpeech(line);
  if (sageCurrentLineIndex < sageLines.length - 1) {
    sageTimeoutId = setTimeout(() => {
      setSageSpeech("а еще...");
      sageShowingPause = true;
      sageCurrentLineIndex += 1;
      sageCanAdvance = true;
    }, 1600);
    return;
  }

  sageTimeoutId = setTimeout(() => {
    setSageSpeech("все, иди с богом");
    sageCompletedSuccessfully = true;
    localStorage.setItem("sageWisdomPassed", "true");

    if (sageTopLabel) {
      sageTopLabel.textContent = "теперь ты познал мудрость";
    }

    spawnSageRewardItem();
  }, 1700);
}

if (sageOldman) {
  sageOldman.addEventListener("click", () => {
    if (sageCompletedSuccessfully) return;
    showNextSageLine();
  });
}

window.addEventListener("load", () => {
  if (
    sageRewardContainer &&
    localStorage.getItem("sageWisdomPassed") === "true"
  ) {
    sageCompletedSuccessfully = true;

    if (sageTopLabel) {
      sageTopLabel.textContent = "теперь ты познал мудрость";
    }

    setSageSpeech("все, иди с богом");
    spawnSageRewardItem();
  }
});

window.addEventListener("beforeunload", () => {
  clearSageTimer();
});

//манекен и корзина
document.addEventListener("DOMContentLoaded", () => {
  const basket = document.getElementById("basket");
  const clothesPile = document.getElementById("clothesPile");
  const mannequinZone = document.getElementById("mannequinZone");
  const outfitStage = document.getElementById("outfitStage");

  const sceneItems = [
    {
      el: document.getElementById("itemArmor2"),
      mannequinLeft: "48.5%",
      mannequinTop: "22vw",
    },
    {
      el: document.getElementById("itemArmor"),
      mannequinLeft: "48.2%",
      mannequinTop: "15vw",
    },
    {
      el: document.getElementById("itemBlouse"),
      mannequinLeft: "49.2%",
      mannequinTop: "10.4vw",
    },
    {
      el: document.getElementById("itemSword"),
      mannequinLeft: "57%",
      mannequinTop: "23vw",
    },
  ];

  let basketOpened = false;

  basket.addEventListener("click", () => {
    if (basketOpened) return;
    basketOpened = true;

    // скрываем кучку в корзине
    clothesPile.classList.add("is-hidden");

    sceneItems.forEach((item, index) => {
      setTimeout(() => {
        item.el.classList.remove("hidden");
        item.el.classList.add("visible");
      }, index * 120);
    });
  });

  sceneItems.forEach(({ el, mannequinLeft, mannequinTop }) => {
    makeDraggable(el, mannequinLeft, mannequinTop);
  });

  function makeDraggable(element, mannequinLeft, mannequinTop) {
    let isDragging = false;
    let shiftX = 0;
    let shiftY = 0;

    element.addEventListener("pointerdown", (e) => {
      if (element.classList.contains("hidden")) return;

      isDragging = true;
      element.classList.add("dragging");

      const rect = element.getBoundingClientRect();
      shiftX = e.clientX - rect.left;
      shiftY = e.clientY - rect.top;

      element.setPointerCapture(e.pointerId);
    });

    element.addEventListener("pointermove", (e) => {
      if (!isDragging) return;

      const stageRect = outfitStage.getBoundingClientRect();

      let left = e.clientX - stageRect.left - shiftX;
      let top = e.clientY - stageRect.top - shiftY;

      const maxLeft = stageRect.width - element.offsetWidth;
      const maxTop = stageRect.height - element.offsetHeight;

      left = Math.max(0, Math.min(left, maxLeft));
      top = Math.max(0, Math.min(top, maxTop));

      element.style.left = `${left}px`;
      element.style.top = `${top}px`;

      if (isOverMannequin(element, mannequinZone)) {
        mannequinZone.classList.add("drop-hover");
      } else {
        mannequinZone.classList.remove("drop-hover");
      }
    });

    element.addEventListener("pointerup", (e) => {
      if (!isDragging) return;

      isDragging = false;
      element.classList.remove("dragging");
      mannequinZone.classList.remove("drop-hover");
      element.releasePointerCapture(e.pointerId);

      if (isOverMannequin(element, mannequinZone)) {
        snapToMannequin(element, mannequinLeft, mannequinTop);
      }
    });

    element.addEventListener("pointercancel", () => {
      isDragging = false;
      element.classList.remove("dragging");
      mannequinZone.classList.remove("drop-hover");
    });
  }

  function isOverMannequin(item, target) {
    const itemRect = item.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    const itemCenterX = itemRect.left + itemRect.width / 2;
    const itemCenterY = itemRect.top + itemRect.height / 2;

    return (
      itemCenterX > targetRect.left &&
      itemCenterX < targetRect.right &&
      itemCenterY > targetRect.top &&
      itemCenterY < targetRect.bottom
    );
  }

  function snapToMannequin(element, left, top) {
    element.style.left = left;
    element.style.top = top;
  }
});
