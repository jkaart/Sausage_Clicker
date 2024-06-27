"use strict";

let clicks = 0;

let speedFactor = 1;
const clickSpeedPrice = 10;

const thresholds = {
    clickSpeed: 100,
    autoClicker: 500
};

const clickCounter = document.getElementById("clickCounter");
const clickFactor = document.getElementById("clickSpeedLabel");
const autoClickPriceLbl = document.getElementById("autoClickPrice");
autoClickPriceLbl.textContent = `Reach ${thresholds.autoClicker} sausages to enable AutoClicker`;
const clickSpeedPriceLbl = document.getElementById("clickSpeedPrice");
clickSpeedPriceLbl.textContent = `Reach ${thresholds.clickSpeed} sausages to enable Click speed increase`;

const buttonImg = document.getElementById("buttonImg");

class Button {
    constructor(htmlElement) {
        this.button = document.getElementById(htmlElement);
        this.isClicked = false;
    }

    show() {
        this.button.disabled = false;
        this.button.classList.remove("disabled");
    }

    hide() {
        this.button.disabled = true;
        this.button.classList.add("disabled");
    }

    addClickEvent(f) {
        this.button.addEventListener("click", f);
    }

    /**
     * @param {string | null} name
     */
    set label(name) {
        this.button.textContent = name;
    }

    /**
     * @param {boolean} boolean
     */
    set clicked(boolean) {
        this.isClicked = boolean;
    }

    get clickStatus() {
        return this.isClicked;
    }
}

class AutoClicker {
    constructor(threshold) {
        this.autoClickThreshold = threshold;
        this.isRunning = false;
        this.interval;
        this.autoClkClicked = false;
    }

    start() {
        this.interval = setInterval(() => {
            clickAnim();
            clicks += 1;
            updateCounter();
        }, 1000);
        this.isRunning = true;
    }

    stop() {
        clearInterval(this.interval);
        this.isRunning = false;
    }
}

const clicksFormat = (input) => {
    if (input >= 1000 && input < 100_000) { return (input / 1000).toFixed(2) + " K"; } else
        if (input >= 100_000 && input < 1_000_000) { return (input / 1000).toFixed(0) + " K"; } else
            if (input >= 1_000_000) { return (input / 1_000_000).toFixed(2) + " M"; } else
                return input;
};

const updateCounter = () => {
    clickCounter.innerText = clicksFormat(Math.round(clicks));
};

const clickAnim = () => {
    if (!buttonImg.classList.contains("btnClick")) {
        buttonImg.classList.add("btnClick");
        setTimeout(() => { 
            buttonImg.classList.remove("btnClick"); 
        }, 750);
    }
};

const clickCount = () => {
    clicks = clicks + (1 * speedFactor);
    updateUI();
};

const updateUI = () => {
    if (clicks - clickSpeedPrice > 0) {
        if (clicks >= thresholds.clickSpeed || buttons.increaseClickSpeed.clickStatus) {
            clickSpeedPriceLbl.textContent = `${clickSpeedPrice} sausages / 0.1 clk increase`;
            buttons.increaseClickSpeed.show();
        }
        else {
            buttons.increaseClickSpeed.hide();
        }
    }
    else {
        buttons.increaseClickSpeed.hide();
    }

    if (clicks >= thresholds.autoClicker) {
        buttons.autoBtn.clicked = true;
        buttons.autoBtn.show();

    }

    if (!autoClicker.isRunning) {
        buttons.autoBtn.label = "Start";
    }
    else {
        buttons.autoBtn.label = "Stop";
        buttons.autoBtn.show();
    }

    if (buttons.autoBtn.clickStatus) {
        autoClickPriceLbl.textContent = "";
    }

    updateCounter();
};

const autoClicker = new AutoClicker(thresholds.autoClicker);

const buttons = {
    clickBtn: new Button("clickBtn"),
    autoBtn: new Button("startAuto"),
    increaseClickSpeed: new Button("increaseClickSpeed")
};

buttons.clickBtn.addClickEvent(clickCount);
buttons.autoBtn.addClickEvent(() => {
    if (autoClicker.isRunning) {
        autoClicker.stop();
    }
    else {
        autoClicker.start();
        buttons.autoBtn.clicked = true;
    }
    updateUI();
});

buttons.increaseClickSpeed.addClickEvent(() => {
    if (clicks - clickSpeedPrice > 0) {
        if ((clicks > clickSpeedPrice) || buttons.increaseClickSpeed.clickStatus) {
            buttons.increaseClickSpeed.clicked = true;
            speedFactor = (speedFactor * 10 + 0.1 * 10) / 10;
            clickFactor.textContent = speedFactor;
            clicks = clicks - clickSpeedPrice;
            updateUI();
        }
    }
});

updateUI();
