// Weather labels
const WEATHER_LABELS = [
    "☀️  Clear Sky",
    "☁️  Overcast Clouds",
    "🌧️  Light Rain",
    "⛈️  Thunderstorm",
    "❄️  Snowfall",
];

const CYCLE_MS  = 3500;   
const FADE_MS   = 450;    

let labelIndex  = 0;

// Rain HTML
function buildRainHTML(count) {
    let html = "";
    for (let i = 0; i < count; i++) {
        html += `<span class="raindrop" style="
            left:${Math.random() * 100}%;
            height:${15 + Math.random() * 25}px;
            animation-delay:${Math.random() * 2}s;
            animation-duration:${0.8 + Math.random() * 1.2}s;
        "></span>`;
    }
    return html;
}

// Snow HTML
function buildSnowHTML(count) {
    let html = "";
    for (let i = 0; i < count; i++) {
        html += `<span class="snowflake" style="
            left:${Math.random() * 100}%;
            animation-delay:${Math.random() * 5}s;
            animation-duration:${5 + Math.random() * 5}s;
            opacity:${0.25 + Math.random() * 0.4};
        ">❄</span>`;
    }
    return html;
}

// Thunder
function startThunder() {
    const flash = document.getElementById("thunder-flash");
    if (!flash) return;

    function trigger() {
        flash.style.animation = "none";
        void flash.offsetWidth;                          
        flash.style.animation = "thunderPulse 1.2s ease";
        setTimeout(trigger, 4000 + Math.random() * 5000);
    }

    setTimeout(trigger, 2500);
}

function cycleLabel() {
    const textEl = document.getElementById("status-text");
    if (!textEl) return;

  
    textEl.classList.add("fading");

    setTimeout(() => {
        labelIndex = (labelIndex + 1) % WEATHER_LABELS.length;
        textEl.textContent = WEATHER_LABELS[labelIndex];
        textEl.classList.remove("fading");
    }, FADE_MS);
}

document.addEventListener("DOMContentLoaded", () => {

    const rainEl = document.getElementById("hero-rain");
    if (rainEl) rainEl.innerHTML = buildRainHTML(90);

    const snowEl = document.getElementById("hero-snow");
    if (snowEl) snowEl.innerHTML = buildSnowHTML(45);

    startThunder();

    setInterval(cycleLabel, CYCLE_MS);
});
