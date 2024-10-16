// Mausbewegung für die Senftube
document.addEventListener('mousemove', function(event) {
    const senftube = document.getElementById('senftube');
    senftube.style.left = event.pageX + 'px';
    senftube.style.top = event.pageY + 'px';
});

// Funktion, um Daten zu laden
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
            const summe = data[0].summe;
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
            displayWurstImage(temperature2m, summe);
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

function displaySentence(temperature2m, summe, weatherCode, timeOfDay) {
    let description = getWeatherDescription(weatherCode, timeOfDay);
    let frequencyComment = getFrequencyComment(summe);

    // Unterscheide den Artikel basierend auf der Tageszeit
    const article = timeOfDay === "Nacht" ? "eine" : "ein";
    const sentence = `Es ist ${article} ${description} ${timeOfDay}, ${temperature2m} Grad<br> und es sind ${summe} Passant*innen an der Vadianstrasse unterwegs.<br>${frequencyComment}`;
    document.getElementById('dataDisplay').innerHTML = sentence;
}

function displayPastSentence(temperature2m, summe, weatherCode, timeOfDay) {
    let description = getWeatherDescription(weatherCode, timeOfDay);
    let frequencyComment = getFrequencyComment(summe);

    // Unterscheide den Artikel basierend auf der Tageszeit
    const article = timeOfDay === "Nacht" ? "eine" : "ein";
    const sentence = `Es war ${article} ${description} ${timeOfDay}, ${temperature2m} Grad<br> und es waren ${summe} Passant*innen an der Vadianstrasse unterwegs.<br>${frequencyComment}`;
    document.getElementById('dataDisplay').innerHTML = sentence;
}

// Passe die Wetterbeschreibung abhängig von der Tageszeit an
function getWeatherDescription(weatherCode, timeOfDay) {
    let description = "";

    switch (weatherCode) {
        case 0:
            description = timeOfDay === "Nacht" ? "klare" : "sonniger";
            break;
        case 1:
        case 2:
        case 3:
            description = timeOfDay === "Nacht" ? "bewölkte" : "bewölkter";
            break;
        case 45:
        case 48:
            description = timeOfDay === "Nacht" ? "neblige" : "nebliger";
            break;
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
        case 82:
            description = timeOfDay === "Nacht" ? "regnerische" : "regnerischer";
            break;
        case 71:
        case 73:
        case 75:
        case 77:
        case 85:
        case 86:
            description = timeOfDay === "Nacht" ? "schneereiche" : "schneereicher";
            break;
        case 95:
        case 96:
        case 99:
            description = timeOfDay === "Nacht" ? "gewittrige" : "gewittriger";
            break;
        default:
            description = timeOfDay === "Nacht" ? "unbekannte" : "unbekannter";
            console.log("Unknown weather code:", weatherCode);
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

function displayWurstImage(temperature2m, summe) {
    const wurstContainer = document.getElementById('wurstContainer');
    wurstContainer.innerHTML = '';

    let wurstImageId = '';

    if (temperature2m < 10) {
        wurstImageId = 'Bratkalt';
    } else if (temperature2m >= 10 && temperature2m < 20) {
        wurstImageId = 'Bratwarm';
    } else if (temperature2m >= 20) {
        wurstImageId = 'Bratheiss';
    }

    for (let i = 0; i < summe; i++) {
        const imgElement = document.createElement('img');
        imgElement.src = document.getElementById(wurstImageId).src;
        imgElement.alt = `Bratwurst ${i + 1}`;
        imgElement.classList.add('wurst-image');

        wurstContainer.appendChild(imgElement);
    }
}

function updateFetchInterval() {
    const dateInput = document.getElementById('dateInput').value;
    const timeInput = document.getElementById('timeInput').value;

    if (dateInput && timeInput) {
        fetchData(dateInput, timeInput);
        setInterval(() => {
            fetchData(dateInput, timeInput);
        }, 15 * 60 * 1000);
    } else {
        alert('Bitte Datum und Uhrzeit eingeben');
    }
}

window.onload = () => {
    fetchData();

    setInterval(() => {
        fetchData();
    }, 15 * 60 * 1000);

    document.getElementById('fetchButton').addEventListener('click', updateFetchInterval);
};
