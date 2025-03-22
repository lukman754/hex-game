let score = 0;
let totalAnswers = 0;
let correctAnswers = 0;
let correctAnswer = "";
let mode = "hex";
let startTime;
let timerInterval;
let totalTime = 0;
let attemptTimes = [];
let selectedPairIndex = -1;

function startGame() {
  mode = document.getElementById("mode").value;
  let difficulty = document.getElementById("difficulty").value;
  document.getElementById("game").classList.remove("hidden");
  document.getElementById("checkpoint").classList.add("hidden");
  document.getElementById("feedback").textContent = "";
  score = 0;
  totalAnswers = 0;
  correctAnswers = 0;
  totalTime = 0;
  attemptTimes = [];
  document.getElementById("score").textContent = score;
  document.getElementById("accuracy").textContent = "0";
  document.getElementById("history").innerHTML = "";
  document.getElementById("historyMobile").innerHTML = ""; // Clear mobile history too

  // Hide all input types first
  document.getElementById("standardInput").classList.add("hidden");
  document.getElementById("multipleChoiceOptions").classList.add("hidden");
  document.getElementById("rgbHexConverterUI").classList.add("hidden");

  // Show the appropriate input based on mode
  if (mode === "multipleChoice") {
    document.getElementById("multipleChoiceOptions").classList.remove("hidden");
  } else if (mode === "rgbHexConverter") {
    document.getElementById("rgbHexConverterUI").classList.remove("hidden");
    setupRgbHexConverter();
  } else {
    document.getElementById("standardInput").classList.remove("hidden");
  }

  generateQuestion(difficulty);
}

function generateQuestion(difficulty) {
  let questionText = "";
  let numRange =
    difficulty === "easy" ? 100 : difficulty === "medium" ? 256 : 4096;
  document.getElementById("colorPreview").classList.add("hidden");

  if (mode === "multipleChoice") {
    generateMultipleChoiceQuestion(difficulty);
    return;
  } else if (mode === "rgbHexConverter") {
    // This mode doesn't have questions, it's a converter tool
    document.getElementById("question").textContent =
      "Konversi antara RGB dan Hex:";
    return;
  }

  if (mode === "hex") {
    let num = Math.floor(Math.random() * numRange);
    correctAnswer = num.toString(16).toUpperCase();
    questionText = `Ubah ${num} ke Hex:`;
  } else if (mode === "hexToDec") {
    let num = Math.floor(Math.random() * numRange);
    let hex = num.toString(16).toUpperCase();
    correctAnswer = num.toString();
    questionText = `Ubah Hex ${hex} ke Desimal:`;
  } else if (mode === "rgb") {
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);
    correctAnswer = `#${r.toString(16).padStart(2, "0").toUpperCase()}${g
      .toString(16)
      .padStart(2, "0")
      .toUpperCase()}${b.toString(16).padStart(2, "0").toUpperCase()}`;
    questionText = `Ubah RGB(${r}, ${g}, ${b}) ke Hex:`;

    // Show color preview
    document.getElementById(
      "colorPreview"
    ).style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    document.getElementById("colorPreview").classList.remove("hidden");
  } else if (mode === "hexToRgb") {
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);
    let hex = `#${r.toString(16).padStart(2, "0").toUpperCase()}${g
      .toString(16)
      .padStart(2, "0")
      .toUpperCase()}${b.toString(16).padStart(2, "0").toUpperCase()}`;
    correctAnswer = `${r},${g},${b}`;
    questionText = `Ubah ${hex} ke RGB: (Format: r,g,b)`;

    // Show color preview
    document.getElementById("colorPreview").style.backgroundColor = hex;
    document.getElementById("colorPreview").classList.remove("hidden");
  }

  document.getElementById("question").textContent = questionText;
  startTimer();

  // Auto focus on answer input
  if (mode !== "rgbHexConverter") {
    document.getElementById("answer").focus();
  }
}

function generateMultipleChoiceQuestion(difficulty) {
  let numRange =
    difficulty === "easy" ? 100 : difficulty === "medium" ? 256 : 4096;
  let options = [];
  let questionType = Math.floor(Math.random() * 4); // 0: hex, 1: hexToDec, 2: rgb, 3: hexToRgb
  let questionText = "";
  let correctIndex = Math.floor(Math.random() * 4); // Which option will be correct

  if (questionType === 0) {
    // Desimal ke Hex
    let num = Math.floor(Math.random() * numRange);
    correctAnswer = num.toString(16).toUpperCase();
    questionText = `Ubah ${num} ke Hex:`;

    // Generate 4 options (1 correct, 3 wrong)
    for (let i = 0; i < 4; i++) {
      if (i === correctIndex) {
        options.push(correctAnswer);
      } else {
        let wrongNum = Math.floor(Math.random() * numRange);
        while (wrongNum === num) {
          // Ensure it's different
          wrongNum = Math.floor(Math.random() * numRange);
        }
        options.push(wrongNum.toString(16).toUpperCase());
      }
    }
  } else if (questionType === 1) {
    // Hex ke Desimal
    let num = Math.floor(Math.random() * numRange);
    let hex = num.toString(16).toUpperCase();
    correctAnswer = num.toString();
    questionText = `Ubah Hex ${hex} ke Desimal:`;

    for (let i = 0; i < 4; i++) {
      if (i === correctIndex) {
        options.push(correctAnswer);
      } else {
        let wrongNum = Math.floor(Math.random() * numRange);
        while (wrongNum === num) {
          wrongNum = Math.floor(Math.random() * numRange);
        }
        options.push(wrongNum.toString());
      }
    }
  } else if (questionType === 2) {
    // RGB ke Hex
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);
    correctAnswer = `#${r.toString(16).padStart(2, "0").toUpperCase()}${g
      .toString(16)
      .padStart(2, "0")
      .toUpperCase()}${b.toString(16).padStart(2, "0").toUpperCase()}`;
    questionText = `Ubah RGB(${r}, ${g}, ${b}) ke Hex:`;

    // Show color preview
    document.getElementById(
      "colorPreview"
    ).style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    document.getElementById("colorPreview").classList.remove("hidden");

    for (let i = 0; i < 4; i++) {
      if (i === correctIndex) {
        options.push(correctAnswer);
      } else {
        let wrongR = Math.floor(Math.random() * 256);
        let wrongG = Math.floor(Math.random() * 256);
        let wrongB = Math.floor(Math.random() * 256);
        // Ensure at least one value is different
        while (wrongR === r && wrongG === g && wrongB === b) {
          wrongR = Math.floor(Math.random() * 256);
        }
        options.push(
          `#${wrongR.toString(16).padStart(2, "0").toUpperCase()}${wrongG
            .toString(16)
            .padStart(2, "0")
            .toUpperCase()}${wrongB
            .toString(16)
            .padStart(2, "0")
            .toUpperCase()}`
        );
      }
    }
  } else {
    // Hex ke RGB
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);
    let hex = `#${r.toString(16).padStart(2, "0").toUpperCase()}${g
      .toString(16)
      .padStart(2, "0")
      .toUpperCase()}${b.toString(16).padStart(2, "0").toUpperCase()}`;
    correctAnswer = `${r}, ${g}, ${b}`;
    questionText = `Ubah ${hex} ke RGB:`;

    // Show color preview
    document.getElementById("colorPreview").style.backgroundColor = hex;
    document.getElementById("colorPreview").classList.remove("hidden");

    for (let i = 0; i < 4; i++) {
      if (i === correctIndex) {
        options.push(correctAnswer);
      } else {
        let wrongR = Math.floor(Math.random() * 256);
        let wrongG = Math.floor(Math.random() * 256);
        let wrongB = Math.floor(Math.random() * 256);
        // Ensure at least one value is different
        while (wrongR === r && wrongG === g && wrongB === b) {
          wrongR = Math.floor(Math.random() * 256);
        }
        options.push(`${wrongR}, ${wrongG}, ${wrongB}`);
      }
    }
  }

  document.getElementById("question").textContent = questionText;

  // Create the option buttons
  let optionsContainer = document.getElementById("multipleChoiceOptions");
  optionsContainer.innerHTML = "";

  for (let i = 0; i < options.length; i++) {
    let button = document.createElement("button");
    button.textContent = options[i];
    button.className = "p-3 bg-gray-600 rounded hover:bg-gray-500 transition";
    button.setAttribute("data-index", i);
    button.setAttribute("data-value", options[i]);
    button.onclick = function () {
      checkMultipleChoiceAnswer(this.getAttribute("data-value"));
    };
    optionsContainer.appendChild(button);
  }

  startTimer();
}

function setupRgbHexConverter() {
  // Clear timer since this is a tool, not a timed game
  clearInterval(timerInterval);
  document.getElementById("timer").textContent = "—";

  // Set up event listeners for the converter
  document
    .getElementById("rgbToHexBtn")
    .addEventListener("click", convertRgbToHex);
  document
    .getElementById("hexToRgbBtn")
    .addEventListener("click", convertHexToRgb);

  // Update color box on input change
  document
    .getElementById("rValue")
    .addEventListener("input", updateColorFromRgb);
  document
    .getElementById("gValue")
    .addEventListener("input", updateColorFromRgb);
  document
    .getElementById("bValue")
    .addEventListener("input", updateColorFromRgb);
  document
    .getElementById("hexValue")
    .addEventListener("input", updateColorFromHex);
}

function updateColorFromRgb() {
  // Get RGB values
  let r = parseInt(document.getElementById("rValue").value) || 0;
  let g = parseInt(document.getElementById("gValue").value) || 0;
  let b = parseInt(document.getElementById("bValue").value) || 0;

  // Clamp values
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));

  // Update color box
  document.getElementById(
    "colorBox"
  ).style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
}

function updateColorFromHex() {
  // Get hex value
  let hex = document.getElementById("hexValue").value.trim();

  // Check if it's a valid hex color
  let regex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
  if (regex.test(hex)) {
    // Ensure hex has # prefix
    if (!hex.startsWith("#")) {
      hex = "#" + hex;
    }
    // Update color box
    document.getElementById("colorBox").style.backgroundColor = hex;
  }
}

function startTimer() {
  startTime = new Date();
  clearInterval(timerInterval);
  document.getElementById("timer").textContent = "0";

  timerInterval = setInterval(() => {
    let currentTime = new Date();
    let elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
    document.getElementById("timer").textContent = elapsedSeconds;
  }, 1000);
}

function checkAnswer() {
  let userAnswer = document.getElementById("answer").value.trim();

  // Prevent submission if answer is empty
  if (!userAnswer) {
    document.getElementById("answer").classList.add("shake-animation");
    setTimeout(() => {
      document.getElementById("answer").classList.remove("shake-animation");
    }, 500);
    return;
  }

  let isCorrect = false;

  // Process user answer based on mode
  if (mode === "hex" || mode === "hexToDec") {
    // Case insensitive for hex
    isCorrect = userAnswer.toUpperCase() === correctAnswer.toUpperCase();
  } else if (mode === "rgb") {
    // Handle different formats of hex colors (#FF00FF or FF00FF)
    if (userAnswer.startsWith("#")) {
      isCorrect = userAnswer.toUpperCase() === correctAnswer.toUpperCase();
    } else {
      isCorrect =
        "#" + userAnswer.toUpperCase() === correctAnswer.toUpperCase();
    }
  } else if (mode === "hexToRgb") {
    // Handle different formats of RGB answers
    let userRgb = userAnswer.replaceAll(" ", "").split(",").map(Number);
    let correctRgb = correctAnswer.split(",").map(Number);
    isCorrect =
      userRgb.length === 3 &&
      userRgb[0] === correctRgb[0] &&
      userRgb[1] === correctRgb[1] &&
      userRgb[2] === correctRgb[2];
  }

  // Clear the answer input field after submission
  document.getElementById("answer").value = "";

  processFeedback(userAnswer, isCorrect);
}

function checkMultipleChoiceAnswer(selectedValue) {
  let userAnswer = selectedValue;
  let isCorrect = false;

  if (userAnswer === correctAnswer) {
    isCorrect = true;
  }

  processFeedback(userAnswer, isCorrect);
}

function convertRgbToHex() {
  // Get RGB values
  let r = parseInt(document.getElementById("rValue").value) || 0;
  let g = parseInt(document.getElementById("gValue").value) || 0;
  let b = parseInt(document.getElementById("bValue").value) || 0;

  // Prevent conversion if all fields are empty
  if (
    r === 0 &&
    g === 0 &&
    b === 0 &&
    document.getElementById("rValue").value === "" &&
    document.getElementById("gValue").value === "" &&
    document.getElementById("bValue").value === ""
  ) {
    // Add shake animation to the inputs
    document.getElementById("rValue").classList.add("shake-animation");
    document.getElementById("gValue").classList.add("shake-animation");
    document.getElementById("bValue").classList.add("shake-animation");

    setTimeout(() => {
      document.getElementById("rValue").classList.remove("shake-animation");
      document.getElementById("gValue").classList.remove("shake-animation");
      document.getElementById("bValue").classList.remove("shake-animation");
    }, 500);

    return;
  }

  // Clamp values
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));

  // Update input fields with clamped values
  document.getElementById("rValue").value = r;
  document.getElementById("gValue").value = g;
  document.getElementById("bValue").value = b;

  // Convert to hex
  let hex =
    "#" +
    r.toString(16).padStart(2, "0").toUpperCase() +
    g.toString(16).padStart(2, "0").toUpperCase() +
    b.toString(16).padStart(2, "0").toUpperCase();

  // Update hex field
  document.getElementById("hexValue").value = hex;

  // Update color box
  document.getElementById("colorBox").style.backgroundColor = hex;

  // Add to history
  let timeTaken = 0; // No time for converter
  updateHistory(`RGB(${r}, ${g}, ${b})`, hex, timeTaken, true, "Konversi");

  // Clear input fields after conversion
  setTimeout(() => {
    document.getElementById("rValue").value = "";
    document.getElementById("gValue").value = "";
    document.getElementById("bValue").value = "";
  }, 500);
}

function convertHexToRgb() {
  // Get hex value
  let hex = document.getElementById("hexValue").value.trim();

  // Prevent conversion if hex field is empty
  if (!hex) {
    document.getElementById("hexValue").classList.add("shake-animation");
    setTimeout(() => {
      document.getElementById("hexValue").classList.remove("shake-animation");
    }, 500);
    return;
  }

  // Check if it's a valid hex color
  let regex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
  let result = regex.exec(hex);

  if (result) {
    // Extract RGB values
    let r = parseInt(result[1], 16);
    let g = parseInt(result[2], 16);
    let b = parseInt(result[3], 16);

    // Update RGB fields
    document.getElementById("rValue").value = r;
    document.getElementById("gValue").value = g;
    document.getElementById("bValue").value = b;

    // Ensure hex has # prefix
    if (!hex.startsWith("#")) {
      hex = "#" + hex;
      document.getElementById("hexValue").value = hex;
    }

    // Update color box
    document.getElementById("colorBox").style.backgroundColor = hex;

    // Add to history
    let timeTaken = 0; // No time for converter
    updateHistory(hex, `RGB(${r}, ${g}, ${b})`, timeTaken, true, "Konversi");

    // Clear input field after conversion
    setTimeout(() => {
      document.getElementById("hexValue").value = "";
    }, 2000);
  } else {
    document.getElementById("feedback").textContent = "Format Hex tidak valid!";
    document.getElementById("feedback").className =
      "mt-3 font-semibold text-center text-red-500";
    setTimeout(() => {
      document.getElementById("feedback").textContent = "";
    }, 2000);
  }
}

function processFeedback(userAnswer, isCorrect) {
  // Stop timer
  clearInterval(timerInterval);
  let endTime = new Date();
  let timeTaken = Math.floor((endTime - startTime) / 1000);
  totalTime += timeTaken;
  attemptTimes.push(timeTaken);

  // Update stats
  totalAnswers++;
  if (isCorrect) {
    correctAnswers++;
    score++;
    document.getElementById("score").textContent = score;
    document.getElementById("feedback").textContent = "Benar! 🎉";
    document.getElementById("feedback").className =
      "mt-3 font-semibold text-center text-green-500";
  } else {
    document.getElementById(
      "feedback"
    ).textContent = `Salah. Jawaban yang benar: ${correctAnswer}`;
    document.getElementById("feedback").className =
      "mt-3 font-semibold text-center text-red-500";
  }

  let accuracy = Math.round((correctAnswers / totalAnswers) * 100);
  document.getElementById("accuracy").textContent = accuracy;

  // Update history
  updateHistory(userAnswer, correctAnswer, timeTaken, isCorrect);

  // Check for checkpoint
  if (score > 0 && score % 10 === 0 && isCorrect) {
    showCheckpoint();
  } else {
    // Generate next question after a short delay
    setTimeout(() => {
      generateQuestion(document.getElementById("difficulty").value);
    }, 500);
  }
}

function showCheckpoint() {
  clearInterval(timerInterval);
  document.getElementById("checkpoint").classList.remove("hidden");

  // Update checkpoint stats
  document.getElementById("checkpointTotal").textContent = totalAnswers;
  document.getElementById("checkpointCorrect").textContent = correctAnswers;
  document.getElementById("checkpointWrong").textContent =
    totalAnswers - correctAnswers;
  document.getElementById("checkpointAccuracy").textContent = Math.round(
    (correctAnswers / totalAnswers) * 100
  );

  // Add total time display
  document.getElementById("checkpointTotalTime").textContent = totalTime;

  // Calculate and display average time
  let avgTime = Math.round(totalTime / totalAnswers);
  document.getElementById("checkpointAvgTime").textContent = avgTime;

  // Display game mode
  let modeName = "";
  switch (mode) {
    case "hex":
      modeName = "Desimal ke Hex";
      break;
    case "hexToDec":
      modeName = "Hex ke Desimal";
      break;
    case "rgb":
      modeName = "RGB ke Hex";
      break;
    case "hexToRgb":
      modeName = "Hex ke RGB";
      break;
    case "multipleChoice":
      modeName = "Pilihan Ganda";
      break;
    case "rgbHexConverter":
      modeName = "Converter RGB/Hex";
      break;
    default:
      modeName = mode;
  }
  document.getElementById("checkpointGameMode").textContent = modeName;

  // Add checkpoint to history with special styling for checkpoints (yellow/orange)
  updateHistory(
    `Score: ${score}`,
    `Akurasi: ${Math.round((correctAnswers / totalAnswers) * 100)}%`,
    totalTime,
    true,
    "Checkpoint",
    true // This indicates it's a checkpoint for special styling
  );
}

function closeCheckpoint() {
  document.getElementById("checkpoint").classList.add("hidden");
  generateQuestion(document.getElementById("difficulty").value);
}

function updateHistory(
  userAnswer,
  correctAnswerValue,
  timeTaken,
  isCorrect,
  type = "Soal",
  isCheckpoint = false
) {
  // Create history item
  let historyItem = document.createElement("li");

  // Use special styling for checkpoints (yellow/orange background)
  if (isCheckpoint) {
    historyItem.className =
      "p-3 bg-yellow-800 bg-opacity-30 rounded-lg mb-2 border border-yellow-600";
  } else {
    historyItem.className = `p-3 ${
      isCorrect ? "bg-green-800" : "bg-red-800"
    } bg-opacity-30 rounded-lg mb-2 border ${
      isCorrect ? "border-green-600" : "border-red-600"
    }`;
  }

  // Create history content
  let content = `
        <div class="flex justify-between items-start">
            <div class="flex-grow">
                <p class="text-sm text-gray-400">${type}:</p>
                <p class="font-semibold">${
                  document.getElementById("question").textContent
                }</p>
            </div>
            <span class="text-xs ${
              isCheckpoint
                ? "text-yellow-400"
                : isCorrect
                ? "text-green-400"
                : "text-red-400"
            } px-2 py-1 rounded-full ${
    isCheckpoint ? "bg-yellow-900" : isCorrect ? "bg-green-900" : "bg-red-900"
  } bg-opacity-30">
                ${
                  isCheckpoint
                    ? "🏆 Checkpoint"
                    : isCorrect
                    ? "✓ Benar"
                    : "✗ Salah"
                }
            </span>
        </div>
        <div class="mt-2 grid grid-cols-2 gap-2 text-sm">
            <div>
                <p class="text-gray-400">Jawaban Anda:</p>
                <p class="font-mono">${userAnswer}</p>
            </div>
            <div>
                <p class="text-gray-400">Jawaban Benar:</p>
                <p class="font-mono">${correctAnswerValue}</p>
            </div>
        </div>
        <p class="text-right text-xs text-gray-400 mt-1">Waktu: ${timeTaken} detik</p>
    `;

  historyItem.innerHTML = content;

  // Add to main history list
  document.getElementById("history").prepend(historyItem);

  // Clone and add to mobile history list
  let mobileHistoryItem = historyItem.cloneNode(true);
  document.getElementById("historyMobile").prepend(mobileHistoryItem);
}

// Utility function to shuffle arrays
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("answer")
    .addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        checkAnswer();
      }
    });
});
