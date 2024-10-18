document.addEventListener('DOMContentLoaded', function () {
    loadBratwurstImages();
    setInitialDateTime();
    fetchData(); // Hole die aktuellen Daten beim ersten Laden der Seite
    setInterval(() => fetchData(), 15 * 60 * 1000); // Aktualisiere die Daten alle 15 Minuten

    document.getElementById('fetchButton').addEventListener('click', () => {
        const dateInput = document.getElementById('dateInput').value;
        const timeInput = document.getElementById('timeInput').value;
        if (dateInput && timeInput) {
            fetchData(dateInput, timeInput); // Hole Daten basierend auf den eingegebenen Werten
        } else {
            alert('Bitte Datum und Uhrzeit eingeben');
        }
    });

    function setInitialDateTime() {
        var now = new Date();
        var date = now.toISOString().slice(0, 10);
        var time = now.toTimeString().slice(0, 5);

        document.getElementById('dateInput').value = date;
        document.getElementById('timeInput').value = time;
    }
});

let bratwurstImages = {
    kalt: null,
    warm: null,
    heiss: null
};

let bratwursts = [];
let isBratwurstMoving = false;

// Bratwurstbilder laden
function loadBratwurstImages() {
    bratwurstImages.kalt = new Image();
    bratwurstImages.warm = new Image();
    bratwurstImages.heiss = new Image();

    bratwurstImages.kalt.src = 'images/Bratwurst kalt.png';
    bratwurstImages.warm.src = 'images/Bratwurst warm.png';
    bratwurstImages.heiss.src = 'images/Bratwurst heiss.png';
}

// Daten vom Server abrufen
async function fetchData(date, time) {
    try {
        let apiUrl = 'https://im3.annaabegglen.ch/etl/unload.php';

        if (date && time) {
            apiUrl += `?date=${date}&time=${time}`;
        }

        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        console.log("API data received:", data);

        if (data && data.length > 0) {
            const measuredAt = data[0].measured_at.split(' ');
            const datePart = measuredAt[0];
            const timePart = measuredAt[1];
            const summe = data[0].summe;
            const temperature2m = data[0].temperature_2m;
            const weatherCode = data[0].weather_code;

            console.log(`Date: ${datePart}, Time: ${timePart}, Temperature: ${temperature2m}, Pedestrians: ${summe}, Weather Code: ${weatherCode}`);

            const timeOfDay = getTimeOfDay(timePart);

            if (date && time) {
                displayPastSentence(temperature2m, summe, weatherCode, timeOfDay);
            } else {
                displaySentence(temperature2m, summe, weatherCode, timeOfDay);
            }

            updateBackgroundColor(temperature2m);
            displayWeatherImage(weatherCode, timeOfDay);
            displayBratwursts(summe, temperature2m);
        } else {
            console.log("No data available.");
            document.getElementById('dataDisplay').innerText = 'Keine Daten verfügbar.';
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        document.getElementById('dataDisplay').innerText = 'Fehler beim Laden der Daten.';
    }
}

function getTimeOfDay(timePart) {
    const hour = parseInt(timePart.split(':')[0]);
    if (hour >= 5 && hour < 11) return "Morgen";
    if (hour >= 11 && hour < 13) return "Mittag";
    if (hour >= 13 && hour < 17) return "Nachmittag";
    if (hour >= 17 && hour < 21) return "Abend";
    return "Nacht";
}

function displaySentence(temperature2m, summe, weatherCode, timeOfDay) {
    const description = getWeatherDescription(weatherCode, timeOfDay);
    const frequencyComment = getFrequencyComment(summe);
    const sentenceStart = timeOfDay === "Nacht" ? "Es ist eine" : "Es ist ein";
    const sentence = `${sentenceStart} ${description} ${timeOfDay}, ${temperature2m} Grad<br> und es sind ${summe} Passant*innen unterwegs.<br>${frequencyComment}`;
    document.getElementById('dataDisplay').innerHTML = sentence;
}

function displayPastSentence(temperature2m, summe, weatherCode, timeOfDay) {
    const description = getWeatherDescription(weatherCode, timeOfDay);
    const frequencyComment = getFrequencyComment(summe);
    const sentenceStart = timeOfDay === "Nacht" ? "Es war eine" : "Es war ein";
    const sentence = `${sentenceStart} ${description} ${timeOfDay}, ${temperature2m} Grad<br> und es waren ${summe} Passant*innen unterwegs.<br>${frequencyComment}`;
    document.getElementById('dataDisplay').innerHTML = sentence;
}

function getWeatherDescription(weatherCode, timeOfDay) {
    const isNight = timeOfDay === "Nacht";
    switch (weatherCode) {
        case 0: return isNight ? "klare" : "sonniger";
        case 1:
        case 2:
        case 3: return isNight ? "bewölkte" : "bewölkter";
        case 45:
        case 48: return isNight ? "neblige" : "nebliger";
        case 51:
        case 53:
        case 55: return isNight ? "regnerische" : "regnerischer";
        case 71:
        case 73:
        case 75: return isNight ? "schneereiche" : "schneereicher";
        case 95:
        case 96:
        case 99: return isNight ? "gewittrige" : "gewittriger";
        default: return isNight ? "unbekannte" : "unbekannter";
    }
}

function getFrequencyComment(summe) {
    if (summe > 100) {
        return "Die Passant*innenfrequenz liegt über dem Durchschnitt.";
    } else if (summe >= 50) {
        return "Die Passant*innenfrequenz liegt etwa beim Durchschnitt.";
    } else {
        return "Die Passant*innenfrequenz liegt unter dem Durchschnitt.";
    }
}

function updateBackgroundColor(temperature2m) {
    let backgroundColor;
    if (temperature2m < 0) backgroundColor = "#9595F7";
    else if (temperature2m <= 4.9) backgroundColor = "#9BCAE5";
    else if (temperature2m <= 9.9) backgroundColor = "#A5D2A6";
    else if (temperature2m <= 14.9) backgroundColor = "#FBF380";
    else if (temperature2m <= 19.9) backgroundColor = "#FFB668";
    else backgroundColor = "#FF8989";
    document.body.style.backgroundColor = backgroundColor;
}

function displayWeatherImage(weatherCode, timeOfDay) {
    const images = document.querySelectorAll('.weather-image');
    images.forEach(img => img.style.display = 'none');

    if (timeOfDay === "Abend" || timeOfDay === "Nacht") {
        if ([1, 2, 3].includes(weatherCode)) document.getElementById('Mondwolke').style.display = 'block';
        else document.getElementById('Mond').style.display = 'block';
    } else {
        switch (weatherCode) {
            case 0: document.getElementById('Sonne').style.display = 'block'; break;
            case 1:
            case 2: document.getElementById('Sonnenwolke').style.display = 'block'; break;
            case 3: document.getElementById('Wolke').style.display = 'block'; break;
            case 45:
            case 48: document.getElementById('Nebel').style.display = 'block'; break;
            case 51: document.getElementById('Regen').style.display = 'block'; break;
            case 71: document.getElementById('Schnee').style.display = 'block'; break;
            case 95: document.getElementById('Blitz').style.display = 'block'; break;
        }
    }
}

function displayBratwursts(summe, temperature) {
    bratwursts.forEach(bratwurst => {
        document.body.removeChild(bratwurst.element);
    });
    bratwursts = [];

    let bratwurstImage = temperature < 10 ? bratwurstImages.kalt : temperature < 20 ? bratwurstImages.warm : bratwurstImages.heiss;
    for (let i = 0; i < summe; i++) {
        const bratwurst = {
            element: document.createElement('img'),
            x: Math.random() * (window.innerWidth - 50),
            y: Math.random() * (window.innerHeight - 50),
            dx: (Math.random() - 0.5) * 2,
            dy: (Math.random() - 0.5) * 2
        };
        bratwurst.element.src = bratwurstImage.src;
        bratwurst.element.style.position = 'absolute';
        bratwurst.element.style.width = '30px';
        document.body.appendChild(bratwurst.element);
        bratwursts.push(bratwurst);
    }

    if (!isBratwurstMoving) {
        isBratwurstMoving = true;
        moveBratwursts();
    }
}

function moveBratwursts() {
    bratwursts.forEach(bratwurst => {
        bratwurst.x += bratwurst.dx;
        bratwurst.y += bratwurst.dy;

        if (bratwurst.x <= 0 || bratwurst.x + 30 >= window.innerWidth) bratwurst.dx *= -1;
        if (bratwurst.y <= 0 || bratwurst.y + 30 >= window.innerHeight) bratwurst.dy *= -1;

        bratwurst.element.style.left = bratwurst.x + 'px';
        bratwurst.element.style.top = bratwurst.y + 'px';

        // Abstand zum Cursor prüfen
        const cursorX = parseFloat(document.getElementById('senftube').style.left);
        const cursorY = parseFloat(document.getElementById('senftube').style.top);
        const distanceToCursor = Math.sqrt(Math.pow(bratwurst.x - cursorX, 2) + Math.pow(bratwurst.y - cursorY, 2));

        // Wenn die Bratwurst zu nah am Cursor ist, weicht sie aus
        if (distanceToCursor < 100) {
            const avoidanceSpeed = 2; // Geschwindigkeit des Ausweichens
            if (bratwurst.x < cursorX) bratwurst.x -= avoidanceSpeed; // Weiche nach links aus
            else bratwurst.x += avoidanceSpeed; // Weiche nach rechts aus

            if (bratwurst.y < cursorY) bratwurst.y -= avoidanceSpeed; // Weiche nach oben aus
            else bratwurst.y += avoidanceSpeed; // Weiche nach unten aus
        }
    });

    requestAnimationFrame(moveBratwursts);
}

// Mausbewegung für die Senftube
document.addEventListener('mousemove', function (event) {
    const senftube = document.getElementById('senftube');
    senftube.style.left = event.pageX + 'px';
    senftube.style.top = event.pageY + 'px';
});
