const display = document.getElementById("display");
const populationStatistics = document.getElementById("population-statistics");
const emulStatusDom = document.getElementById("emul-status");
const emulStatusButtonDom = document.getElementById("emul-status-button");
const emulRestartButtonDom = document.getElementById("emul-restart-button");
const form = document.forms.form;

let countOfTick = 0;


let fox = 2, rabbit = 4, grass = 10, tickTime = 500;

form.elements.tick.value = tickTime;

form.elements.tick.onchange = function () {
    emulStatus = false;
    emulStatusButtonDom.classList = "stats-menu__button--success";
    emulStatusButtonDom.innerText = "Запустить";
    emulStatusDom.innerHTML = "Симуляция остановлена"
    tickTime = form.elements.tick.value
    populate(fox, rabbit, grass)
}

form.elements.fox.value = fox;

form.elements.fox.onchange = function () {
    emulStatus = false;
    emulStatusButtonDom.classList = "stats-menu__button--success";
    emulStatusButtonDom.innerText = "Запустить";
    emulStatusDom.innerHTML = "Симуляция остановлена"
    fox = form.elements.fox.value
    populate(fox, rabbit, grass)
}

form.elements.rabbit.value = rabbit;

form.elements.rabbit.onchange = function () {
    emulStatus = false;
    emulStatusButtonDom.classList = "stats-menu__button--success";
    emulStatusButtonDom.innerText = "Запустить";
    emulStatusDom.innerHTML = "Симуляция остановлена"
    rabbit = form.elements.rabbit.value
    populate(fox, rabbit, grass)
}

form.elements.grass.value = grass;

form.elements.grass.onchange = function () {
    emulStatus = false;
    emulStatusButtonDom.classList = "stats-menu__button--success";
    emulStatusButtonDom.innerText = "Запустить";
    emulStatusDom.innerHTML = "Симуляция остановлена"
    grass = form.elements.grass.value
    populate(fox, rabbit, grass)
}


//Расчитывает и рендерит статистику популяции
function resetStatistics(displayArray) {
    let fox = 0, rabbit = 0, grass = 0;
    displayArray.forEach((elem) => {
        if (elem.name == "fox") {
            fox += 1;
        } else if (elem.name == "rabbit") {
            rabbit += 1;
        } else if (elem.name == "grass") {
            grass += 1;
        }
    })
    let percentFox = Math.round(fox * 100 / (fox + rabbit + grass));
    let percentRabbit = Math.round(rabbit * 100 / (fox + rabbit + grass));
    let percentGrass = Math.round(grass * 100 / (fox + rabbit + grass));
    populationStatistics.innerHTML = `
        <div class="population-statistics__status-bar" style="width: ${percentFox}%; background: var(--color-red);"></div>
            <div class="population-statistics__text-container">
                <p class="population-statistics__text" >Лисы - ${fox}</p>
                <p class="population-statistics__text">${percentFox}%</p>
            </div>
            <div class="population-statistics__status-bar" style="width: ${percentRabbit}%; background: var(--color-gray);"></div>
            <div class="population-statistics__text-container">
                <p class="population-statistics__text">Кролики - ${rabbit}</p>
                <p class="population-statistics__text">${percentRabbit}%</p>
            </div>
            <div class="population-statistics__status-bar" style="width: ${percentGrass}%; background: var(--color-green);"></div>
            <div class="population-statistics__text-container">
                <p class="population-statistics__text">Трава - ${grass}</p>
                <p class="population-statistics__text">${percentGrass}%</p>
            </div>
    `

}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function reverse(direction) {
    switch (direction) {
        case "right":
            return "left";
            break;
        case "left":
            return "right";
            break;
        case "down":
            return "up";
            break;
        case "up":
            return "down";
            break;
    }
}

//Массив содержащий все сущности
let displayArray = [];

//Родительский класс сущности
class Entity {

    static COUNT_OF_ENTITY = 0;
    name = "empty"
    eaten = 0
    constructor(x = getRandomInt(50), y = getRandomInt(50)) {
        this.id = Entity.COUNT_OF_ENTITY + 1;
        Entity.COUNT_OF_ENTITY += 1;
        this.x = x;
        this.y = y;
        if (!this.isEmptyHere(this.x, this.y, 'g')) {
            while(!this.isEmptyHere(this.x, this.y, 'g')){
                this.x = getRandomInt(50);
                this.y = getRandomInt(50);
            }
        }
    }

    giveBirth() {
        displayArray.push(new Entity(this.x, this.y + 1));
    }

    eat(target) {
        displayArray = displayArray.filter((elem) => {
            return elem.id != target.id
        })
        this.eaten += 1;

        if (this.eaten == 2) {
            this.giveBirth();
            this.eaten = 0
        }
    }

    //Проверяет свободна ли указанная позиция
    isEmptyHere(x, y, except = "grass") {
        let result = true;
        displayArray.forEach((entity) => {
            if (entity.x == x && entity.y == y && entity.name != except) {
                result = false;
            }

        })
        return result
    }

    goTo(direction) {
        if (direction == "down") {
            if (this.y + 1 < 50 && this.isEmptyHere(this.x, this.y + 1)) {
                this.y++
            }
        } else if (direction == "right" && this.isEmptyHere(this.x + 1, this.y)) {
            if (this.x + 1 < 50) {
                this.x++
            }
        } else if (direction == "up" && this.isEmptyHere(this.x, this.y - 1)) {
            if (this.y - 1 > -1) {
                this.y--
            }
        } else if (direction == "left" && this.isEmptyHere(this.x - 1, this.y)) {
            if (this.x - 1 > -1) {
                this.x--
            }
        } else {
            this.goTo(["up", "right", "left", "down"][getRandomInt(4)])
        }
    }

    lookUp(target, place) {
        for (let i = 0; i < 50; i++) {
            for (let j = this.x - i; j < this.x + i + 1; j++) {
                if (this.y - i > -1 && this.y - i < 50 && j > -1 && j < 50) {

                    if (place[this.y - i][j] && place[this.y - i][j].name == target) {
                        return { distance: i, direction: "up", target: place[this.y - i][j] }
                    }
                }

            }
            for (let j = this.x - i; j < this.x + i + 1; j++) {
                if (this.y + i > -1 && this.y + i < 50 && j > -1 && j < 50) {

                    if (place[this.y + i][j] && place[this.y + i][j].name == target) {
                        return { distance: i, direction: "down", target: place[this.y + i][j] }
                    }
                }
            }
            for (let j = this.y - i; j < this.y + i + 1; j++) {
                if (this.x + i > -1 && this.x + i < 50 && j > -1 && j < 50) {

                    if (place[j][this.x - i] && place[j][this.x - i].name == target) {
                        return { distance: i, direction: "left", target: place[j][this.x - i] }
                    }
                }
            }
            for (let j = this.y - i; j < this.y + i + 1; j++) {
                if (this.x + i > -1 && this.x + i < 50 && j > -1 && j < 50) {

                    if (place[j][this.x + i] && place[j][this.x + i].name == target) {
                        return { distance: i, direction: "right", target: place[j][this.x + i] }
                    }
                }
            }
        }
        return { distance: 100, direction: undefined, target: undefined }
    }
}

class Fox extends Entity {
    name = 'fox'
    constructor(x, y) {
        super(x, y)
    }
    giveBirth() {
        displayArray.push(new Fox(this.x, this.y + 1));
    }
}

class Rabbit extends Entity {
    name = 'rabbit'
    constructor(x, y) {
        super(x, y)
    }
    giveBirth() {
        displayArray.push(new Rabbit(this.x, this.y + 1));
    }
}

class Grass extends Entity {
    name = 'grass'
    constructor(x, y) {
        super(x, y)
    }
    giveBirth() {
        displayArray.push(new Grass(this.x, this.y + 1));
    }
}

function populate(fox, rabbit, grass) {
    displayArray = [];
    for (let i = 0; i < fox; i++) {
        displayArray.push(new Fox());
    }
    for (let i = 0; i < rabbit; i++) {
        displayArray.push(new Rabbit());
    }
    for (let i = 0; i < grass; i++) {
        displayArray.push(new Grass());
    }
    render(displayArray);
}

populate(fox, rabbit, grass)

function render(arr) {

    display.innerHTML = ''

    arr.forEach((entity) => {
        display.innerHTML += `<div 
    class="entity--${entity.name ?? 'empty'}"
    style="grid-column-start: ${entity.x + 1}; grid-column-end: ${entity.x + 2}; grid-row-start: ${entity.y + 1}; grid-row-end: ${entity.y + 2};"></div>`
    })

    resetStatistics(displayArray);
}



let emulStatus = false

function startEmul() {
    setTimeout(() => {
        const array2D = Array.from({ length: 50 }, () =>
            Array.from({ length: 50 }, () => null)
        );
        displayArray.forEach((entity) => array2D[entity.y][entity.x] = entity)
        displayArray.forEach((entity) => {
            if (entity.name == "fox") {
                const { distance, direction, target } = entity.lookUp("rabbit", array2D)
                if (distance == 1) {
                    entity.eat(target)
                } else {
                    entity.goTo(direction)
                }
            } else if (entity.name == "rabbit") {
                const { distance: distanceToFox, direction: directionToFox } = entity.lookUp("fox", array2D)
                const { distance: distanceToGrass, direction: directionToGrass, target } = entity.lookUp("grass", array2D)
                if (distanceToFox < 4) {
                    entity.goTo(reverse(directionToFox))
                } else if (distanceToGrass == 1) {
                    entity.eat(target)
                } else {
                    entity.goTo(directionToGrass)
                }
            }
        })

        if (countOfTick % 4 == 0) {
            displayArray.push(new Grass())
        }

        countOfTick += 1;
        render(displayArray)
        if (emulStatus) {
            startEmul();
        }
    }, tickTime)
}

emulStatusButtonDom.addEventListener('click', () => {
    if (emulStatus == false) {
        emulStatus = true;
        startEmul();
        emulStatusButtonDom.classList = "stats-menu__button--error";
        emulStatusButtonDom.innerText = "Остановить";
        emulStatusDom.innerHTML = "Симуляция запущенна"
    } else {
        emulStatus = false;
        emulStatusButtonDom.classList = "stats-menu__button--success";
        emulStatusButtonDom.innerText = "Запустить";
        emulStatusDom.innerHTML = "Симуляция остановлена"
    }
})

emulRestartButtonDom.addEventListener('click', () => {
    emulStatus = false;
    emulStatusButtonDom.classList = "stats-menu__button--success";
    emulStatusButtonDom.innerText = "Запустить";
    emulStatusDom.innerHTML = "Симуляция остановлена"
    populate(fox, rabbit, grass)
})




