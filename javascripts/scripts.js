//console.log("JS есть");//
//окошко
window.onload = function () {
  const startBtn = document.getElementById("openModal");
  // Список всех ID окон в нужном порядке
  const windowIds = ["win-1", "win-2", "win-3", "win-4"];
  let currentStep = 0;

  if (startBtn) {
    startBtn.onclick = function () {
      // 1. Проверяем, если дошли до конца списка — сбрасываем на начало
      if (currentStep >= windowIds.length) {
        currentStep = 0;
        console.log("Цикл завершен, начинаем заново с первого окна");
      }

      const nextId = windowIds[currentStep];
      const win = document.getElementById(nextId);

      if (win) {
        // 2. Принудительно ставим display: block, даже если окно было закрыто
        win.style.display = "block";

        // 3. Выводим окно на передний план (увеличиваем z-index)
        // Используем дату или счетчик, чтобы новое окно всегда было сверху
        win.style.zIndex = 1000 + currentStep + (new Date().getTime() % 100);

        console.log(
          `Открыто окно: ${nextId}. Шаг: ${currentStep + 1} из ${windowIds.length}`,
        );

        // Переходим к следующему индексу
        currentStep++;
      }
    };
  }

  // Обработчик закрытия (остается прежним)
  document.addEventListener("click", (e) => {
    // Проверяем клик по крестику или кнопке OK
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

  // падение медленнее
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

// появление скрытого меча
const rewardContainer = document.getElementById("rewardContainer");

function spawnRewardItem() {
  if (!rewardContainer) return;

  // чтобы предмет не добавлялся повторно
  if (rewardContainer.querySelector(".reward-item")) return;

  const reward = document.createElement("img");
  reward.src = "../images/sword.svg";
  reward.alt = "Новый предмет";
  reward.className = "reward-item";
  rewardContainer.appendChild(reward);
}

// если страница/экран открылись позже, предмет всё равно появится
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

// уменьшенные хитбоксы, чтобы столкновение не было слишком жестким
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

// спавн пары елок с гарантированным проходом
function spawnTreePair() {
  if (!forestGame || !treesLayer || !dragonPlayer) return;

  const gameRect = forestGame.getBoundingClientRect();
  const dragonRect = dragonPlayer.getBoundingClientRect();

  const treeWidth = gameRect.width * 0.085;
  const treeHeight = treeWidth * 1.5;

  const safeMarginTop = 12;
  const safeMarginBottom = 12;

  // проход больше дракона
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

  // верхняя ёлка
  topTree.style.top = `${gapTop - treeHeight}px`;

  // нижняя ёлка
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

// ===== ПЕРЕТАСКИВАНИЕ ДРАКОНА =====

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

// ===== ОБРАБОТЧИКИ =====

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

// появление блузки
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

// Более точная квадратная сетка
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

// старт справа
let dragonCell = { col: 16, row: 9 };

// замок слева снизу
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

  // положение картинки лабиринта внутри общего блока
  const offsetLeft = bgRect.left - gameRect.left;
  const offsetTop = bgRect.top - gameRect.top;

  // если у SVG есть внутренние пустые поля, можно будет подправить эти значения
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

function placeMazeObjects() {
  if (!mazeGame || !mazeDragon || !mazeCastle) return;

  const dragonPos = cellToPosition(dragonCell.col, dragonCell.row);
  const castlePos = cellToPosition(castleCell.col, castleCell.row);

  mazeDragon.style.left = `${dragonPos.left - 160}px`;
  mazeDragon.style.top = `${dragonPos.top - 110}px`;

  mazeCastle.style.left = `${castlePos.left - 260}px`;
  mazeCastle.style.top = `${castlePos.top - 160}px`;
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

  // если это не последняя реплика — потом показываем "а еще..."
  if (sageCurrentLineIndex < sageLines.length - 1) {
    sageTimeoutId = setTimeout(() => {
      setSageSpeech("а еще...");
      sageShowingPause = true;
      sageCurrentLineIndex += 1;
      sageCanAdvance = true;
    }, 1600);
    return;
  }

  // после пятой реплики — финальная фраза
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
const basket = document.getElementById("basket");
const basketPreview = document.getElementById("basketPreview");
const spawnLayer = document.getElementById("spawnLayer");
const mannequinZone = document.getElementById("mannequinZone");

const placedBlouse = document.getElementById("placedBlouse");
const placedArmor2 = document.getElementById("placedArmor2");
const placedArmor = document.getElementById("placedArmor");
const placedSword = document.getElementById("placedSword");

let basketOpened = false;
let activeDragItem = null;
let dragOffsetX = 0;
let dragOffsetY = 0;
let outfitCompleted = false;

const earnedItems = [];

if (localStorage.getItem("game1Passed") === "true") {
  earnedItems.push({ key: "armor", src: "./images/armor.svg" });
}

if (localStorage.getItem("forestGamePassed") === "true") {
  earnedItems.push({ key: "blouse", src: "./images/blouse.svg" });
}

if (localStorage.getItem("mazeGamePassed") === "true") {
  earnedItems.push({ key: "armor2", src: "./images/armor2.svg" });
}

if (localStorage.getItem("sageWisdomPassed") === "true") {
  earnedItems.push({ key: "sword", src: "./images/sword.svg" });
}

// превью предметов внутри корзины
function renderBasketPreview() {
  if (!basketPreview) return;

  basketPreview.innerHTML = "";

  earnedItems.forEach((item) => {
    const img = document.createElement("img");
    img.src = item.src;
    img.alt = item.key;

    if (item.key === "blouse") {
      img.style.width = "3.2vw";
      img.style.left = "0.2vw";
      img.style.bottom = "1.2vw";
    }

    if (item.key === "armor") {
      img.style.width = "2.6vw";
      img.style.left = "2.7vw";
      img.style.bottom = "1vw";
    }

    if (item.key === "armor2") {
      img.style.width = "3.2vw";
      img.style.left = "4.3vw";
      img.style.bottom = "0.9vw";
    }

    if (item.key === "sword") {
      img.style.width = "1vw";
      img.style.left = "5.8vw";
      img.style.bottom = "0.7vw";
      img.style.transform = "rotate(25deg)";
    }

    basketPreview.appendChild(img);
  });
}

function spawnItemsFromBasket() {
  if (!spawnLayer) return;

  basketOpened = true;

  const positions = {
    armor2: { left: 21.8, top: 2.5, width: 5.8 },
    blouse: { left: 25.5, top: 2.2, width: 5.2 },
    sword: { left: 24.5, top: 7.8, width: 1.3 },
    armor: { left: 27.2, top: 8.3, width: 3.2 },
  };

  const order = ["armor2", "blouse", "sword", "armor"];

  order.forEach((key) => {
    const item = earnedItems.find((x) => x.key === key);
    if (!item) return;

    const img = document.createElement("img");
    img.src = item.src;
    img.alt = item.key;
    img.dataset.itemKey = item.key;
    img.className = "draggable-item";

    img.style.left = `${positions[key].left}vw`;
    img.style.top = `${positions[key].top}vw`;
    img.style.width = `${positions[key].width}vw`;

    img.addEventListener("mousedown", startDragItem);
    spawnLayer.appendChild(img);
  });
}

function startDragItem(e) {
  if (outfitCompleted) return;

  activeDragItem = e.currentTarget;
  activeDragItem.classList.add("dragging");

  const rect = activeDragItem.getBoundingClientRect();
  dragOffsetX = e.clientX - rect.left;
  dragOffsetY = e.clientY - rect.top;
}

function moveDragItem(e) {
  if (!activeDragItem || !spawnLayer) return;

  const stageRect = spawnLayer.getBoundingClientRect();

  const left = e.clientX - stageRect.left - dragOffsetX;
  const top = e.clientY - stageRect.top - dragOffsetY;

  activeDragItem.style.left = `${left}px`;
  activeDragItem.style.top = `${top}px`;
}

function stopDragItem() {
  if (!activeDragItem) return;

  activeDragItem.classList.remove("dragging");

  const itemKey = activeDragItem.dataset.itemKey;
  const itemRect = activeDragItem.getBoundingClientRect();
  const mannequinRect = mannequinZone.getBoundingClientRect();

  const intersects = !(
    itemRect.right < mannequinRect.left ||
    itemRect.left > mannequinRect.right ||
    itemRect.bottom < mannequinRect.top ||
    itemRect.top > mannequinRect.bottom
  );

  if (intersects) {
    placeOnMannequin(itemKey);
    activeDragItem.remove();
    checkOutfitComplete();
  }

  activeDragItem = null;
}

function placeOnMannequin(itemKey) {
  if (itemKey === "blouse") {
    placedBlouse.src = "./images/blouse.svg";
    placedBlouse.classList.remove("hidden");
  }

  if (itemKey === "armor2") {
    placedArmor2.src = "./images/armor2.svg";
    placedArmor2.classList.remove("hidden");
  }

  if (itemKey === "armor") {
    placedArmor.src = "./images/armor.svg";
    placedArmor.classList.remove("hidden");
  }

  if (itemKey === "sword") {
    placedSword.src = "./images/sword.svg";
    placedSword.classList.remove("hidden");
  }
}

function checkOutfitComplete() {
  const blouseReady = !placedBlouse.classList.contains("hidden");
  const armor2Ready = !placedArmor2.classList.contains("hidden");
  const armorReady = !placedArmor.classList.contains("hidden");
  const swordReady = !placedSword.classList.contains("hidden");

  if (blouseReady && armor2Ready && armorReady && swordReady) {
    finishOutfitGame();
  }
}

function finishOutfitGame() {
  if (outfitCompleted) return;

  outfitCompleted = true;

  const label = document.createElement("div");
  label.className = "outfit-complete-label";
  label.textContent = "Образ собран";
  spawnLayer.appendChild(label);

  localStorage.setItem("outfitCompleted", "true");
}

if (basket) {
  basket.addEventListener("click", spawnItemsFromBasket);
}

document.addEventListener("mousemove", moveDragItem);
document.addEventListener("mouseup", stopDragItem);

renderBasketPreview();
