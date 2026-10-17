// Tests use Node's built-in test runner, so nothing needs to be installed.
// Run them with:  npm test
const { test } = require("node:test");
const assert = require("node:assert/strict");
const {
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
} = require("../src/quiz.js");

test("createQuiz returns a fresh initial state and copies the questions array", () => {
  const questions = [{ answer: 1 }];
  const state = createQuiz(questions);

  assert.deepEqual(state, {
    questions,
    current: 0,
    score: 0,
    answered: false,
  });
  assert.notEqual(state, questions);
  assert.notEqual(state.questions, questions);
});

test("answerQuestion records a correct answer without mutating the input state", () => {
  const state = createQuiz([{ answer: 1 }]);
  const result = answerQuestion(state, 1);

  assert.equal(result.correct, true);
  assert.deepEqual(result.state, { ...state, score: 1, answered: true });
  assert.deepEqual(state, createQuiz([{ answer: 1 }]));
});

test("answerQuestion records a wrong answer without changing the score", () => {
  const state = createQuiz([{ answer: 1 }]);
  const result = answerQuestion(state, 0);

  assert.equal(result.correct, false);
  assert.deepEqual(result.state, { ...state, answered: true });
  assert.equal(state.answered, false);
});

test("advanceQuestion moves forward and unlocks the next question immutably", () => {
  const state = answerQuestion(createQuiz([{ answer: 0 }, { answer: 1 }]), 0).state;
  const nextState = advanceQuestion(state);

  assert.equal(nextState.current, 1);
  assert.equal(nextState.answered, false);
  assert.equal(nextState.score, 1);
  assert.equal(state.current, 0);
  assert.equal(state.answered, true);
});

test("isQuizFinished is false before the final question and true after it", () => {
  const state = createQuiz([{ answer: 0 }]);

  assert.equal(isQuizFinished(state), false);
  assert.equal(isQuizFinished(advanceQuestion(state)), true);
});

test("isCorrect returns true for the right answer", () => {
  assert.equal(isCorrect({ answer: 2 }, 2), true);
});

test("isCorrect returns false for a wrong answer", () => {
  assert.equal(isCorrect({ answer: 2 }, 0), false);
});

test("calculatePercentage rounds to a whole number", () => {
  assert.equal(calculatePercentage(2, 3), 67);
});

test("calculatePercentage returns 0 when there are no questions", () => {
  assert.equal(calculatePercentage(0, 0), 0);
});

test("shuffle keeps every item and does not change the original array", () => {
  const original = [1, 2, 3, 4, 5];
  const result = shuffle(original);
  assert.deepEqual([...result].sort(), [1, 2, 3, 4, 5]);
  assert.deepEqual(original, [1, 2, 3, 4, 5]);
});

test("getGrade returns A at the 90% boundary", () => {
  assert.equal(getGrade(90), "A");
});

test("getGrade returns B at the 75% boundary", () => {
  assert.equal(getGrade(75), "B");
});

test("getGrade returns C at the 50% boundary", () => {
  assert.equal(getGrade(50), "C");
});

test("getGrade returns Keep practicing below the 50% boundary", () => {
  assert.equal(getGrade(49), "Keep practicing");
});

test("getFeedbackMessage returns correct feedback for a correct answer", () => {
  assert.equal(getFeedbackMessage(true), "Correct!");
});

test("getFeedbackMessage returns incorrect feedback for a wrong answer", () => {
  assert.equal(getFeedbackMessage(false), "Not quite. The correct answer is highlighted.");
});

test("getFeedbackMessage returns timeout feedback when the timer expires", () => {
  assert.equal(getFeedbackMessage(false, true), "Time's up!");
});

test("getFeedbackMessage treats null correctness as a wrong answer", () => {
  assert.equal(getFeedbackMessage(null), "Not quite. The correct answer is highlighted.");
});

test("formatTimeLeft formats a positive number of seconds", () => {
  assert.equal(formatTimeLeft(12), "⏱ 12s");
});

test("formatTimeLeft rounds partial seconds up", () => {
  assert.equal(formatTimeLeft(4.2), "⏱ 5s");
});

test("formatTimeLeft keeps a zero-second countdown at zero", () => {
  assert.equal(formatTimeLeft(0), "⏱ 0s");
});

test("formatTimeLeft clamps negative seconds to zero", () => {
  assert.equal(formatTimeLeft(-3), "⏱ 0s");
});

test("formatTimeLeft treats null as zero seconds", () => {
  assert.equal(formatTimeLeft(null), "⏱ 0s");
});

test("formatTimeLeft treats missing seconds as zero", () => {
  assert.equal(formatTimeLeft(), "⏱ 0s");
});
