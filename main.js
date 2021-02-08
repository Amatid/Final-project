const mainPage = document.getElementById('main');
const mainButton = document.querySelector('input');
let genderEl = document.getElementById('gender');
let ageEl = document.getElementById('age');
let activityEl = document.getElementById('activity');
const data = {gender: null, age: null, activity: null};

genderEl.addEventListener('change', () => data.gender = genderEl.value);
ageEl.addEventListener('change', () => data.age = ageEl.value);
activityEl.addEventListener('change', () => data.activity = activityEl.value);

mainPage.addEventListener('click', () => {
    for (let key in data) {
        if (data[key] === null) {
            return;
        }
    }
    mainButton.removeAttribute('disabled');
})
    
mainButton.addEventListener('click', () => {
    console.log(data);
})