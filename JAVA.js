const board = document.getElementById("game-board");
  const timerEl = document.getElementById("timer");
  const modal = document.getElementById("resultModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalText = document.getElementById("modalText");

  let cardsArray = ["🍎","🍌","🍓","🍇","🍒","🍋","🍍","🥝"];
  let cards, firstCard, secondCard, lockBoard, matched, moves, timer, timeLeft;

  function initGame() {
    board.innerHTML = "";
    cards = [...cardsArray, ...cardsArray];
    cards.sort(() => 0.5 - Math.random());
    firstCard = secondCard = null;
    lockBoard = false;
    matched = 0;
    moves = 0;
    timeLeft = 300;

    cards.forEach((emoji) => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.dataset.value = emoji;
      card.textContent = "?";
      board.appendChild(card);
      card.addEventListener("click", () => flipCard(card));
    });

    clearInterval(timer);
    timer = setInterval(updateTimer, 1000);
  }

  function flipCard(card) {
    if (lockBoard || card.classList.contains("flipped")) return;
    card.textContent = card.dataset.value;
    if (!firstCard) {
      firstCard = card;
    } else {
      secondCard = card;
      moves++;
      checkMatch();
    }
  }

  function checkMatch() {
    if (firstCard.dataset.value === secondCard.dataset.value) {
      firstCard.classList.add("flipped");
      secondCard.classList.add("flipped");
      matched += 2;
      resetBoard();
      if (matched === cards.length) endGame(true);
    } else {
      lockBoard = true;
      setTimeout(() => {
        firstCard.textContent = "?";
        secondCard.textContent = "?";
        resetBoard();
      }, 800);
    }
  }

  function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
  }

  function updateTimer() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    timerEl.textContent = `Time Left: ${minutes.toString().padStart(2,"0")}:${seconds.toString().padStart(2,"0")}`;
    timeLeft--;
    if (timeLeft < 0) {
      clearInterval(timer);
      endGame(false);
    }
  }

  function endGame(completed) {
    clearInterval(timer);
    let rating = getRating();
    modal.style.display = "flex";
    if (completed) {
      modalTitle.textContent = "Congratulations! You Won!";
      modalText.textContent = `With ${moves} Moves and ${rating} Stars. 🎉`;
    } else {
      modalTitle.textContent = "Time's Up!";
      modalText.textContent = `With ${moves} Moves and ${rating} Stars.`;
    }
  }

  function getRating() {
    const minMoves = cards.length / 2; 
    if (moves <= minMoves) return 5;
    else if (moves <= minMoves + 2) return 4;
    else if (moves <= minMoves + 4) return 3;
    else if (moves <= minMoves + 6) return 2;
    else return 1;
  }

  function restartGame() {
    modal.style.display = "none";
    initGame();
  }


  initGame();
