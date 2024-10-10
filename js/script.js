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

// Daten abrufen und den Satz anzeigen, wenn die Seite geladen wird
fetchData();
