// UI code: connects the quiz logic (quiz.js) to the page (index.html).

const TIMER_DURATION_SECONDS = 15;
let state = createQuiz([]);
let timerInterval = null;
let timerDeadline = 0;

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const progressText = document.getElementById("progress");
const questionText = document.getElementById("question-text");
const optionsList = document.getElementById("options");
const feedbackText = document.getElementById("feedback");
const timeLeftText = document.getElementById("time-left");
const nextButton = document.getElementById("next-btn");
const scoreText = document.getElementById("score-text");
const gradeText = document.getElementById("grade-text");

function showScreen(screenToShow) {
  [startScreen, quizScreen, resultScreen].forEach((screen) => {
    screen.hidden = screen !== screenToShow;
  });
}

function stopTimer() {
  if (timerInterval !== null) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function updateTimer() {
  const secondsLeft = Math.max(0, Math.ceil((timerDeadline - Date.now()) / 1000));
  timeLeftText.textContent = formatTimeLeft(secondsLeft);
  timeLeftText.classList.toggle("timer--urgent", secondsLeft <= 5);

  if (secondsLeft === 0) {
    timeOutQuestion();
  }
}

function startTimer() {
  stopTimer();
  timerDeadline = Date.now() + TIMER_DURATION_SECONDS * 1000;
  updateTimer();
  timerInterval = setInterval(updateTimer, 200);
}

function disableOptions() {
  const buttons = optionsList.querySelectorAll("button");
  buttons.forEach((button) => (button.disabled = true));
  return buttons;
}

function timeOutQuestion() {
  if (state.answered) return;

  state = answerQuestion(state, -1).state;
  stopTimer();
  const buttons = disableOptions();
  const question = state.questions[state.current];
  buttons[question.answer].classList.add("correct");
  feedbackText.textContent = getFeedbackMessage(false, true);
  nextButton.hidden = false;
  nextButton.focus();
}

function startQuiz() {
  stopTimer();
  state = createQuiz(shuffle(QUESTIONS));
  showScreen(quizScreen);
  renderQuestion();
}

function renderQuestion() {
  stopTimer();
  const question = state.questions[state.current];
  progressText.textContent = `Question ${state.current + 1} of ${state.questions.length}`;
  questionText.textContent = question.question;
  feedbackText.textContent = "";
  nextButton.hidden = true;
  optionsList.innerHTML = "";

  question.options.forEach((option, index) => {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.className = "option";
    button.textContent = option;
    button.addEventListener("click", () => selectAnswer(index, button));
    item.appendChild(button);
    optionsList.appendChild(item);
  });

  startTimer();
}

function selectAnswer(selectedIndex, selectedButton) {
  if (state.answered) return;
  updateTimer();
  if (state.answered) return;

  const result = answerQuestion(state, selectedIndex);
  state = result.state;
  stopTimer();
  const question = state.questions[state.current];
  const buttons = disableOptions();

  if (result.correct) {
    selectedButton.classList.add("correct");
    feedbackText.textContent = getFeedbackMessage(true);
  } else {
    selectedButton.classList.add("wrong");
    buttons[question.answer].classList.add("correct");
    feedbackText.textContent = getFeedbackMessage(false);
  }

  nextButton.hidden = false;
  nextButton.focus();
}

function handleNextQuestion() {
  state = advanceQuestion(state);
  if (!isQuizFinished(state)) {
    renderQuestion();
  } else {
    showResults();
  }
}

function showResults() {
  stopTimer();
  const total = state.questions.length;
  const percentage = calculatePercentage(state.score, total);
  scoreText.textContent = `You scored ${state.score} out of ${total} (${percentage}%)`;
  gradeText.textContent = `Grade: ${getGrade(percentage)}`;
  showScreen(resultScreen);
}

document.getElementById("start-btn").addEventListener("click", startQuiz);
document.getElementById("restart-btn").addEventListener("click", startQuiz);
nextButton.addEventListener("click", handleNextQuestion);
