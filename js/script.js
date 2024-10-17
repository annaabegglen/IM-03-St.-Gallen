document.addEventListener('DOMContentLoaded', function() {
    loadBratwurstImages();
    setInitialDateTime();
    fetchData();
    setInterval(() => fetchData(), 15 * 60 * 1000); // Aktualisiere die Daten alle 15 Minuten

    document.getElementById('fetchButton').addEventListener('click', () => {
        fetchData();
    });

    function setInitialDateTime() {
        var now = new Date();
        var date = now.toISOString().slice(0, 10);
        var time = now.toTimeString().slice(0, 5);

        document.getElementById('dateInput').value = date;
        document.getElementById('timeInput').value = time;
    }
});

function loadBratwurstImages() {
    const bratwurstImages = {
        kalt: new Image(),
        warm: new Image(),
        heiss: new Image()
    };
    bratwurstImages.kalt.src = 'images/Bratwurst kalt.png';
    bratwurstImages.warm.src = 'images/Bratwurst warm.png';
    bratwurstImages.heiss.src = 'images/Bratwurst heiss.png';
}

function fetchData() {
    let date = document.getElementById('dateInput').value;
    let time = document.getElementById('timeInput').value;
    let apiUrl = `https://im3.annaabegglen.ch/etl/unload.php?date=${date}&time=${time}`;

    fetch(apiUrl).then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
    }).then(data => {
        if (!data || data.length === 0) {
            document.getElementById('dataDisplay').innerText = 'Keine Daten verfügbar.';
            return;
        }
        displayWeatherData(data[0]);
    }).catch(error => {
        console.error("Error fetching data:", error);
        document.getElementById('dataDisplay').innerText = 'Fehler beim Laden der Daten.';
    });
}

function displayWeatherData(data) {
    const { temperature_2m, summe, weather_code } = data;
    const sentence = `Es ist ein ${getWeatherDescription(weather_code)}, ${temperature_2m} Grad<br> und es sind ${summe} Passant*innen unterwegs.`;
    document.getElementById('dataDisplay').innerHTML = sentence;
}

function getWeatherDescription(weatherCode) {
    // Hier könnte eine komplette Implementierung zur Generierung einer Wetterbeschreibung hinzugefügt werden
    return 'schöner Tag'; // Beispielhafte Implementierung
}

// Mausbewegung für die Senftube
document.addEventListener('mousemove', function(event) {
    const senftube = document.getElementById('senftube');
    senftube.style.left = event.pageX + 'px';
    senftube.style.top = event.pageY + 'px';
});

// Bratwurstbilder
const bratwurstImages = {
    kalt: null,
    warm: null,
    heiss: null
};

// Bratwurstbilder laden
function loadBratwurstImages() {
    bratwurstImages.kalt = new Image();
    bratwurstImages.warm = new Image();
    bratwurstImages.heiss = new Image();

    bratwurstImages.kalt.src = 'images/Bratwurst kalt.png';
    bratwurstImages.warm.src = 'images/Bratwurst warm.png';
    bratwurstImages.heiss.src = 'images/Bratwurst heiss.png';
}

// Array für die Bratwürste
let bratwursts = [];

// Funktion, um die Bratwürste anzuzeigen und ihre Bewegung zu initialisieren
function displayBratwursts(summe, temperature) {
    // Alte Bratwürste entfernen
    bratwursts.forEach(bratwurst => {
        document.body.removeChild(bratwurst.element);
    });

    bratwursts = []; // Leere das Array der Bratwürste

    // Wähle das richtige Bild basierend auf der Temperatur
    let bratwurstImage = null;
    if (temperature < 10) {
        bratwurstImage = bratwurstImages.kalt;
    } else if (temperature >= 10 && temperature < 20) {
        bratwurstImage = bratwurstImages.warm;
    } else if (temperature >= 20) {
        bratwurstImage = bratwurstImages.heiss;
    }

    // Bratwürste erstellen und initialisieren
    for (let i = 0; i < summe; i++) {
        const bratwurst = {
            element: document.createElement('img'),
            x: Math.random() * (window.innerWidth - 50), // Zufällige x-Position
            y: Math.random() * (window.innerHeight - 50), // Zufällige y-Position
            dx: (Math.random() - 0.5) * 2, // Schneller zufällige x-Richtung
            dy: (Math.random() - 0.5) * 2 // Schneller zufällige y-Richtung
        };

        bratwurst.element.src = bratwurstImage.src; // Setze die Bildquelle
        bratwurst.element.style.position = 'absolute';
        bratwurst.element.style.width = '30px'; // Setze die Breite
        bratwurst.element.style.height = 'auto'; // Behalte das Seitenverhältnis bei
        document.body.appendChild(bratwurst.element); // Füge das Bild dem Body hinzu

        bratwursts.push(bratwurst); // Füge die Bratwurst zum Array hinzu
    }

    // Bewegung der Bratwürste starten
    moveBratwursts();
}

// Funktion, um die Bratwürste zu bewegen
function moveBratwursts() {
    bratwursts.forEach(bratwurst => {
        // Aktualisiere die Position
        bratwurst.x += bratwurst.dx;
        bratwurst.y += bratwurst.dy;

        // Kollision mit Fenster-Rand erkennen
        if (bratwurst.x <= 0 || bratwurst.x + 30 >= window.innerWidth) {
            bratwurst.dx *= -1; // Richtung ändern
        }
        if (bratwurst.y <= 0 || bratwurst.y + 30 >= window.innerHeight) {
            bratwurst.dy *= -1; // Richtung ändern
        }

        // Setze die neue Position des Bildes
        bratwurst.element.style.left = bratwurst.x + 'px';
        bratwurst.element.style.top = bratwurst.y + 'px';

        // Abstand zum Cursor prüfen
        const cursorX = parseFloat(senftube.style.left);
        const cursorY = parseFloat(senftube.style.top);
        const distanceToCursor = Math.sqrt(Math.pow(bratwurst.x - cursorX, 2) + Math.pow(bratwurst.y - cursorY, 2));

        // Wenn die Bratwurst zu nah am Cursor ist, bewege sie sanft weg
        if (distanceToCursor < 100) {
            const avoidanceSpeed = 2; // Erhöhe die Geschwindigkeit des Ausweichens
            if (bratwurst.x < cursorX) {
                bratwurst.x -= avoidanceSpeed; // Weiche nach links aus
            } else if (bratwurst.x > cursorX) {
                bratwurst.x += avoidanceSpeed; // Weiche nach rechts aus
            }
            if (bratwurst.y < cursorY) {
                bratwurst.y -= avoidanceSpeed; // Weiche nach oben aus
            } else if (bratwurst.y > cursorY) {
                bratwurst.y += avoidanceSpeed; // Weiche nach unten aus
            }
        }
    });

    requestAnimationFrame(moveBratwursts); // Bewege die Bratwürste kontinuierlich
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
            displayBratwursts(summe, temperature2m); // Bratwürste entsprechend der Temperatur anzeigen
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
    let description = getWeatherDescription(weatherCode, timeOfDay);
    let frequencyComment = getFrequencyComment(summe);

    const sentenceStart = timeOfDay === "Nacht" ? "Es ist eine" : "Es ist ein";
    const sentence = `${sentenceStart} ${description} ${timeOfDay}, ${temperature2m} Grad<br> und es sind ${summe} Passant*innen an der Vadianstrasse unterwegs.<br>${frequencyComment}`;
    document.getElementById('dataDisplay').innerHTML = sentence;
}

function displayPastSentence(temperature2m, summe, weatherCode, timeOfDay) {
    let description = getWeatherDescription(weatherCode, timeOfDay);
    let frequencyComment = getFrequencyComment(summe);

    const sentenceStart = timeOfDay === "Nacht" ? "Es war eine" : "Es war ein";
    const sentence = `${sentenceStart} ${description} ${timeOfDay}, ${temperature2m} Grad<br> und es waren ${summe} Passant*innen an der Vadianstrasse unterwegs.<br>${frequencyComment}`;
    document.getElementById('dataDisplay').innerHTML = sentence;
}

// Funktion, um die Wetterbeschreibung zu generieren
function getWeatherDescription(weatherCode, timeOfDay) {
    let description = "";
    const isNight = timeOfDay === "Nacht";

    switch (weatherCode) {
        case 0: description = isNight ? "klare" : "sonniger"; break;
        case 1:
        case 2:
        case 3: description = isNight ? "bewölkte" : "bewölkter"; break;
        case 45:
        case 48: description = isNight ? "neblige" : "nebliger"; break;
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
        case 82: description = isNight ? "regnerische" : "regnerischer"; break;
        case 71:
        case 73:
        case 75:
        case 77:
        case 85:
        case 86: description = isNight ? "schneereiche" : "schneereicher"; break;
        case 95:
        case 96:
        case 99: description = isNight ? "gewittrige" : "gewittriger"; break;
        default: description = isNight ? "unbekannte" : "unbekannter"; break;
    }

    return description;
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
};
