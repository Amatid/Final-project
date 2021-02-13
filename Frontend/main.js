const mainPage = document.getElementById('main');
const mainButton = document.querySelector('input');
let genderEl = document.getElementById('gender');
let ageEl = document.getElementById('age');
let activityEl = document.getElementById('activity');
const dataUser = {gender: null, age: null, activity: null};
const select = document.getElementsByTagName('select');
const advice = document.getElementById('advice')

window.addEventListener('load', async () => {
    let response = await fetch('http://localhost:3000');
    let result = await response.json();
    let randomAdvice = result[Math.floor(Math.random()*10)];
    advice.innerHTML = `<p>Случайный совет:</p>
    ${randomAdvice}`
    ;
})


genderEl.addEventListener('change', () => dataUser.gender = genderEl.value);
ageEl.addEventListener('change', () => dataUser.age = ageEl.value);
activityEl.addEventListener('change', () => dataUser.activity = activityEl.value);

mainPage.addEventListener('click', (event) => {
    for (let key in dataUser) {
        if (dataUser[key] === null) {
            return;
        }
    }
    mainButton.removeAttribute('disabled');
})
    
mainButton.addEventListener('click', () => {
    event.preventDefault();
})

