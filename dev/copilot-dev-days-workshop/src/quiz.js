// Core quiz logic.
// This file has NO browser (DOM) code so it can be tested with Node.js.

/**
 * Returns a new array with the items in random order.
 * The original array is not changed.
 */
function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Returns true when the selected option is the correct one.
 */
function isCorrect(question, selectedIndex) {
  return question.answer === selectedIndex;
}

/**
 * Converts a score into a whole-number percentage (0-100).
 */
function calculatePercentage(score, total) {
  if (total === 0) return 0;
  return Math.round((score / total) * 100);
}

/**
 * Turns a percentage into a grade.
 * A = 90% or more, B = 75% or more, C = 50% or more.
 */
function getGrade(percentage) {
  if (percentage >= 90) return "A";
  if (percentage >= 75) return "B";
  if (percentage >= 50) return "C";
  return "Keep practicing";
}

/**
 * Returns the message shown after an answer or when time runs out.
 */
function getFeedbackMessage(answeredCorrectly, timedOut = false) {
  if (timedOut) return "Time's up!";
  if (answeredCorrectly) return "Correct!";
  return "Not quite. The correct answer is highlighted.";
}

/**
 * Formats the remaining seconds for the quiz timer.
 */
function formatTimeLeft(seconds) {
  const safeSeconds = Number.isFinite(seconds) ? Math.max(0, Math.ceil(seconds)) : 0;
  return `⏱ ${safeSeconds}s`;
}

/**
 * Creates a fresh quiz state for the supplied questions.
 */
function createQuiz(questions) {
  return {
    questions: [...questions],
    current: 0,
    score: 0,
    answered: false,
  };
}

/**
 * Records an answer without changing the existing quiz state.
 */
function answerQuestion(state, selectedIndex) {
  const correct = isCorrect(state.questions[state.current], selectedIndex);
  if (state.answered) {
    return { state, correct };
  }

  return {
    state: {
      ...state,
      score: correct ? state.score + 1 : state.score,
      answered: true,
    },
    correct,
  };
}

/**
 * Advances to the next question without changing the existing quiz state.
 */
function advanceQuestion(state) {
  if (isQuizFinished(state)) return state;

  return {
    ...state,
    current: state.current + 1,
    answered: false,
  };
}

/**
 * Returns true once the current question index is past the final question.
 */
function isQuizFinished(state) {
  return state.current >= state.questions.length;
}

// Lets Node.js tests load this file. Browsers ignore this block.
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    shuffle,
    isCorrect,
    calculatePercentage,
    getGrade,
    getFeedbackMessage,
    formatTimeLeft,
    createQuiz,
    answerQuestion,
    advanceQuestion,
    isQuizFinished,
  };
}
