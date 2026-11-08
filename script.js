
/* =====================================
   ROYAL DIWALI 2026 - MAIN JAVASCRIPT
===================================== */

/* LIVE CLOCK */

function updateClock() {
    document.getElementById("liveClock").textContent =
        new Date().toLocaleString("en-IN", {
            weekday: "long",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
}

updateClock();
setInterval(updateClock, 1000);


/* =====================================
   MUSIC PLAYER
===================================== */

const music = document.getElementById("music");
const musicButton = document.getElementById("musicButton");
const volume = document.getElementById("volume");

music.volume = 0.5;

async function toggleMusic() {

    if (music.paused) {
        try {
            await music.play();
            musicButton.textContent = "⏸ Pause Music";
        } catch (error) {
            alert("Music file not found! Check music.mp3.");
        }
    } else {
        music.pause();
        musicButton.textContent = "🎵 Play Music";
    }
}

volume.addEventListener("input", () => {
    music.volume = Number(volume.value);
});


/* =====================================
   ROYAL THEME SWITCH
===================================== */

function toggleTheme() {

    document.body.classList.toggle("light-theme");

    const isLight =
        document.body.classList.contains("light-theme");

    document.getElementById("themeButton").textContent =
        isLight ? "🌞 Dark Theme" : "🌙 Light Theme";
}


/* =====================================
   SKYSHOT FIREWORK ENGINE
===================================== */

const canvas = document.getElementById("sky");
const ctx = canvas.getContext("2d");

let rockets = [];
let sparks = [];
let celebrationTimer = null;

const colours = [
    "#FFD700",
    "#FF3D68",
    "#00E5FF",
    "#B66CFF",
    "#FFFFFF",
    "#FF8C00",
    "#6EFFA5",
    "#FF4DE1"
];

function resizeSky() {

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;

    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

resizeSky();

window.addEventListener("resize", resizeSky);


/* CREATE ROCKET */

function launchRocket(x, targetY, style = "normal") {

    const color =
        colours[Math.floor(Math.random() * colours.length)];

    rockets.push({

        x: x,
        y: window.innerHeight + 10,

        targetY: targetY,

        vx: (Math.random() - 0.5) * 1.5,
        vy: -(Math.random() * 3 + 7),

        color: color,

        style: style,

        trail: []

    });
}


/* CREATE EXPLOSION */

function explode(x, y, color, style = "normal") {

    let count = 100;

    if (style === "mega") count = 190;
    if (style === "ring") count = 130;
    if (style === "heart") count = 150;

    for (let i = 0; i < count; i++) {

        let angle;
        let speed;

        if (style === "ring") {

            angle = (Math.PI * 2 * i) / count;
            speed = 4 + Math.random() * 1.5;

        } else if (style === "heart") {

            const t = Math.PI * 2 * i / count;

            const hx = 16 * Math.pow(Math.sin(t), 3);

            const hy =
                13 * Math.cos(t) -
                5 * Math.cos(2*t) -
                2 * Math.cos(3*t) -
                Math.cos(4*t);

            sparks.push({

                x: x,
                y: y,

                vx: hx * 0.22,
                vy: -hy * 0.22,

                color: color,
                life: 90,
                maxLife: 90,
                size: 2 + Math.random() * 2

            });

            continue;

        } else {

            angle = Math.random() * Math.PI * 2;
            speed = Math.random() * 7 + 1;

        }

        sparks.push({

            x: x,
            y: y,

            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,

            color: color,

            life: 65 + Math.random() * 35,
            maxLife: 100,

            size: Math.random() * 3 + 1

        });
    }

    /* EXTRA GOLD SPARKLES */

    for (let i = 0; i < 35; i++) {

        let angle = Math.random() * Math.PI * 2;
        let speed = Math.random() * 3 + 1;

        sparks.push({

            x: x,
            y: y,

            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,

            color: "#FFD700",

            life: 90,
            maxLife: 90,

            size: 2

        });
    }
}


/* ANIMATE SKY */

function animateSky() {

    ctx.clearRect(
        0, 0,
        window.innerWidth,
        window.innerHeight
    );

    /* ROCKETS */

    for (let i = rockets.length - 1; i >= 0; i--) {

        const r = rockets[i];

        r.trail.push({
            x: r.x,
            y: r.y
        });

        if (r.trail.length > 9) {
            r.trail.shift();
        }

        r.x += r.vx;
        r.y += r.vy;

        r.vy += 0.045;

        /* Rocket glowing trail */

        r.trail.forEach((point, index) => {

            ctx.globalAlpha = index / r.trail.length;

            ctx.fillStyle = r.color;

            ctx.beginPath();

            ctx.arc(
                point.x,
                point.y,
                2 + index * 0.2,
                0,
                Math.PI * 2
            );

            ctx.fill();
        });

        ctx.globalAlpha = 1;

        /* Rocket head */

        ctx.shadowBlur = 20;
        ctx.shadowColor = r.color;

        ctx.fillStyle = "#FFFFFF";

        ctx.beginPath();
        ctx.arc(r.x, r.y, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;

        /* BURST */

        if (r.y <= r.targetY || r.vy >= -0.5) {

            explode(r.x, r.y, r.color, r.style);

            rockets.splice(i, 1);
        }
    }


    /* PARTICLE EXPLOSIONS */

    for (let i = sparks.length - 1; i >= 0; i--) {

        const p = sparks[i];

        p.x += p.vx;
        p.y += p.vy;

        p.vx *= 0.985;
        p.vy *= 0.985;

        p.vy += 0.045;

        p.life--;

        const alpha = Math.max(
            0,
            p.life / p.maxLife
        );

        ctx.globalAlpha = alpha;

        ctx.fillStyle = p.color;

        ctx.shadowBlur = 12;
        ctx.shadowColor = p.color;

        ctx.beginPath();

        ctx.arc(
            p.x,
            p.y,
            p.size,
            0,
            Math.PI * 2
        );

        ctx.fill();

        if (p.life <= 0) {
            sparks.splice(i, 1);
        }
    }

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

    requestAnimationFrame(animateSky);
}

animateSky();


/* =====================================
   FIREWORK SHOW STYLES
===================================== */

function randomSkyshot() {

    const x =
        Math.random() * window.innerWidth * 0.8 +
        window.innerWidth * 0.1;

    const targetY =
        Math.random() * window.innerHeight * 0.4 +
        60;

    const styles = [
        "normal",
        "normal",
        "mega",
        "ring",
        "heart"
    ];

    const style =
        styles[Math.floor(Math.random() * styles.length)];

    launchRocket(x, targetY, style);
}


/* GRAND CELEBRATION */

function startCelebration() {

    stopCelebration();

    let count = 0;

    randomSkyshot();

    celebrationTimer = setInterval(() => {

        randomSkyshot();

        if (Math.random() > 0.4) {
            setTimeout(randomSkyshot, 250);
        }

        count++;

        if (count >= 18) {
            stopCelebration();
        }

    }, 750);
}


/* STOP AUTO SHOW */

function stopCelebration() {

    if (celebrationTimer !== null) {
        clearInterval(celebrationTimer);
        celebrationTimer = null;
    }
}


/* =====================================
   DIVINE DIYAS
===================================== */

function lightDiyas() {

    showDisplay(
        "🪔 The Divine Lighting Ceremony",

        `<div class="big-art">🪔 ✨ 🪔 ✨ 🪔</div>
        <p>
        Let every diya bring a new ray of hope,
        happiness and prosperity into your life.
        </p>
        <div class="big-art">🌟 🌸 🌟</div>`
    );

    for (let i = 0; i < 4; i++) {
        setTimeout(randomSkyshot, i * 400);
    }
}


/* =====================================
   RANGOLI
===================================== */

function showRangoli() {

    showDisplay(
        "🎨 Royal Rangoli",

        `<div class="rangoli-art">🌺</div>
        <p>
        Colours of tradition, beauty and happiness!
        </p>
        <div class="big-art">🌸 🪷 🌸</div>`
    );
}


/* =====================================
   SURPRISE GIFT
===================================== */

function openGift() {

    showDisplay(
        "🎁 A Royal Surprise",

        `<div class="big-art">🎁</div>
        <h2 style="color:gold">You Are Special!</h2>
        <p>
        May your dreams turn into reality,
        and may happiness always find its way to you.
        </p>
        <div class="big-art">❤️ ✨ ❤️</div>`
    );

    setTimeout(randomSkyshot, 300);
    setTimeout(randomSkyshot, 800);
}


/* =====================================
   DIWALI WISH GENERATOR
===================================== */

const wishes = [

    "May your home shine with happiness and prosperity! 🪔",

    "May every diya bring new hope and endless joy! ✨",

    "Wishing you success, peace and beautiful memories! 💛",

    "May your life sparkle brighter than a thousand stars! 🎆",

    "May Goddess Lakshmi bless your home with abundance! 🌸",

    "Wishing you and your family a wonderful Diwali! ❤️",

    "May this festival bring new opportunities and blessings! 🌟"

];

function newWish() {

    const index =
        Math.floor(Math.random() * wishes.length);

    document.getElementById("wishText").textContent =
        wishes[index];
}


/* SHARE WISH */

async function shareWish() {

    const wish =
        document.getElementById("wishText").textContent;

    if (navigator.share) {

        try {
            await navigator.share({
                title: "Happy Diwali",
                text: wish
            });
        } catch (error) {}

    } else {

        try {
            await navigator.clipboard.writeText(wish);
            alert("Wish copied! You can share it now.");
        } catch (error) {
            alert(wish);
        }
    }
}


/* =====================================
   GOLDEN PARTICLES
===================================== */

let particlesEnabled = true;

function createParticle() {

    if (!particlesEnabled) return;

    const p = document.createElement("div");

    p.className = "particle";
    p.textContent = "✦";

    p.style.position = "fixed";
    p.style.left = Math.random() * 100 + "%";
    p.style.bottom = "-20px";

    p.style.fontSize =
        (Math.random() * 18 + 10) + "px";

    p.style.color = "#FFD700";
    p.style.pointerEvents = "none";
    p.style.zIndex = "5";

    p.style.animation = "floatParticle 6s linear forwards";

    document.body.appendChild(p);

    setTimeout(() => p.remove(), 6000);
}

const particleStyle = document.createElement("style");

particleStyle.textContent = `
@keyframes floatParticle {
    to {
        transform: translateY(-110vh) rotate(360deg);
        opacity: 0;
    }
}`;

document.head.appendChild(particleStyle);

setInterval(createParticle, 500);

function toggleParticles() {

    particlesEnabled = !particlesEnabled;

    showDisplay(
        "✨ Golden Particle Effects",
        `<div class="big-art">
        ${particlesEnabled ? "✨ 🌟 ✨" : "⏸️"}
        </div>
        <p>
        Golden particles are now
        ${particlesEnabled ? "enabled." : "disabled."}
        </p>`
    );
}


/* =====================================
   WISH FOUNTAIN
===================================== */

function wishFountain() {

    const x = window.innerWidth / 2;

    for (let i = 0; i < 7; i++) {

        setTimeout(() => {

            launchRocket(
                x + (Math.random() - 0.5) * 150,
                window.innerHeight * 0.25,
                "mega"
            );

        }, i * 180);
    }

    showDisplay(
        "🌟 Golden Wish Fountain",
        `<div class="big-art">🌟 ✨ 🌟</div>
        <p>
        May all your good wishes shine bright!
        </p>`
    );
}


/* =====================================
   CELEBRATION BELL
===================================== */

let audioContext;

function ringBell() {

    try {

        const AudioContext =
            window.AudioContext || window.webkitAudioContext;

        if (!audioContext) {
            audioContext = new AudioContext();
        }

        if (audioContext.state === "suspended") {
            audioContext.resume();
        }

        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();

        oscillator.type = "sine";
        oscillator.frequency.value = 880;

        gain.gain.setValueAtTime(
            0.0001,
            audioContext.currentTime
        );

        gain.gain.exponentialRampToValueAtTime(
            0.25,
            audioContext.currentTime + 0.03
        );

        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            audioContext.currentTime + 2
        );

        oscillator.connect(gain);
        gain.connect(audioContext.destination);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 2);

    } catch (error) {
        alert("Your browser does not support this sound.");
    }

    showDisplay(
        "🔔 Celebration Bell",
        `<div class="big-art">🔔 ✨ 🔔</div>
        <p>May peace and happiness fill your home.</p>`
    );
}


/* =====================================
   DISPLAY CONTENT
===================================== */

function showDisplay(title, content) {

    const section =
        document.getElementById("displaySection");

    document.getElementById("displayTitle").textContent =
        title;

    document.getElementById("displayContent").innerHTML =
        content;

    section.hidden = false;

    section.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}


/* =====================================
   PERSONALIZED GREETING CARD
===================================== */

function openCard() {

    document.getElementById("cardModal").style.display =
        "flex";

    document.getElementById("cardInput").focus();
}

function closeCard() {

    document.getElementById("cardModal").style.display =
        "none";
}

function createCard() {

    const name =
        document.getElementById("cardInput").value.trim();

    if (!name) {
        alert("Please enter your name!");
        return;
    }

    document.getElementById("generatedName").textContent =
        name;

    const style =
        document.getElementById("cardStyle").value;

    const card =
        document.getElementById("greetingCard");

    card.classList.remove("gold", "purple", "red");
    card.classList.add(style);

    closeCard();

    document.getElementById("cardArea").hidden = false;

    document.getElementById("cardArea").scrollIntoView({
        behavior: "smooth"
    });
}


/* DOWNLOAD CARD */

async function downloadCard() {

    if (typeof html2canvas === "undefined") {
        alert("Download library unavailable. Check internet.");
        return;
    }

    try {

        const card =
            document.getElementById("greetingCard");

        const image = await html2canvas(card, {
            scale: 2,
            backgroundColor: "#38102d"
        });

        const link = document.createElement("a");

        link.download = "Royal-Diwali-2026.png";
        link.href = image.toDataURL("image/png");

        link.click();

    } catch (error) {

        alert("Unable to download card. Try again.");

    }
}


/* SHARE CARD IMAGE */

async function shareCard() {

    if (typeof html2canvas === "undefined") {
        alert("Download library unavailable.");
        return;
    }

    try {

        const canvas = await html2canvas(
            document.getElementById("greetingCard"),
            {scale: 2}
        );

        const blob = await new Promise(resolve =>
            canvas.toBlob(resolve, "image/png")
        );

        if (!blob) throw new Error("Image creation failed");

        const file = new File(
            [blob],
            "Royal-Diwali-2026.png",
            {type: "image/png"}
        );

        if (
            navigator.canShare &&
            navigator.canShare({files: [file]})
        ) {

            await navigator.share({
                title: "My Royal Diwali Card",
                files: [file]
            });

        } else {

            await downloadCard();

            alert("Your card was downloaded. You can share it now.");

        }

    } catch (error) {

        if (error.name !== "AbortError") {
            alert("Unable to share card.");
        }

    }
}


/* CLOSE CARD MODAL OUTSIDE */

document.getElementById("cardModal")
.addEventListener("click", function(event) {

    if (event.target === this) {
        closeCard();
    }

});
