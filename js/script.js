// Mausbewegung für die Senftube
document.addEventListener('mousemove', function(event) {
    const senftube = document.getElementById('senftube');
    senftube.style.left = event.pageX + 'px';
    senftube.style.top = event.pageY + 'px';
});

// Array, um die Bratwürste zu speichern
let bratwursts = [];
const bratwurstSpeed = 2;
const bratwurstImages = { kalt: null, warm: null, heiss: null }; // Speichert nur die richtigen Bilder
const bratwurstSize = 30; // Kleinere Bratwürste

// Canvas-Element und 2D-Kontext holen
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// Statische Elemente, die nicht berührt werden dürfen (h1, dataDisplay, fetchControls)
const staticElements = [
    { x: 5, y: 450, width: 400, height: 50 }, // h1 Bereich
    { x: 5, y: 500, width: 400, height: 30 }, // dataDisplay Bereich
    { x: 5, y: 530, width: 400, height: 50 }  // fetchControls Bereich
];

// Bratwurstbilder laden
function loadBratwurstImages() {
    const imgKalt = new Image();
    const imgWarm = new Image();
    const imgHeiss = new Image();
    
    imgKalt.src = 'images/Bratwurst kalt.png';
    imgWarm.src = 'images/Bratwurst warm.png';
    imgHeiss.src = 'images/Bratwurst heiss.png';
    
    bratwurstImages.kalt = imgKalt;
    bratwurstImages.warm = imgWarm;
    bratwurstImages.heiss = imgHeiss;
}

// Funktion, um dynamisch basierend auf der Anzahl der Passanten Bratwürste zu erstellen
function createBratwursts(summe, temperature) {
    bratwursts = []; // Bratwürste-Array leeren

    // Bestimme, welches Bild verwendet werden soll, basierend auf der Temperatur
    let bratwurstImage = null;
    if (temperature < 10) {
        bratwurstImage = bratwurstImages.kalt;
    } else if (temperature >= 10 && temperature < 20) {
        bratwurstImage = bratwurstImages.warm;
    } else if (temperature >= 20) {
        bratwurstImage = bratwurstImages.heiss;
    }

    for (let i = 0; i < summe; i++) {
        const bratwurst = {
            x: Math.random() * (canvas.width - bratwurstSize),
            y: Math.random() * (canvas.height - bratwurstSize),
            width: bratwurstSize,
            height: bratwurstSize,
            image: bratwurstImage,
            dx: (Math.random() - 0.5) * bratwurstSpeed,
            dy: (Math.random() - 0.5) * bratwurstSpeed
        };

        bratwursts.push(bratwurst);
    }
}

// Bratwürste zeichnen
function drawBratwursts() {
    bratwursts.forEach(bratwurst => {
        ctx.drawImage(bratwurst.image, bratwurst.x, bratwurst.y, bratwurst.width, bratwurst.height);
    });
}

// Bewegung der Bratwürste
function moveBratwursts() {
    bratwursts.forEach(bratwurst => {
        // Bewegung aktualisieren
        bratwurst.x += bratwurst.dx;
        bratwurst.y += bratwurst.dy;

        // Kollision mit Canvas-Rand erkennen
        if (bratwurst.x <= 0 || bratwurst.x + bratwurst.width >= canvas.width) {
            bratwurst.dx *= -1; // Richtung ändern
        }
        if (bratwurst.y <= 0 || bratwurst.y + bratwurst.height >= canvas.height) {
            bratwurst.dy *= -1; // Richtung ändern
        }

        // Kollision mit statischen Elementen erkennen und vermeiden
        staticElements.forEach(element => {
            if (bratwurst.x < element.x + element.width &&
                bratwurst.x + bratwurst.width > element.x &&
                bratwurst.y < element.y + element.height &&
                bratwurst.y + bratwurst.height > element.y) {
                bratwurst.dx *= -1; // Richtung ändern
                bratwurst.dy *= -1; // Richtung ändern
            }
        });
    });
}

// Canvas-Animation
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Canvas leeren
    moveBratwursts(); // Bratwürste bewegen
    drawBratwursts(); // Bratwürste zeichnen
    requestAnimationFrame(animate); // Wiederholen
}

// Wetterdaten und Fußgängerabfrage

async function fetchData(date, time) {
    try {
        let apiUrl = 'https://im3.annaabegglen.ch/etl/unload.php';

        if (date && time) {
            apiUrl += `?date=${date}&time=${time}`;
        }

        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log("API data received:", data);

        if (data && data.length > 0) {
            const measuredAt = data[0].measured_at.split(' ');
            const datePart = measuredAt[0];
            const timePart = measuredAt[1];
            const summe = data[0].summe; // Anzahl der Passanten
            const temperature2m = data[0].temperature_2m;
            const weatherCode = data[0].weather_code;

            console.log(`Date: ${datePart}, Time: ${timePart}, Temperature: ${temperature2m}, Pedestrians: ${summe}, Weather Code: ${weatherCode}`);

            const timeOfDay = getTimeOfDay(timePart);

            if (date && time) {
                displayPastSentence(temperature2m, summe, weatherCode, timeOfDay); // Vergangenheitsform
            } else {
                displaySentence(temperature2m, summe, weatherCode, timeOfDay); // Gegenwart
            }

            updateBackgroundColor(temperature2m);
            displayWeatherImage(weatherCode, timeOfDay);
            createBratwursts(summe, temperature2m); // Bratwürste entsprechend der Temperatur anzeigen
        } else {
            console.log("No data available.");
            document.getElementById('dataDisplay').innerText = 'Keine Daten verfügbar.';
        }

    } catch (error) {
        console.error("Error fetching data:", error);
        document.getElementById('dataDisplay').innerText = 'Fehler beim Laden der Daten.';
    }
}

// Funktion, um die Tageszeit zu bestimmen
function getTimeOfDay(timePart) {
    const hour = parseInt(timePart.split(':')[0]);
    let timeOfDay = "";

    if (hour >= 5 && hour < 11) {
        timeOfDay = "Morgen";
    } else if (hour >= 11 && hour < 13) {
        timeOfDay = "Mittag";
    } else if (hour >= 13 && hour < 17) {
        timeOfDay = "Nachmittag";
    } else if (hour >= 17 && hour < 21) {
        timeOfDay = "Abend";
    } else {
        timeOfDay = "Nacht";
    }

    return timeOfDay;
}

// Funktion, um den Text basierend auf den Wetterdaten anzuzeigen
function displaySentence(temperature2m, summe, weatherCode, timeOfDay) {
    let description = getWeatherDescription(weatherCode);
    let frequencyComment = getFrequencyComment(summe);

    const sentence = `Es ist ein ${description} ${timeOfDay}, ${temperature2m} Grad<br> und es sind ${summe} Passant*innen an der Vadianstrasse unterwegs.<br>${frequencyComment}`;
    document.getElementById('dataDisplay').innerHTML = sentence;
}

function displayPastSentence(temperature2m, summe, weatherCode, timeOfDay) {
    let description = getWeatherDescription(weatherCode);
    let frequencyComment = getFrequencyComment(summe);

    const sentence = `Es war ein ${description} ${timeOfDay}, ${temperature2m} Grad<br> und es waren ${summe} Passant*innen an der Vadianstrasse unterwegs.<br>${frequencyComment}`;
    document.getElementById('dataDisplay').innerHTML = sentence;
}

// Funktion, um die Wetterbeschreibung zu generieren
function getWeatherDescription(weatherCode) {
    switch (weatherCode) {
        case 0: return "sonniger";
        case 1:
        case 2:
        case 3: return "bewölkter";
        case 45:
        case 48: return "nebliger";
        case 51:
        case 53:
        case 55:
        case 56:
        case 57:
        case 61:
        case 63:
        case 65:
        case 66:
        case 67:
        case 80:
        case 81:
        case 82: return "regnerischer";
        case 71:
        case 73:
        case 75:
        case 77:
        case 85:
        case 86: return "schneereicher";
        case 95:
        case 96:
        case 99: return "gewittriger";
        default: return "unbekannter";
    }
}

function getFrequencyComment(summe) {
    if (summe > 100) {
        return "Die Passant*innenfrequenz liegt über dem Durchschnitt.";
    } else if (summe >= 50 && summe <= 100) {
        return "Die Passant*innenfrequenz liegt etwa beim Durchschnitt.";
    } else {
        return "Die Passant*innenfrequenz liegt unter dem Durchschnitt.";
    }
}

// Funktion, um den Hintergrund basierend auf der Temperatur zu aktualisieren
function updateBackgroundColor(temperature2m) {
    let backgroundColor;

    if (temperature2m < 0) {
        backgroundColor = "#9595F7";
    } else if (temperature2m >= 0 && temperature2m <= 4.9) {
        backgroundColor = "#9BCAE5";
    } else if (temperature2m >= 5 && temperature2m <= 9.9) {
        backgroundColor = "#A5D2A6";
    } else if (temperature2m >= 10 && temperature2m <= 14.9) {
        backgroundColor = "#FBF380";
    } else if (temperature2m >= 15 && temperature2m <= 19.9) {
        backgroundColor = "#FFB668";
    } else if (temperature2m >= 20) {
        backgroundColor = "#FF8989";
    }

    document.body.style.backgroundColor = backgroundColor;
}

// Funktion, um das richtige Wetterbild anzuzeigen
function displayWeatherImage(weatherCode, timeOfDay) {
    const images = document.querySelectorAll('.weather-image');
    images.forEach(img => img.style.display = 'none');

    if (timeOfDay === "Abend" || timeOfDay === "Nacht") {
        if (weatherCode === 1 || weatherCode === 2 || weatherCode === 3) {
            document.getElementById('Mondwolke').style.display = 'block';
        } else {
            document.getElementById('Mond').style.display = 'block';
        }
    } else {
        switch (weatherCode) {
            case 0: document.getElementById('Sonne').style.display = 'block'; break;
            case 1:
            case 2: document.getElementById('Sonnenwolke').style.display = 'block'; break;
            case 3: document.getElementById('Wolke').style.display = 'block'; break;
            case 45:
            case 48: document.getElementById('Nebel').style.display = 'block'; break;
            case 51:
            case 53:
            case 55:
            case 56:
            case 57:
            case 61:
            case 63:
            case 65:
            case 66:
            case 67:
            case 80:
            case 81:
            case 82: document.getElementById('Regen').style.display = 'block'; break;
            case 71:
            case 73:
            case 75:
            case 77:
            case 85:
            case 86: document.getElementById('Schnee').style.display = 'block'; break;
            case 95:
            case 96:
            case 99: document.getElementById('Blitz').style.display = 'block'; break;
        }
    }
}

// Daten automatisch laden, wenn die Seite geladen wird
window.onload = () => {
    loadBratwurstImages();
    fetchData();

    setInterval(() => {
        fetchData();
    }, 15 * 60 * 1000);

    document.getElementById('fetchButton').addEventListener('click', () => {
        const dateInput = document.getElementById('dateInput').value;
        const timeInput = document.getElementById('timeInput').value;
        if (dateInput && timeInput) {
            fetchData(dateInput, timeInput);
        } else {
            alert('Bitte Datum und Uhrzeit eingeben');
        }
    });

    animate(); // Animation starten
};
