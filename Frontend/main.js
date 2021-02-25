const mainPage = document.getElementById('main');
const mainButton = document.querySelector('input');
let genderEl = document.getElementById('gender');
let ageEl = document.getElementById('age');
let activityEl = document.getElementById('activity');
const dataUser = { gender: null, age: null, activity: null };
const advice = document.getElementById('advice');
const selects = document.getElementsByTagName('select');

window.addEventListener('load', async () => {
    let result = await getDataFromServer('http://localhost:3000');
    let randomAdvice = result[Math.floor(Math.random() * result.length)];
    advice.innerHTML = `<p>Случайный совет:</p>
    ${randomAdvice}`
        ;
})

genderEl.addEventListener('change', () => dataUser.gender = genderEl.value);
ageEl.addEventListener('change', () => dataUser.age = ageEl.value);
activityEl.addEventListener('change', () => dataUser.activity = activityEl.value);

for (let element of selects) {
    element.addEventListener('change', () => {
        for (let key in dataUser) {
            if (dataUser[key] === null) {
                return;
            }
        }
        mainButton.removeAttribute('disabled');
    })
}


mainPage.addEventListener('click', async (event) => {
    if (event.target.tagName === 'BUTTON' && event.target.classList.contains('noPosition') || event.target.tagName === 'I' && event.target.parentElement.tagName === 'BUTTON' && !event.target.parentElement.classList.contains('unactive')) {
        drawModalWindow();
        if (event.target.tagName === 'I') {
            event.target.parentElement.setAttribute('data-press', 'active');
        } else {
            event.target.setAttribute('data-press', 'active');
        }
    }
})

mainButton.addEventListener('click', async () => {
    event.preventDefault();
    let result = await getDataFromServer('http://localhost:3000/menu');
    let calories = result[dataUser.age][dataUser.gender][dataUser.activity];
    const [form] = document.getElementsByTagName('form');
    form.remove();
    mainPage.insertAdjacentHTML('afterbegin',
        `<div id = 'secondPage'>
        <p data-caloriesRemain = ${calories}>Ваша норма килокалорий в день: ${calories}</p>
        <p class="menu"><span data-caloriesRemain = ${Math.round(calories * 0.25)} data-meal = "breakfast">1-ый завтрак (${Math.round(calories * 0.25)} килокалорий)</span><button class="buttonMain noPosition" data-press="unactive"><i class="fa fa-plus" aria-hidden="true"></i></button></p>
        <p class="menu"><span data-caloriesRemain = ${Math.round(calories * 0.1)} data-meal = "lunch">2-ой завтрак (${Math.round(calories * 0.1)} килокалорий)</span><button class="buttonMain noPosition" data-press="unactive"><i class="fa fa-plus" aria-hidden="true"></i></button></p>
        <p class="menu"><span data-caloriesRemain = ${Math.round(calories * 0.35)} data-meal = "dinner">Обед (${Math.round(calories * 0.35)} килокалорий)</span><button class="buttonMain noPosition" data-press="unactive"><i class="fa fa-plus" aria-hidden="true"></i></button></p>
        <p class="menu"><span data-caloriesRemain = ${Math.round(calories * 0.1)} data-meal = "afternoon">Полдник (${Math.round(calories * 0.1)} килокалорий)</span><button class="buttonMain noPosition" data-press="unactive"><i class="fa fa-plus" aria-hidden="true"></i></button></p>
        <p class="menu"><span data-caloriesRemain = ${Math.round(calories * 0.2)} data-meal = "evening">Ужин (${Math.round(calories * 0.2)} килокалорий)</span><button class="buttonMain noPosition" data-press="unactive"><i class="fa fa-plus" aria-hidden="true"></i></button></p>`
    )
})

async function drawModalWindow() {
    let modalWindow = document.createElement('div');
    mainPage.appendChild(modalWindow);
    modalWindow.classList.add('modal');
    modalWindow.innerHTML = '<div class = "icons"><div id="accept"><i class="fa fa-check" aria-hidden="true"></i></div><div id="add"><i class="fa fa-plus" aria-hidden="true"></i></div><div id="close"><i class="fa fa-times" aria-hidden="true"></i></div></div>';
    let result = await getDataFromServer('http://localhost:3000/products');
    sortByName(result);
    drawTable(modalWindow, result);
    const acceptButton = document.getElementById('accept');
    const close = document.getElementById('close');
    const add = document.getElementById('add');
    const [tableOfProducts] = document.getElementsByTagName('table');
    const rowTitles = document.getElementsByTagName('tr');
    const [productTitle, caloriesTitle] = rowTitles[0].getElementsByTagName('td');
    const allCeilsProducts = document.getElementsByTagName('td');
    caloriesTitle.setAttribute('data-sort', 'start');

    tableOfProducts.addEventListener('click', event => {
        if (event.target.tagName === 'TD' && event.target.parentElement !== rowTitles[0]) {
            let parentRow = event.target.parentElement;
            parentRow.classList.toggle('chosen');
            for (tr of rowTitles) {
                if (tr.classList.contains('chosen')) {
                    acceptButton.firstElementChild.classList.add('activeButton');
                    break;
                } else {
                    acceptButton.firstElementChild.classList.remove('activeButton');
                }
            }
        }
        if (event.target === productTitle || event.target.tagName === 'I' && event.target.parentElement === productTitle) {
            clearRows(rowTitles, acceptButton);
            caloriesTitle.innerHTML = 'Количество килокалорий в 100г.';
            switchOfDataAttribute(productTitle, 'Название продукта <i class="fa fa-sort-alpha-asc" aria-hidden="true"></i>', 'Название продукта <i class="fa fa-sort-alpha-desc" aria-hidden="true"></i>', sortByName(result), result);
            fillingTable(allCeilsProducts, result);
        }
        if (event.target === caloriesTitle || event.target.tagName === 'I' && event.target.parentElement === caloriesTitle) {
            clearRows(rowTitles, acceptButton);
            productTitle.innerHTML = 'Название продукта';
            switchOfDataAttribute(caloriesTitle, 'Количество килокалорий в 100г. <i class="fa fa-sort-numeric-asc" aria-hidden="true"></i>', 'Количество килокалорий в 100г. <i class="fa fa-sort-numeric-desc" aria-hidden="true"></i>', sortByEnergyCost(result), result);
            fillingTable(allCeilsProducts, result);
        }
    })

    close.addEventListener('click', () => {
        modalWindow.remove();
    })

    add.addEventListener('click', () => {
        let modalWindowForAddProduct = document.createElement('div');
        mainPage.appendChild(modalWindowForAddProduct);
        modalWindowForAddProduct.classList.add('modalForAdd');
        modalWindowForAddProduct.innerHTML = '<div><span>Название продукта: </span><input type="text" id="title"></div><div><span>Пищевая ценность в 100г. ккал </span><input type="text" id="energyCost"></div><div><div class = "add"><i class="fa fa-check" aria-hidden="true"></i></div><div class = "close"><i class="fa fa-times red" aria-hidden="true"></i></div></div>'
        const titleOfProducts = document.getElementById('title');
        const energyCost = document.getElementById('energyCost');
        const [closeWindowOfAddProduct] = modalWindowForAddProduct.getElementsByClassName('close');
        const [addNewProduct] = modalWindowForAddProduct.getElementsByClassName('add');
        const inputsOfWindowAddProduct = modalWindowForAddProduct.getElementsByTagName('input');
        const newProduct = { name: null, energyCost: null };
        for (let input of inputsOfWindowAddProduct) {
            input.addEventListener('blur', () => {
                for (let i = 0; i < inputsOfWindowAddProduct.length; i++) {
                    if (inputsOfWindowAddProduct[i].value === '') {
                        addNewProduct.classList.remove('activeButton');
                        return;
                    }
                }
                addNewProduct.classList.add('activeButton');
            })
        }

        addNewProduct.addEventListener('click', async () => {
            if (!addNewProduct.classList.contains('activeButton')) {
                return;
            }
            newProduct.name = titleOfProducts.value;
            newProduct.energyCost = +energyCost.value;
            if (Number.isNaN(newProduct.energyCost)) {
                alert('Поле пищевая ценность должно содержать цифры!');
                energyCost.value = '';
                addNewProduct.classList.remove('activeButton');
            }
            result.push(newProduct);
            let response = await fetch('http://localhost:3000/addProduct', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(result)
            });
            сonsole.log(response);
            let answer = await response.json();
            console.log(answer);
            modalWindowForAddProduct.remove();
            tableOfProducts.remove();
            sortByName(result);
            drawTable(modalWindow, result);
        })

        closeWindowOfAddProduct.addEventListener('click', () => {
            modalWindowForAddProduct.remove();
        })

    })

    acceptButton.addEventListener('click', () => {
        if (!acceptButton.firstElementChild.classList.contains('activeButton')) {
            return;
        }
        let chosenProducts = Array.from(rowTitles).filter(product => {
            return product.classList.contains('chosen');
        })
        chosenProducts = chosenProducts.map(product => {
            return { 'name': product.firstChild.innerHTML, 'energyCost': +product.lastElementChild.innerHTML };
        })
        modalWindow.remove();
        let pressedButton = Array.from(document.getElementsByTagName('button')).find(button => {
            return button.getAttribute('data-press') === 'active';
        })
        if (pressedButton.parentElement.nextElementSibling === null || pressedButton.parentElement.nextElementSibling.classList.contains('menu')) {
            let blockForChosenProducts = document.createElement('div');
            for (let i = 0; i < chosenProducts.length; i++) {
                blockForChosenProducts.insertAdjacentHTML('afterbegin',
                    `<div class="chosenProducts"><div>${chosenProducts[i].name}</div><div><input type="text" maxlength="3"> гр.</div><div><i class="fa fa-times red" aria-hidden="true"></i></div></div>`)
            }
            pressedButton.parentElement.insertAdjacentElement('afterend', blockForChosenProducts);
        } else {
            for (let i = 0; i < chosenProducts.length; i++) {
                pressedButton.parentElement.nextElementSibling.insertAdjacentHTML('beforeend',
                    `<div class="chosenProducts"><div>${chosenProducts[i].name}</div><div><input type="text" maxlength="3"> гр.</div><div><i class="fa fa-times red" aria-hidden="true"></i></div></div>`)
            }
        }
        pressedButton.setAttribute('data-press', 'unactive');
        const inputsQuantityEat = document.getElementsByTagName('input');
        for (let input of inputsQuantityEat) {
            input.addEventListener('change', event => {
                calculateCalories(event, result);
            })
        }
        const deleteElements = document.getElementsByClassName('fa-times');
        for (buttonDelete of deleteElements) {
            buttonDelete.addEventListener('click', event => {
                let targetStringMeal = event.target.parentElement.parentElement.parentElement.previousElementSibling;
                let caloriesForMeal = +targetStringMeal.children[0].getAttribute('data-caloriesRemain');
                let remain = caloriesForMeal + calculateRemain(event);
                drawRemainCalories(targetStringMeal, remain, caloriesForMeal);
                if (event.target.parentElement.parentElement.parentElement.children.length === 1) {
                    event.target.parentElement.parentElement.parentElement.remove();
                } else {
                    event.target.parentElement.parentElement.remove();
                }
            })
        }
    })
}

async function getDataFromServer(addresOfRequest) {
    let response = await fetch(addresOfRequest);
    return await response.json();
}

const sortByName = object => {
    return object.sort((a, b) => {
        let nameA = a.name.toLowerCase();
        let nameB = b.name.toLowerCase();
        return (nameA < nameB) ? -1 : (nameA < nameB) ? 1 : 0;
    })
}

const sortByEnergyCost = object => {
    return object.sort((a, b) => {
        let nameA = a.energyCost;
        let nameB = b.energyCost;
        return (nameA < nameB) ? -1 : (nameA < nameB) ? 1 : 0;
    })
}

function drawTable(targetBlock, arrayForTable) {
    const tableOfProducts = document.createElement('table');
    targetBlock.appendChild(tableOfProducts);
    for (let i = 0; i < arrayForTable.length + 1; i++) {
        let rowOfTable = document.createElement('tr');
        tableOfProducts.appendChild(rowOfTable);
        for (let j = 0; j < 2; j++) {
            let ceilOfTable = document.createElement('td');
            rowOfTable.appendChild(ceilOfTable);
            if (i === 0 && j === 0) {
                ceilOfTable.innerHTML = 'Название продукта <i class="fa fa-sort-alpha-asc" aria-hidden="true"></i>';
                ceilOfTable.setAttribute('data-sort', 'finish');
                continue;
            }
            if (i === 0 && j === 1) {
                ceilOfTable.innerHTML = 'Количество килокалорий в 100г.';
                continue;
            }
            if (j % 2) {
                ceilOfTable.innerHTML = arrayForTable[i - 1].energyCost;
            } else {
                ceilOfTable.innerHTML = arrayForTable[i - 1].name;
            }
        }
    }
}

function fillingTable(ceilsTable, content) {
    let j = 0;
    for (i = 2; i < ceilsTable.length;) {
        ceilsTable[i].innerHTML = content[j].name;
        i++;
        ceilsTable[i].innerHTML = content[j].energyCost;
        j++;
        i++;
    }
}

function switchOfDataAttribute(element, symbolBySuccess, symbolByFailure, functionForSorting, objectForReverse) {
    if (element.getAttribute('data-sort') === 'start') {
        element.setAttribute('data-sort', 'finish');
        element.innerHTML = symbolBySuccess;
        functionForSorting;
    } else {
        element.setAttribute('data-sort', 'start');
        element.innerHTML = symbolByFailure;
        objectForReverse.reverse();
    }
}

function clearRows(rows, buttonForDisabling) {
    for (let i = 1; i < rows.length; i++) {
        rows[i].classList.remove('chosen')
    }
    buttonForDisabling.firstElementChild.classList.remove('activeButton');
}

function calculateCalories(event, arrayOfProducts) {
    let quantityEat = +event.target.value;
    if (Number.isNaN(quantityEat)) {
        alert('Введите корректное число');
        event.target.value = '';
    } else {
        event.target.parentElement.previousElementSibling.innerHTML = event.target.parentElement.previousElementSibling.innerHTML.replace(/ \d{1,} килокалорий/, '');
        let findProduct = arrayOfProducts.find(product => {
            return event.target.parentElement.previousElementSibling.innerHTML === product.name;
        })
        let calculateCalories = Math.round(findProduct.energyCost / 100 * quantityEat);
        event.target.parentElement.previousElementSibling.innerHTML = `${event.target.parentElement.previousElementSibling.innerHTML} ${calculateCalories} килокалорий`;
        let targetStringMeal = event.target.parentElement.parentElement.parentElement.previousElementSibling;
        let caloriesForMeal = +targetStringMeal.children[0].getAttribute('data-caloriesRemain');
        let remain = caloriesForMeal - calculateRemain(event);
        drawRemainCalories(targetStringMeal, remain, caloriesForMeal);
    }
}

function calculateRemain(event) {
    let getCalories = 0;
    for (i = 0; i < event.target.parentElement.parentElement.parentElement.children.length; i++) {
        if (!(/\d{1,} килокалорий/g).test(event.target.parentElement.parentElement.parentElement.children[i].firstChild.innerHTML)) {
            continue;
        }
        let [getCaloryOneProduct] = event.target.parentElement.parentElement.parentElement.children[i].firstChild.innerHTML.match(/\d{1,} килокалорий/g);
        getCaloryOneProduct = getCaloryOneProduct.replace(/ килокалорий/, '');
        getCalories += +getCaloryOneProduct;
    }
    return getCalories;
}

function drawRemainCalories(targetStringMeal, remain, caloriesForMeal) {
    let percentRemainByMeal = remain / caloriesForMeal;
    targetStringMeal.children[0].setAttribute('data-caloriesRemain', remain);
    let colorForRemain = percentRemainByMeal > 0.7 ? 'green' : percentRemainByMeal < 0.3 ? 'red' : 'orange';
    let textForRemain = remain > 0 ? `<span style = "color: ${colorForRemain}"> килокалорий осталось ${remain}</span>` : '<span class="red"> <i class="fa fa-exclamation" aria-hidden="true"></i> прeвышение нормы</span>';
    if (remain < 0) {
        targetStringMeal.lastElementChild.setAttribute('disabled', true);
        targetStringMeal.lastElementChild.classList.add('unactive');
    } else {
        targetStringMeal.lastElementChild.removeAttribute('disabled');
        targetStringMeal.lastElementChild.classList.remove('unactive');
    }
    if (targetStringMeal.children[1].tagName !== 'BUTTON') {
        targetStringMeal.children[1].innerHTML = ` ${textForRemain}`;
    } else {
        targetStringMeal.children[0].insertAdjacentHTML('afterend', textForRemain);
    }
}