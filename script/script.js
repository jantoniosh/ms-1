let w = 864;
let audio = new Array(6);
let fft;
let amplitude;
let delay = new Array(6);
let reverb = new Array(6);
let angA, angB, angC;
let act = new Array(6);
let pos = new Array(6);
let begin = false;
let btnAudio;
let font

function preload() {
    for (let i = 0; i < audio.length; i++) {
        audio[i] = loadSound(`audio/${i}a.mp3`)
    }
    font = loadFont('font/mexcellent_rg.otf');
}

function setup() {
    let cnv = createCanvas(w, w);
    cnv.mousePressed(canvasPressed);
    fft = new p5.FFT(0.2, 64);
    amplitude = new p5.Amplitude();

    for (let i = 0; i < audio.length; i++) {
        audio[i].disconnect();
        delay[i] = new p5.Delay();
        reverb[i] = new p5.Reverb();
        delay[i].process(audio[i], 0.12, .5, 2300);
        reverb[i].process(audio[i]);
    }

    angA = PI;
    angB = PI;
    angC = PI;
    pos[0] = {
        x: 354,
        y: 630
    };
    pos[1] = {
        x: 255,
        y: 630
    };
    pos[2] = {
        x: 156,
        y: 630
    };
    pos[3] = {
        x: 354,
        y: 531
    };
    pos[4] = {
        x: 255,
        y: 531
    };
    pos[5] = {
        x: 156,
        y: 531
    };
}

function draw() {
    background("#43a25f");
    rectMode(CENTER);
    stroke("#fff");
    strokeWeight(9);
    noFill();
    rect(w / 2, w / 2, 660, 520, 21);
    rect(w / 2, 255, 490, 120, 21);
    ellipse(510, 531, 78);
    ellipse(609, 531, 78);
    ellipse(708, 531, 78);
    line(510, 531, 510 + 39 * cos(angA), 531 + 39 * sin(angA));
    line(609, 531, 609 + 39 * cos(angB), 531 + 39 * sin(angB));
    line(708, 531, 708 + 39 * cos(angC), 531 + 39 * sin(angC));

    for (let i = 0; i < pos.length; i++) {
        act[i] ? fill(255) : noFill();
        rect(pos[i].x, pos[i].y, 78, 78, 12);
    }

    noFill();

    let level = amplitude.getLevel();
    let s = map(level, 0, 1, -4, 32);

    let d = 3;
    let sDx = 240 / d;
    let sDy = 120 / d

    for (let i = 1; i <= d; i++) {
        ellipse(267, 402, i * sDx + s, i * sDy + s);
    }

    for (let i = 1; i <= d; i++) {
        ellipse(597, 402, i * sDx + s, i * sDy + s);
    }

    let waveform = fft.waveform();

    beginShape();
    for (let i = 0; i < waveform.length; i++) {
        let x = map(i, 0, waveform.length, 187, 677);
        let y = map(waveform[i], -1, 1, 306, 204);
        vertex(x, y);
    }
    endShape();
    if (begin) {
        if (!audio[btnAudio].isPlaying()) {
            console.log("sin reproducir, cambio");
            setRandomData();
        }
        else {
            console.log("reproduciendo");
        }
    }

    textFont(font);
    fill(255);
    textSize(60);
    noStroke();
    text('ms 1', 570, 645);
}

function canvasPressed() {
    btnAudio = parseInt(random(0, 6));
    cleanRect();
    act[btnAudio] = true;
    audio[btnAudio].play();
    begin = true;
}

function setRandomData() {

    btnAudio = parseInt(random(0, 6));
    cleanRect();
    act[btnAudio] = true;
    audio[btnAudio].play();
    let dela = parseFloat(random().toFixed(2));
    let feed = parseFloat(random().toFixed(2));
    let dry = parseFloat(random().toFixed(2));
    delay[btnAudio].delayTime(dela);
    delay[btnAudio].feedback(feed);
    reverb[btnAudio].drywet(dry);

    angA = map(dela, 0, 1, PI, TWO_PI);
    angB = map(feed, 0, 1, PI, TWO_PI);
    angC = map(dry, 0, 1, PI, TWO_PI);
}

function cleanRect() {
    for (let i = 0; i < act.length; i++) {
        act[i] = false;
    }
}


