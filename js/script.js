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

const display = document.getElementById("display");

let displayArray = [];

class Entity {
    static COUNT_OF_ENTITY = 0;
    name = "empty"
    constructor(x = getRandomInt(50), y = getRandomInt(50)) {
        this.id = Entity.COUNT_OF_ENTITY + 1;
        Entity.COUNT_OF_ENTITY += 1;
        this.x = x;
        this.y = y;
    }
    goTo(direction) {
        if (direction == "down") {
            if (this.y + 1 < 50) {
                this.y++
            }
        } else if (direction == "right") {
            if (this.x + 1 < 50) {
                this.x++
            }
        } else if (direction == "up") {
            if (this.y - 1 > -1) {
                this.y--
            }
        } else if (direction == "left") {
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
    constructor() {
        super()
    }
}

class Rabbit extends Entity {
    name = 'rabbit'
    constructor() {
        super()
    }
}

class Grass extends Entity {
    name = 'grass'
    constructor() {
        super()
    }
}

displayArray.push(new Rabbit);
displayArray.push(new Rabbit);
displayArray.push(new Fox);
displayArray.push(new Rabbit);
displayArray.push(new Rabbit);
displayArray.push(new Fox);
displayArray.push(new Grass);
displayArray.push(new Grass);
displayArray.push(new Grass);
displayArray.push(new Grass);
displayArray.push(new Grass);
displayArray.push(new Grass);
displayArray.push(new Grass);
displayArray.push(new Grass);
displayArray.push(new Grass);
displayArray.push(new Grass);
displayArray.push(new Grass);
displayArray.push(new Grass);

function render(arr) {

    display.innerHTML = ''

    arr.forEach((entity) => {
        display.innerHTML += `<div 
    class="entity--${entity.name ?? 'empty'}"
    style="grid-column-start: ${entity.x + 1}; grid-column-end: ${entity.x + 2}; grid-row-start: ${entity.y + 1}; grid-row-end: ${entity.y + 2};"></div>`
    })
}

const emulStatusDom = document.getElementById("emul-status");

const emulStatusButtonDom = document.getElementById("emul-status-button");

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
                    displayArray = displayArray.filter((elem) => {
                        return elem.id != target.id
                    })
                } else {
                    entity.goTo(direction)
                }
            } else if (entity.name == "rabbit") {
                const { distance: distanceToFox, direction: directionToFox } = entity.lookUp("fox", array2D)
                const { distance: distanceToGrass, direction: directionToGrass, target } = entity.lookUp("grass", array2D)
                if (distanceToFox < 4) {
                    console.log("До лисы - " + distanceToFox + " она в направлении " + directionToFox)
                    entity.goTo(reverse(directionToFox))
                    console.log("Убегаю от неё в направлении " + reverse(directionToFox))
                } else if (distanceToGrass == 1) {
                    displayArray = displayArray.filter((elem) => {
                        return elem.id != target.id
                    })
                } else {
                    entity.goTo(directionToGrass)
                }
            }
        })
        render(displayArray)
        if (emulStatus) {
            startEmul();
        }
    }, 500)
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




