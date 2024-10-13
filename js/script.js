async function fetchData() {
    try {
        const response = await fetch('https://im3.annaabegglen.ch/etl/unload.php');
        
        if (!response.ok) {
            throw new Error('Netzwerkantwort war nicht ok');
        }
        
        const data = await response.json();
        console.log("API-Daten empfangen:", data);
        
        if (data && data.length > 0) {
            const measuredAt = data[0].measured_at;
            const summe = data[0].summe;
            const temperature2m = data[0].temperature_2m;
            const weatherCode = data[0].weather_code; // Assuming weather_code is the key in your API response
            
            console.log(`Gemessen um: ${measuredAt}, Temperatur: ${temperature2m}, Personen: ${summe}, Wettercode: ${weatherCode}`);
            
            displaySentence(measuredAt, temperature2m, summe);
            updateBackgroundColor(temperature2m);  // Farbe aktualisieren
            displayWeatherImage(weatherCode); // Wetterbild aktualisieren
        } else {
            console.log("Keine Daten verfügbar.");
            document.getElementById('dataDisplay').innerText = 'Keine Daten verfügbar.';
        }

    } catch (error) {
        console.error("Fehler beim Abrufen der Daten:", error);
        document.getElementById('dataDisplay').innerText = 'Fehler beim Laden der Daten.';
    }
}

function displaySentence(measuredAt, temperature2m, summe) {
    const sentence = `Es ist ${measuredAt} Uhr, es ist ${temperature2m} Grad warm und es sind ${summe} Leute unterwegs.`;
    document.getElementById('dataDisplay').innerText = sentence;
}

function updateBackgroundColor(temperature2m) {
    let backgroundColor;

    if (temperature2m < 0) {
        backgroundColor = "#9595F7"; // unter 0 Grad
    } else if (temperature2m >= 0 && temperature2m <= 4.9) {
        backgroundColor = "#9BCAE5"; // 0 bis 4.9 Grad
    } else if (temperature2m >= 5 && temperature2m <= 9.9) {
        backgroundColor = "#A5D2A6"; // 5 bis 9.9 Grad
    } else if (temperature2m >= 10 && temperature2m <= 14.9) {
        backgroundColor = "#FFBF80"; // 10 bis 14.9 Grad
    } else if (temperature2m >= 15 && temperature2m <= 19.9) {
        backgroundColor = "#FFB668"; // 15 bis 19.9 Grad
    } else if (temperature2m >= 20) {
        backgroundColor = "#FF8989"; // ab 20 Grad
    }

    document.body.style.backgroundColor = backgroundColor;
}

function displayWeatherImage(weatherCode) {
    // Alle Bilder ausblenden
    const images = document.querySelectorAll('.weather-image');
    images.forEach(img => img.style.display = 'none');
    
    // Passendes Bild anzeigen
    switch (weatherCode) {
        case 0:
            document.getElementById('Sonne').style.display = 'block';
            break;
        case 1:
        case 2:
            document.getElementById('Wolke').style.display = 'block';
            break;
        case 3:
            document.getElementById('Wolke').style.display = 'block'; // Bewölkt
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

window.onload = () => {
    fetchData();
    setInterval(fetchData, 15 * 60 * 1000); // Aktualisierung alle 15 Minuten
};
