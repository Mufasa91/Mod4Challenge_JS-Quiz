const timerEl = document.getElementById('timer')
const question = document.querySelector('#question');
const choices = Array.from(document.querySelectorAll('.choice-text'));
const progressText = document.querySelector('#progressText');
const scoreText = document.querySelector('#score');
const progressBarFull = document.querySelector('#progressBarFull');

let secondsLeft = 60
let currentQuestion = {}
let acceptingAnswers = true
let score = 0
let questionCounter = 0
let availableQuestions = []

let questions = [
    {
        question: 'Inside which HTML element do we put the JavaScript?',
        choice1: '<script>',
        choice2: '<js>',
        choice3: '<scripting>',
        choice4: '<javascript>',
        answer: 1,
    },
    {
        question: 'Where is the correct place to insert a JavaScript?',
        choice1: 'The <head> section',
        choice2: 'Both the <head> section and the <body> section are correct',
        choice3: 'The <body> section',
        choice4: 'Inside a <div>',
        answer: 2,
    },
    {
        question: 'What is the correct syntax for referring to an external script called "xxx.js"?',
        choice1: '<script name="xxx.js">',
        choice2: '<script href="xxx.js">',
        choice3: '<script src="xxx.js">',
        choice4: 'None of the above',
        answer: 3,
    },
    {
        question: 'The external JavaScript file must contain the <script> tag.',
        choice1: 'True',
        choice2: 'False',
        choice3: 'Maybe',
        choice4: 'Who is asking?',
        answer: 2,
    }
]

const SCORE_POINTS = 25
const MAX_QUESTIONS = 4

startGame = () => {
    questionCounter = 0
    score = 0
    availableQuestions = [...questions]
    startTimer()
    getNewQuestion()
}

startTimer = () => {
    timerEl.textContent = secondsLeft;
    let timerInterval = setInterval(
        () => {
            secondsLeft--;
            timerEl.textContent = secondsLeft;
            if (secondsLeft <= 0) {
                clearInterval(timerInterval);
                endGame();
            }
        }, 1000);
};


getNewQuestion = () => {
    if(availableQuestions.length === 0 || questionCounter > MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore', score)
        
        return window.location.assign('./end.html')
    }

    questionCounter++
    progressText.innerText = `Question ${questionCounter} of ${MAX_QUESTIONS}`
    progressBarFull.style.width = `${(questionCounter/MAX_QUESTIONS) * 100}%`

    const questionsIndex = Math.floor(Math.random() * availableQuestions.length)
    currentQuestion = availableQuestions[questionsIndex]
    question.innerText = currentQuestion.question

    choices.forEach(choice => {
        const number = choice.dataset['number']
        choice.innerText = currentQuestion['choice' + number]
    })

    availableQuestions.splice(questionsIndex, 1)

    acceptingAnswers = true
}


choices.forEach(choice => {
    choice.addEventListener('click', e => {
        if(!acceptingAnswers) return

        acceptingAnswers = false
        const selectedChoice = e.target
        const selectedAnswer = selectedChoice.dataset['number']

        let classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect'

        if(classToApply === 'correct') {
            incrementScore(SCORE_POINTS)
        } else {
            secondsLeft -= 10;
        }

        selectedChoice.parentElement.classList.add(classToApply)
        
        setTimeout(() => {
            selectedChoice.parentElement.classList.remove (classToApply)
            getNewQuestion()
        
        }, 1000)
    })
})

incrementScore = num => {
    score +=num
    scoreText.innerText = score
}

startGame()

function endGame() {
    return window.location.assign('./end.html')
}