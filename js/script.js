async function fetchData() {
    try {
        const response = await fetch('https://im3.annaabegglen.ch/etl/unload.php');
        
        if (!response.ok) {
            throw new Error('Netzwerkantwort war nicht ok');
        }
        
        const data = await response.json();
        console.log("API-Daten empfangen:", data);
        
        if (data && data.length > 0) {
            const measuredAt = data[0].measured_at.split(' ')[0]; // Nur Datum
            const summe = data[0].summe;
            const temperature2m = data[0].temperature_2m;
            const weatherCode = data[0].weather_code;

            console.log(`Datum: ${measuredAt}, Temperatur: ${temperature2m}, Personen: ${summe}, Wettercode: ${weatherCode}`);
            
            displaySentence(temperature2m, summe, weatherCode);
            updateBackgroundColor(temperature2m);
            displayWeatherImage(weatherCode);
            displayWurstImage(temperature2m);
            moveWurstImages(summe, temperature2m); // Anpassung: Temperatur berücksichtigen
            updateButton(measuredAt);
        } else {
            console.log("Keine Daten verfügbar.");
            document.getElementById('dataDisplay').innerText = 'Keine Daten verfügbar.';
        }

    } catch (error) {
        console.error("Fehler beim Abrufen der Daten:", error);
        document.getElementById('dataDisplay').innerText = 'Fehler beim Laden der Daten.';
    }
}

function displaySentence(temperature2m, summe, weatherCode) {
    let description = "";

    switch (weatherCode) {
        case 0:
            description = "sonniger";
            break;
        case 1:
        case 2:
        case 3:
            description = "bewölkter";
            break;
        case 45:
        case 48:
            description = "nebliger";
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
            description = "regnerischer";
            break;
        case 71:
        case 73:
        case 75:
        case 77:
        case 85:
        case 86:
            description = "schneereicher";
            break;
        case 95:
        case 96:
        case 99:
            description = "gewittriger";
            break;
        default:
            description = "unbekannter";
            console.log("Unbekannter Wettercode:", weatherCode);
    }

    const sentence = `Es ist ein ${description} Samstag, ${temperature2m} Grad und es sind ${summe} Passant*innen an der Vadianstrasse unterwegs.`;
    document.getElementById('dataDisplay').innerText = sentence;
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
        backgroundColor = "#FFBF80";
    } else if (temperature2m >= 15 && temperature2m <= 19.9) {
        backgroundColor = "#FFB668";
    } else if (temperature2m >= 20) {
        backgroundColor = "#FF8989";
    }

    document.body.style.backgroundColor = backgroundColor;
}

function displayWeatherImage(weatherCode) {
    const images = document.querySelectorAll('.weather-image');
    images.forEach(img => img.style.display = 'none');
    
    switch (weatherCode) {
        case 0:
            document.getElementById('Sonne').style.display = 'block';
            break;
        case 1:
        case 2:
        case 3:
            document.getElementById('Wolke').style.display = 'block';
            break;
        case 45:
        case 48:
            document.getElementById('Nebel').style.display = 'block';
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
            document.getElementById('Regen').style.display = 'block';
            break;
        case 71:
        case 73:
        case 75:
        case 77:
        case 85:
        case 86:
            document.getElementById('Schnee').style.display = 'block';
            break;
        case 95:
        case 96:
        case 99:
            document.getElementById('Blitz').style.display = 'block';
            break;
        default:
            console.log("Unbekannter Wettercode:", weatherCode);
    }
}

function displayWurstImage(temperature2m) {
    const wurstImages = document.querySelectorAll('.wurst-image');
    wurstImages.forEach(img => img.style.display = 'none');

    if (temperature2m < 10) {
        document.getElementById('Bratkalt').style.display = 'block';
    } else if (temperature2m >= 10 && temperature2m < 20) {
        document.getElementById('Bratwarm').style.display = 'block';
    } else if (temperature2m >= 20) {
        document.getElementById('Bratheiss').style.display = 'block';
    }
}

function moveWurstImages(summe, temperature2m) {
    let wurstImage;

    // Wähle nur das Bild basierend auf der Temperatur
    if (temperature2m < 10) {
        wurstImage = document.getElementById('Bratkalt');
    } else if (temperature2m >= 10 && temperature2m < 20) {
        wurstImage = document.getElementById('Bratwarm');
    } else if (temperature2m >= 20) {
        wurstImage = document.getElementById('Bratheiss');
    }

    // Wenn keine passende Bratwurst angezeigt werden soll, nichts tun
    if (!wurstImage) {
        return;
    }

    // Lösche alle aktuellen dynamischen Wurst-Elemente, damit sie neu verteilt werden
    document.querySelectorAll('.dynamic-wurst').forEach(img => img.remove());

    // Basierend auf der Anzahl der Passanten, füge zufällig Wurst-Bilder hinzu
    for (let i = 0; i < summe; i++) {
        // Klone das Bild, um es mehrfach anzeigen zu können
        const clonedImage = wurstImage.cloneNode(true);
        clonedImage.style.display = 'block';
        clonedImage.classList.add('dynamic-wurst'); // Füge Klasse für spätere Entfernung hinzu

        // Zufällige Höhe berechnen
        const randomY = Math.floor(Math.random() * window.innerHeight);

        // Bestimme, ob das Bild von links nach rechts oder von rechts nach links laufen soll
        const direction = Math.random() > 0.5 ? 'moveRight' : 'moveLeft';
        const startPosition = direction === 'moveRight' ? '-10vw' : '110vw';

        // Setze die Startposition und die zufällige Höhe
        clonedImage.style.top = `${randomY}px`;
        clonedImage.style.left = startPosition;

        // Füge die Animation hinzu
        clonedImage.style.animationName = direction;
        clonedImage.style.animationDuration = `${10 + Math.random() * 5}s`; // Zufällige Geschwindigkeit

        document.body.appendChild(clonedImage);
    }
}

function updateButton(measuredAt) {
    const button = document.getElementById('measuredAtButton');
    button.innerText = measuredAt;
}

window.onload = () => {
    fetchData();
    setInterval(fetchData, 15 * 60 * 1000);
};
