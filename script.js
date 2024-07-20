const questionElement = document.getElementById('question');
const answerButtons = document.querySelectorAll('.btn');
const scoreElement = document.getElementById('score');
const loadingSpinner = document.getElementById('loading-spinner');
const questionContainer = document.getElementById('question-container');

let score = 0;
let correct_anwser = "";
const categories = [
    'Art', 'Science', 'History', 'Technology', 'Mathematics', 'Literature', 'Music', 'Philosophy',
    'Psychology', 'Sociology', 'Politics', 'Economics', 'Geography', 'Biology', 'Chemistry', 
    'Physics', 'Astronomy', 'Medicine', 'Engineering', 'Architecture', 'Environmental Science', 
    'Ecology', 'Agriculture', 'Anthropology', 'Archaeology', 'Computer Science', 'Robotics', 
    'Artificial Intelligence', 'Cybersecurity', 'Blockchain', 'Astronautics', 'Astrobiology', 
    'Genetics', 'Microbiology', 'Botany', 'Zoology', 'Marine Biology', 'Geology', 'Paleontology', 
    'Meteorology', 'Climatology', 'Oceanography', 'Cartography', 'Linguistics', 'Ethics', 'Religion', 
    'Mythology', 'Folklore', 'Law', 'Criminology', 'Education', 'Pedagogy', 'Librarianship', 'Journalism', 
    'Media Studies', 'Film Studies', 'Theatre', 'Dance', 'Photography', 'Culinary Arts', 'Fashion', 
    'Interior Design', 'Graphic Design', 'Industrial Design', 'Animation', 'Game Design', 'Sports', 
    'Fitness', 'Nutrition', 'Wellness', 'Mental Health', 'Public Health', 'Social Work', 'Urban Planning', 
    'Transportation', 'Tourism', 'Hospitality', 'Event Management', 'Marketing', 'Advertising', 'Public Relations', 
    'Business', 'Management', 'Entrepreneurship', 'Finance', 'Accounting', 'Investment', 'Real Estate', 
    'Human Resources', 'Supply Chain Management', 'Operations Management', 'Project Management', 
    'Quality Control', 'Customer Service', 'Sales', 'E-commerce', 'Telecommunications', 'Nanotechnology', 
    'Materials Science', 'pokemon', 'Harry Potter', 'Star Wars', 'Marvel', 'DC Comics', 'Lord of the Rings',
];

function scrambleArray(arr) {
    // Create a copy of the array to avoid modifying the original array
    const array = arr.slice();
    
    for (let i = array.length - 1; i > 0; i--) {
        // Generate a random index from 0 to i
        const j = Math.floor(Math.random() * (i + 1));
        // Swap elements at indexes i and j
        [array[i], array[j]] = [array[j], array[i]];
    }
    
    return fill_blanks(array);
}


function fill_blanks(arr) {
    let array = arr.slice();
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].text === "" || arr[i].text === null || arr[i].text === undefined) {
            array[i].text = "None of the Above"; // Use `=` for assignment
        } else {
            array[i].text = arr[i].text;
        }
    }
    return array;
}

function getRandomElement(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}

async function postData(url = '', data = {}) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
    }

    return response.json();
}

let generatedQuestion;

function getQuestion() {
    hideQuestionContainer();
    showLoadingSpinner();
    postData('', { category: getRandomElement(categories) })
        .then(data => {
            console.log(data); // JSON data parsed by `response.json()` call
            correct_anwser = data.answers[0];
            generatedQuestion = {
                text: data.question,
                answers: scrambleArray([
                    { text: data.answers[0], correct: true },
                    { text: data.answers[1], correct: false },
                    { text: data.answers[2], correct: false },
                    { text: data.answers[3], correct: false }
                ])
            };
            showQuestion(generatedQuestion);
            hideLoadingSpinner();
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
            hideLoadingSpinner();
        });
}

function showQuestion(question) {
    questionElement.textContent = question.text;
    answerButtons.forEach((button, index) => {
        button.textContent = question.answers[index].text;
        button.dataset.correct = question.answers[index].correct;
    });
    showQuestionContainer();
}

function selectAnswer(button) {
    const correct = button.dataset.correct === 'true';
    if (correct) {
        score++;
        scoreElement.textContent = score;
        alert('Correct!');
        getQuestion();
    } else {
        alert('Wrong!\nThe correct answer was: ' + correct_anwser);
        getQuestion();
    }
}

function showLoadingSpinner() {
    loadingSpinner.classList.remove('hidden');
}

function hideLoadingSpinner() {
    loadingSpinner.classList.add('hidden');
}

function showQuestionContainer() {
    questionContainer.classList.remove('hidden');
}

function hideQuestionContainer() {
    questionContainer.classList.add('hidden');
}

getQuestion();
