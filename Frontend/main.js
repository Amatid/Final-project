const mainPage = document.getElementById('main');
const mainButton = document.querySelector('input');
let genderEl = document.getElementById('gender');
let ageEl = document.getElementById('age');
let activityEl = document.getElementById('activity');
const dataUser = {gender: null, age: null, activity: null};

window.addEventListener('load', () => {
    let response = fetch('http://localhost:3000/api/advices');
})


genderEl.addEventListener('change', () => dataUser.gender = genderEl.value);
ageEl.addEventListener('change', () => dataUser.age = ageEl.value);
activityEl.addEventListener('change', () => dataUser.activity = activityEl.value);

mainPage.addEventListener('click', () => {
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

