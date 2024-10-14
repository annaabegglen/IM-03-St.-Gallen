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
            const measuredAt = data[0].measured_at.split(' ')[0]; // Only date
            const summe = data[0].summe;
            const temperature2m = data[0].temperature_2m;
            const weatherCode = data[0].weather_code;

            console.log(`Date: ${measuredAt}, Temperature: ${temperature2m}, Pedestrians: ${summe}, Weather Code: ${weatherCode}`);

            displaySentence(temperature2m, summe, weatherCode);
            updateBackgroundColor(temperature2m);
            displayWeatherImage(weatherCode);
            displayWurstImage(temperature2m);
            startWurstLoop(temperature2m); // Start the continuous loop
        } else {
            console.log("No data available.");
            document.getElementById('dataDisplay').innerText = 'Keine Daten verfügbar.';
        }

    } catch (error) {
        console.error("Error fetching data:", error);
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
            console.log("Unknown weather code:", weatherCode);
    }

    const sentence = `Es ist ein ${description} Tag, ${temperature2m} Grad und es sind ${summe} Passant*innen an der Vadianstrasse unterwegs.`;
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
        backgroundColor = "#FBF380";
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
            console.log("Unknown weather code:", weatherCode);
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

function startWurstLoop(temperature2m) {
    setInterval(() => {
        moveWurstImages(1, temperature2m);  // Move one wurst at a time in the loop
    }, 1000); // Every 1 second, a new wurst enters the screen
}

function moveWurstImages(summe, temperature2m) {
    let wurstImage;

    if (temperature2m < 10) {
        wurstImage = document.getElementById('Bratkalt');
    } else if (temperature2m >= 10 && temperature2m < 20) {
        wurstImage = document.getElementById('Bratwarm');
    } else if (temperature2m >= 20) {
        wurstImage = document.getElementById('Bratheiss');
    }

    if (!wurstImage) {
        return;
    }

    const clonedImage = wurstImage.cloneNode(true);
    clonedImage.style.display = 'block';
    clonedImage.classList.add('dynamic-wurst');

    const randomY = Math.floor(Math.random() * window.innerHeight);
    const direction = Math.random() > 0.5 ? 'moveRight' : 'moveLeft';
    const startPosition = direction === 'moveRight' ? '-10vw' : '110vw';

    clonedImage.style.top = `${randomY}px`;
    clonedImage.style.left = startPosition;
    clonedImage.style.animationName = direction;
    clonedImage.style.animationDuration = `10s`;
    clonedImage.style.animationDelay = `5s`;

    document.body.appendChild(clonedImage);

    setTimeout(() => {
        clonedImage.remove();
    }, 10000);
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
    // Fetch the latest data when the page loads
    fetchData();

    // Set interval to fetch the latest data every 15 minutes
    setInterval(() => {
        fetchData();
    }, 15 * 60 * 1000);

    document.getElementById('fetchButton').addEventListener('click', updateFetchInterval);
};
