// Anzahl der Bratwürste
const numberOfBratwursts = 30;
const container = document.getElementById('container');

// Funktion zum Erstellen und zufälligen Platzieren der Bratwürste
function createBratwursts() {
    for (let i = 0; i < numberOfBratwursts; i++) {
        const bratwurst = document.createElement('img'); // Erstellt ein neues Bild-Element
        bratwurst.src = 'images/bratwurst.png'; // Pfad zur Bratwurst-Bilddatei
        bratwurst.classList.add('bratwurst'); // Fügt die CSS-Klasse für die Bratwurst hinzu
        
        // Zufällige Position innerhalb des Containers
        bratwurst.style.left = `${Math.random() * 100}vw`; // Zufällige horizontale Position
        bratwurst.style.top = `${Math.random() * 100}vh`; // Zufällige vertikale Position
        
        // Zufällige Bewegungsgeschwindigkeit und Richtung
        bratwurst.style.animationDuration = `${Math.random() * 5 + 3}s`; // Zufällige Animationsdauer zwischen 3 und 8 Sekunden
        bratwurst.style.animationDelay = `${Math.random() * 5}s`; // Zufällige Verzögerung der Animation
        
        container.appendChild(bratwurst); // Fügt die Bratwurst zum Container hinzu
    }
}

// Fetch data from the provided URL
async function fetchData() {
    try {
        const response = await fetch('https://im3.annaabegglen.ch/etl/unload.php');
        
        // Überprüfen, ob die Antwort erfolgreich war
        if (!response.ok) {
            throw new Error('Netzwerkantwort war nicht ok');
        }
        
        const data = await response.json();
        
        // Konsolenausgabe für die empfangenen Daten
        console.log("Empfangene Daten:", data);
        
        // Sicherstellen, dass wir Daten haben
        if (data && data.length > 0) {
            const measuredAt = data[0].measured_at;
            const summe = data[0].summe;
            const temperature2m = data[0].temperature_2m;

            // Konsolenausgabe der einzelnen Werte
            console.log(`Gemessen um: ${measuredAt}, Temperatur: ${temperature2m}, Personen: ${summe}`);
            
            // Generiere den Satz und zeige ihn an
            displaySentence(measuredAt, temperature2m, summe);
        } else {
            console.log("Keine Daten verfügbar.");
            document.getElementById('dataDisplay').innerText = 'Keine Daten verfügbar.';
        }

    } catch (error) {
        console.error("Fehler beim Abrufen der Daten:", error);
        document.getElementById('dataDisplay').innerText = 'Fehler beim Laden der Daten.';
    }
}

// Funktion, um den Satz anzuzeigen
function displaySentence(measuredAt, temperature2m, summe) {
    const sentence = `Es ist ${measuredAt} Uhr, es ist ${temperature2m} Grad warm und es sind ${summe} Leute unterwegs.`;
    document.getElementById('dataDisplay').innerText = sentence;
}

// Bratwürste erstellen und Daten abrufen, wenn die Seite geladen wird
window.onload = () => {
    createBratwursts(); // Erstellt die Bratwürste
    fetchData(); // Ruft die Daten ab
};
