const mainPage = document.getElementById('main');
const mainButton = document.querySelector('input');
let genderEl = document.getElementById('gender');
let ageEl = document.getElementById('age');
let activityEl = document.getElementById('activity');
const dataUser = { gender: null, age: null, activity: null };
const advice = document.getElementById('advice');
const selects = document.getElementsByTagName('select');
const [allCaloriesBlock] = document.getElementsByTagName('p');

window.addEventListener('load', async () => {
    let advices = await getDataFromServer('http://localhost:3000');
    let randomAdvice = advices[Math.floor(Math.random() * advices.length)];
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
    let user = await getDataFromServer('http://localhost:3000/menu');
    let calories = user[dataUser.age][dataUser.gender][dataUser.activity];
    const [form] = document.getElementsByTagName('form');
    form.remove();
    mainPage.insertAdjacentHTML('afterbegin',
        `<div id = 'secondPage'>
        <p data-caloriesRemain = ${calories}>Ваша норма килокалорий в день: ${calories}</p>
        <p class="menu"><span data-caloriesRemain = ${Math.round(calories * 0.25)}>1-ый завтрак (${Math.round(calories * 0.25)} килокалорий)</span><button class="buttonMain noPosition" data-press="unactive"><i class="fa fa-plus" aria-hidden="true"></i></button></p>
        <p class="menu"><span data-caloriesRemain = ${Math.round(calories * 0.1)}>2-ой завтрак (${Math.round(calories * 0.1)} килокалорий)</span><button class="buttonMain noPosition" data-press="unactive"><i class="fa fa-plus" aria-hidden="true"></i></button></p>
        <p class="menu"><span data-caloriesRemain = ${Math.round(calories * 0.35)}>Обед (${Math.round(calories * 0.35)} килокалорий)</span><button class="buttonMain noPosition" data-press="unactive"><i class="fa fa-plus" aria-hidden="true"></i></button></p>
        <p class="menu"><span data-caloriesRemain = ${Math.round(calories * 0.1)}>Полдник (${Math.round(calories * 0.1)} килокалорий)</span><button class="buttonMain noPosition" data-press="unactive"><i class="fa fa-plus" aria-hidden="true"></i></button></p>
        <p class="menu"><span data-caloriesRemain = ${Math.round(calories * 0.2)}>Ужин (${Math.round(calories * 0.2)} килокалорий)</span><button class="buttonMain noPosition" data-press="unactive"><i class="fa fa-plus" aria-hidden="true"></i></button></p>`
    )
})

async function drawModalWindow() {
    let modalWindow = document.createElement('div');
    mainPage.appendChild(modalWindow);
    modalWindow.classList.add('modal');
    modalWindow.innerHTML = '<div class = "icons"><div id="accept"><i class="fa fa-check" aria-hidden="true"></i></div><div id="add"><i class="fa fa-plus" aria-hidden="true"></i></div><div id="close"><i class="fa fa-times" aria-hidden="true"></i></div></div>';
    let products = await getDataFromServer('http://localhost:3000/products');
    sortByName(products);
    drawTable(modalWindow, products);
    const acceptButton = document.getElementById('accept');
    const close = document.getElementById('close');
    const add = document.getElementById('add');
    const [tableOfProducts] = document.getElementsByTagName('table');
    const rowTitles = document.getElementsByTagName('tr');
    const [productTitle, caloriesTitle] = rowTitles[0].getElementsByTagName('td');
    const allCellsProducts = document.getElementsByTagName('td');
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
            sortingWithClick (rowTitles, acceptButton, caloriesTitle, 'Количество килокалорий в 100г.', productTitle, 'Название продукта <i class="fa fa-sort-alpha-asc" aria-hidden="true"></i>',
            'Название продукта <i class="fa fa-sort-alpha-desc" aria-hidden="true"></i>', sortByName(products), products, allCellsProducts);
        }
        if (event.target === caloriesTitle || event.target.tagName === 'I' && event.target.parentElement === caloriesTitle) {
            sortingWithClick (rowTitles, acceptButton, productTitle, 'Название продукта', caloriesTitle, 'Количество килокалорий в 100г. <i class="fa fa-sort-numeric-asc" aria-hidden="true"></i>', 
            'Количество килокалорий в 100г. <i class="fa fa-sort-numeric-desc" aria-hidden="true"></i>', sortByEnergyCost(products), products, allCellsProducts);
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
            products.push(newProduct);
            modalWindowForAddProduct.remove();
            tableOfProducts.remove();
            sortByName(products);
            drawTable(modalWindow, products);
            await fetch('http://localhost:3000/addProduct', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(products)
            });
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
                calculateCalories(event, products);
                calculateCaloriesMain();
            })
        }
        const deleteElements = document.getElementsByClassName('fa-times');
        for (let buttonDelete of deleteElements) {
            buttonDelete.addEventListener('click', event => {
                event.stopImmediatePropagation();
                let targetStringMeal = event.target.parentElement.parentElement.parentElement.previousElementSibling;
                let caloriesForMeal = +targetStringMeal.children[0].getAttribute('data-caloriesRemain');
                const collectionOfChosenProducts = event.target.parentElement.parentElement.parentElement.children;
                if (event.target.parentElement.parentElement.parentElement.children.length === 1) {
                    if (targetStringMeal.children.length === 3) {
                        targetStringMeal.children[1].remove();
                        targetStringMeal.lastElementChild.removeAttribute('disabled');
                        targetStringMeal.lastElementChild.classList.remove('unactive');
                    }
                    event.target.parentElement.parentElement.parentElement.remove();
                } else {
                    event.target.parentElement.parentElement.remove();
                    let remain = calculateRemain(collectionOfChosenProducts, caloriesForMeal);
                    drawRemainCalories(targetStringMeal, remain, caloriesForMeal);
                }
                calculateCaloriesMain();
            })
        }
    })
}

async function getDataFromServer(addresOfRequest) {
    try {
        let response = await fetch(addresOfRequest);
        return await response.json();
    } catch (error) {
        mainPage.remove();
        const [body] = document.getElementsByTagName('body');
        let err = document.createElement('div');
        err.innerHTML = '<img class = "error404" src="https://cs8.pikabu.ru/post_img/2016/03/28/11/og_og_1459194302236352360.jpg">'
        body.appendChild(err);
    }
}

function sortingWithClick(rowTitles, acceptButton, aginstTitle, symbolAgainstTitle, title, symbolBySuccess, symbolByFailure, functionForSort, objectForReverse, allCellsProducts) {
    clearRows(rowTitles, acceptButton);
    aginstTitle.innerHTML = symbolAgainstTitle;
    switchOfDataAttribute(title, symbolBySuccess, symbolByFailure, functionForSort, objectForReverse);
    fillTableCellsWithProducts(allCellsProducts, objectForReverse);
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

function fillTableCellsWithProducts(cells, products) {
    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        cells[i * 2 + 2].innerHTML = product.name;
        cells[i * 2 + 3].innerHTML = product.energyCost;
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
    if (Number.isNaN(quantityEat) || quantityEat < 0) {
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
        const collectionOfChosenProducts = event.target.parentElement.parentElement.parentElement.children;
        let remain = calculateRemain(collectionOfChosenProducts, caloriesForMeal);
        drawRemainCalories(targetStringMeal, remain, caloriesForMeal);
    }
}

function calculateRemain(collectionOfChosenElements, caloriesForMeal) {
    let getCalories = 0;
    for (let element of collectionOfChosenElements) {
        if (!(/\d{1,} килокалорий/g).test(element.firstChild.innerHTML)) {
            continue;
        }
        let [getCaloryOneProduct] = element.firstChild.innerHTML.match(/\d{1,} килокалорий/g);
        getCaloryOneProduct = getCaloryOneProduct.replace(/ килокалорий/, '');
        getCalories += +getCaloryOneProduct;
    }
    return caloriesForMeal - getCalories;
}



function drawRemainCalories(targetStringMeal, remain, caloriesForMeal) {
    if (remain < 0) {
        targetStringMeal.lastElementChild.setAttribute('disabled', true);
        targetStringMeal.lastElementChild.classList.add('unactive');
    } else {
        targetStringMeal.lastElementChild.removeAttribute('disabled');
        targetStringMeal.lastElementChild.classList.remove('unactive');
    }
    let percentRemainByMeal = remain / caloriesForMeal;
    if (percentRemainByMeal === 1) {
        if (targetStringMeal.children.length === 3) {
            targetStringMeal.children[1].remove();
        }
        return;
    }
    let textForRemain = writeAndPaintTextRemain(remain, caloriesForMeal);
    if (targetStringMeal.children[1].tagName !== 'BUTTON') {
        targetStringMeal.children[1].innerHTML = ` ${textForRemain}`;
    } else {
        targetStringMeal.children[0].insertAdjacentHTML('afterend', textForRemain);
    }
}

function writeAndPaintTextRemain(remain, caloriesForMeal) {
    let percentRemainByMeal = remain / caloriesForMeal;
    let colorForRemain = percentRemainByMeal > 0.7 ? 'green' : percentRemainByMeal < 0.3 ? 'red' : 'orange';
    return remain > 0 ? `<span style = "color: ${colorForRemain}"> килокалорий осталось ${remain}</span>` : '<span class="red"> <i class="fa fa-exclamation" aria-hidden="true"></i> прeвышение нормы</span>';
}

function calculateCaloriesMain() {
    const [allCaloriesBlock] = document.getElementsByTagName('p');
    const allChosenProducts = document.getElementsByClassName('chosenProducts');
    const allCalories = +allCaloriesBlock.getAttribute('data-caloriesRemain');
    let remain = calculateRemain(allChosenProducts, allCalories);
    let textForRemain = writeAndPaintTextRemain(remain, allCalories);
    if (allCaloriesBlock.firstElementChild) {
        allCaloriesBlock.firstElementChild.remove();
    }
    allCaloriesBlock.innerHTML += textForRemain;
    if (remain === allCalories) {
        allCaloriesBlock.firstElementChild.remove();
    }
}   