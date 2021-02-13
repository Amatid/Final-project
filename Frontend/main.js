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
    
mainButton.addEventListener('click', async () => {
    event.preventDefault();
    let response = await fetch('http://localhost:3000/menu');
    let result = await response.json();
    let calories = result[dataUser.age][dataUser.gender][dataUser.activity];
    const [form] = document.getElementsByTagName('form');
    form.remove();
    mainPage.insertAdjacentHTML("afterbegin",
    `<p>Ваша норма килокалорий в день: ${calories}</p>
    <p class="menu">1-ый завтрак (${Math.round(calories*0.25)} килокалорий)<button class="buttonMain noPosition"><i class="fa fa-plus" aria-hidden="true"></i></button></p>
    <p class="menu">2-ой завтрак (${Math.round(calories*0.10)} килокалорий)<button class="buttonMain noPosition"><i class="fa fa-plus" aria-hidden="true"></i></button></p>
    <p class="menu">Обед (${Math.round(calories*0.35)} килокалорий)<button class="buttonMain noPosition"><i class="fa fa-plus" aria-hidden="true"></i></button></p>
    <p class="menu">Полдник (${Math.round(calories*0.1)} килокалорий)<button class="buttonMain noPosition"><i class="fa fa-plus" aria-hidden="true"></i></button></p>
    <p class="menu">Ужин (${Math.round(calories*0.2)} килокалорий)<button class="buttonMain noPosition"><i class="fa fa-plus" aria-hidden="true"></i></button></p>`
    )
})

