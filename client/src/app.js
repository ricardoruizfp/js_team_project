const Questions = require('./models/questions.js');
const Game = require('./models/game.js');
const QuestionView = require('./views/question_view');

document.addEventListener('DOMContentLoaded', () => {
    console.log('Javascript initialized');

    const questionDiv = document.querySelector('#game_display');
    const questionView = new QuestionView(questionDiv);
    questionView.bindEvents();

    const game = new Game();
    game.bindEvents();

    const questions = new Questions();
    questions.bindEvents();
    questions.getData();
});