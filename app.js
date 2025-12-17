const preloader = document.querySelector("#preloader")
const header = document.querySelector(".header")
const progressBtn = document.querySelector("#progress-btn")
const progressBtnPath = progressBtn.querySelector("svg path")


window.addEventListener("load", () => {
    preloader.classList.add("active")
    animationText()

/* Custom cursor + hover/button animation (appended) */
const cursor = document.getElementById("cursor");
const amount = 20;
const sineDots = Math.floor(amount * 0.3);
const width = 26;
const idleTimeout = 150;
let lastFrame = 0;
let mousePosition = {x: 0, y: 0};
let dots = [];
let timeoutID;
let idle = false;
let hoverButton;
let hoverTL;

class HoverButton {
    constructor(id) {
        this.hovered = false;
        this.animatingHover = false;
        this.forceOut = false;
        this.timing = 0.65;
        this.el = document.getElementById(id);
        if (!this.el) return;
        this.bg = this.el.getElementsByClassName("bg")[0];
        this.el.addEventListener("mouseenter", this.onMouseEnter);
        this.el.addEventListener("mouseleave", this.onMouseLeave);
    }

    onMouseEnter = () => {
        this.hoverInAnim();
    };

    hoverInAnim = () => {
        if (!this.hovered) {
            this.hovered = true;
            this.animatingHover = true;
            this.forceOut = false;
            if (typeof TweenMax !== 'undefined') {
                TweenMax.fromTo(
                    this.bg,
                    this.timing,
                    {x: "-112%"},
                    {
                        x: "-12%",
                        ease: Power3.easeOut,
                        onComplete: () => {
                            this.animatingHover = false;
                            if (this.forceOut) {
                                this.foceOut = false;
                                this.hoverOutAnim();
                            }
                        }
                    }
                );
            }
        }
    };

    onMouseLeave = () => {
        if (!this.animatingHover) {
            this.hoverOutAnim();
        } else {
            this.forceOut = true;
        }
    };

    hoverOutAnim = () => {
        this.hovered = false;
        if (typeof TweenMax !== 'undefined') {
            TweenMax.to(this.bg, this.timing, {
                x: "100%",
                ease: Power3.easeOut,
                onComplete: () => {
                }
            });
        }
    };
}

class Dot {
    constructor(index = 0) {
        this.index = index;
        this.anglespeed = 0.05;
        this.x = 0;
        this.y = 0;
        this.scale = 1 - 0.05 * index;
        this.range = width / 2 - width / 2 * this.scale + 2;
        this.limit = width * 0.75 * this.scale;
        this.element = document.createElement("span");
        this.element.className = 'cursor-dot';
        if (typeof TweenMax !== 'undefined') TweenMax.set(this.element, {scale: this.scale});
        if (cursor) cursor.appendChild(this.element);
    }

    lock() {
        this.lockX = this.x;
        this.lockY = this.y;
        this.angleX = Math.PI * 2 * Math.random();
        this.angleY = Math.PI * 2 * Math.random();
    }

    draw(delta) {
        if (!idle || this.index <= sineDots) {
            if (typeof TweenMax !== 'undefined') TweenMax.set(this.element, {x: this.x, y: this.y});
            else this.element.style.transform = `translate(${this.x}px, ${this.y}px)`;
        } else {
            this.angleX += this.anglespeed;
            this.angleY += this.anglespeed;
            this.y = this.lockY + Math.sin(this.angleY) * this.range;
            this.x = this.lockX + Math.sin(this.angleX) * this.range;
            if (typeof TweenMax !== 'undefined') TweenMax.set(this.element, {x: this.x, y: this.y});
            else this.element.style.transform = `translate(${this.x}px, ${this.y}px)`;
        }
    }
}

class Circle {
    constructor(id) {
        const el = document.getElementById(id);
        if (!el) return;
        const parent = el.parentElement;
        parent.removeChild(el);
        const chars = el.innerText.split("");
        chars.push(" ");
        for (let i = 0; i < chars.length; i++) {
            const span = document.createElement("span");
            span.innerText = chars[i];
            span.className = `char${i + 1}`;
            parent.appendChild(span);
        }
    }
}

function initCursor() {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove);
    hoverButton = new HoverButton("button");
    // eslint-disable-next-line no-new
    new Circle("circle-content");
    lastFrame += new Date();
    buildDots();
    startIdleTimer();
    requestAnimationFrame(render);
}

function startIdleTimer() {
    timeoutID = setTimeout(goInactive, idleTimeout);
    idle = false;
}

function resetIdleTimer() {
    clearTimeout(timeoutID);
    startIdleTimer();
}

function goInactive() {
    idle = true;
    for (let dot of dots) {
        dot.lock();
    }
}

function buildDots() {
    for (let i = 0; i < amount; i++) {
        let dot = new Dot(i);
        dots.push(dot);
    }
}

const onMouseMove = event => {
    mousePosition.x = event.clientX - width / 2;
    mousePosition.y = event.clientY - width / 2;
    resetIdleTimer();
};

const onTouchMove = (event) => {
    mousePosition.x = event.touches[0].clientX - width / 2;
    mousePosition.y = event.touches[0].clientY - width / 2;
    resetIdleTimer();
};

const render = timestamp => {
    const delta = timestamp - lastFrame;
    positionCursor(delta);
    lastFrame = timestamp;
    requestAnimationFrame(render);
};

const positionCursor = delta => {
    let x = mousePosition.x;
    let y = mousePosition.y;
    dots.forEach((dot, index, dots) => {
        let nextDot = dots[index + 1] || dots[0];
        dot.x = x;
        dot.y = y;
        dot.draw(delta);
        if (!idle || index <= sineDots) {
            const dx = (nextDot.x - dot.x) * 0.35;
            const dy = (nextDot.y - dot.y) * 0.35;
            x += dx;
            y += dy;
        }
    });
};

// initialize cursor after DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCursor);
} else {
    initCursor();
}
})

const totalScrollableHeight = document.documentElement.scrollHeight - window.innerHeight
const pathLength = progressBtnPath.getTotalLength()
progressBtnPath.style.strokeDasharray = `${pathLength} ${pathLength}`
// progressBtnPath.style.strokeDashoffset = pathLength

window.addEventListener("scroll", () => {
    // header
    if (window.scrollY > 5) {
        header.classList.add("active")
    } else {
        header.classList.remove("active")
    }

    // header sections
    document.querySelectorAll("section").forEach(current => {
        const id = current.getAttribute("id")
        const h = document.querySelector(`#${id}`).offsetHeight
        const t = document.querySelector(`#${id}`).offsetTop - 80

        if (scrollY > t && scrollY <= t + h) {
            document.querySelector(`.header a[href="#${id}"] button`).classList.add("active")
        } else {
            document.querySelector(`.header a[href="#${id}"] button`).classList.remove("active")
        }
    })

    //progressBtn
    if (window.scrollY > 100) {
        progressBtn.classList.add("active")
    } else {
        progressBtn.classList.remove("active")
    }

    const totalScrollableHeight = document.documentElement.scrollHeight - window.innerHeight
    const scrollPercentage = window.scrollY / totalScrollableHeight
    progressBtnPath.style.strokeDashoffset = pathLength - (scrollPercentage * pathLength)

})

progressBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
})

// ability block
const aboutAbility = document.querySelector("#about .ability")
aboutAbility.querySelectorAll(".ability-block").forEach((block) => {
    block.addEventListener("mouseover", () => {
        const blockHeight = block.clientHeight + 3
        const aboutAbilityRect = aboutAbility.getBoundingClientRect()
        const blockRect = block.getBoundingClientRect()
        const blockTop = blockRect.top - aboutAbilityRect.top

        aboutAbility.style.setProperty("--data-height", `${blockHeight}px`)
        aboutAbility.style.setProperty("--data-top", `${(blockTop)}px`)
    })
})

// animation text
function animationText() {
    const aniText = document.querySelector("#ani-txt")
    const words = [
        "WEB DEVELOPER",
        "Security Researcher",
        "DESIGNER",
        "ETHICAL HACKING",
        "CONTENT CREATION"
    ]

    let indexText = 0

    setInterval(() => {
        if (indexText == words.length) indexText = 0

        addRandomTextContent(words[indexText])
        indexText++
    }, 4000)

    function getRandomChar() {
        const glitchChars = "X六0@ƒ1{!<>-_/[]{}░▒▓—åß∂ƒ©˙∆˚æ≈ç√∫=+*^?#λ$"
        return glitchChars[Math.floor(Math.random() * glitchChars.length)]
    }

    function getRandomWord(value) {
        let finalVal = ""
        for (let i = 0; i < value.length; i++) {
            finalVal += value[i] == " " ? " " : getRandomChar()
        }
        return finalVal
    }

    function addRandomTextContent(word) {
        aniText.innerHTML = getRandomWord(word)

        const totalRounds = 2
        const interval = 50
        let count = 0
        let globalCount = 0
        let canChange = false

        let timer_ = setInterval(() => {
            let finalValue = ""

            for (let i = 0; i < word.length; i++) {
                if (i <= count && canChange) {
                    finalValue += word[i]
                } else {
                    finalValue += getRandomChar()
                }
            }

            aniText.innerHTML = finalValue

            if (canChange) count++
            if (globalCount == totalRounds) canChange = true
            if (count == word.length) {
                clearInterval(timer_)
                count = 0
                globalCount = 0
                canChange = false
            }

            globalCount++
        }, interval)
    }
}

