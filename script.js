let currentQuiz = 0;
let score = 0;
let timeLeft = 30;
let selectedQuizData = [];
let timer;
let userAnswers = [];

const quizContainer = document.getElementById('quiz');
const categoryContainer = document.getElementById('category-container');
const categorySelect = document.getElementById('category-select');
const startQuizBtn = document.getElementById('start-quiz');
const answerEls = document.querySelectorAll('.answer');
const questionEl = document.getElementById('question');
const a_text = document.getElementById('a_text');
const b_text = document.getElementById('b_text');
const c_text = document.getElementById('c_text');
const d_text = document.getElementById('d_text');
const submitBtn = document.getElementById('submit');
const timerEl = document.getElementById('time-left');
const rankingContainer = document.getElementById('ranking');
const rankingList = document.getElementById('ranking-list');
const badgeContainer = document.getElementById('badge-container');
const badgeList = document.getElementById('badge-list');
const toggleThemeBtn = document.getElementById('toggle-theme');
const feedbackContainer = document.getElementById('feedback-container');
const feedbackContent = document.getElementById('feedback-content');

function getRandomQuizData(category) {
    const shuffled = quizData[category].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
}

function loadQuiz() {
    deselectAnswers();
    const currentQuizData = selectedQuizData[currentQuiz];
    questionEl.innerText = currentQuizData.question;
    a_text.innerText = currentQuizData.a;
    b_text.innerText = currentQuizData.b;
    c_text.innerText = currentQuizData.c;
    d_text.innerText = currentQuizData.d;
    quizContainer.classList.add('fade-in');
    resetTimer();
    startTimer();
}

function deselectAnswers() {
    answerEls.forEach(answerEl => answerEl.checked = false);
    document.querySelectorAll('input[name="confidence"]').forEach(el => el.checked = false);
}

function getSelected() {
    let answer;
    answerEls.forEach(answerEl => {
        if(answerEl.checked) {
            answer = answerEl.id;
        }
    });
    return answer;
}

function getConfidence() {
    let confidence;
    document.querySelectorAll('input[name="confidence"]').forEach(el => {
        if(el.checked) {
            confidence = el.value;
        }
    });
    return confidence;
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        timerEl.innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            submitBtn.click();
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timer);
    timeLeft = 30;
    timerEl.innerText = timeLeft;
}

submitBtn.addEventListener('click', () => {
    const answer = getSelected();
    const confidence = getConfidence();
    if(answer && confidence) {
        userAnswers.push({ answer, confidence });
        currentQuiz++;
        if(currentQuiz < selectedQuizData.length) {
            loadQuiz();
        } else {
            showFeedback();
        }
    } else {
        alert('回答と自信度を選択してください。');
    }
});

function showFeedback() {
    let feedbackHTML = '';
    userAnswers.forEach((data, index) => {
        const currentQuizData = selectedQuizData[index];
        const isCorrect = data.answer === currentQuizData.correct;
        let feedbackText = isCorrect ? '正解！' : '不正解！';
        if (data.confidence === 'low') {
            feedbackText += ' 自信が低かったので、このトピックを復習しましょう。';
        } else if (data.confidence === 'high') {
            feedbackText += ' 素晴らしい！自信を持って答えられましたね。';
        }
        feedbackHTML += `
            <div class="feedback-item">
                <h3>Q${index + 1}: ${currentQuizData.question}</h3>
                <p>${feedbackText}</p>
                <p>解説: ${currentQuizData.explanation}</p>
            </div>
        `;
    });
    feedbackContent.innerHTML = feedbackHTML;
    quizContainer.classList.add('hidden');
    feedbackContainer.classList.remove('hidden');
    updateRanking();
}

function updateRanking() {
    const scores = JSON.parse(localStorage.getItem('scores')) || [];
    scores.push(score);
    localStorage.setItem('scores', JSON.stringify(scores));
    rankingList.innerHTML = scores.map((s, index) => `<li>${index + 1}. ${s}点</li>`).join('');
    rankingContainer.classList.remove('hidden');
}

toggleThemeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    toggleThemeBtn.innerText = document.body.classList.contains('dark-mode') ? 'ライトモード' : 'ダークモード';
});

startQuizBtn.addEventListener('click', () => {
    const category = categorySelect.value;
    selectedQuizData = getRandomQuizData(category);
    categoryContainer.classList.add('hidden');
    quizContainer.classList.remove('hidden');
    loadQuiz();
});
