async function fetchData() {
    try {
        const response = await fetch('https://im3.annaabegglen.ch/etl/unload.php');
        
        // Überprüfen, ob die Antwort erfolgreich war
        if (!response.ok) {
            throw new Error('Netzwerkantwort war nicht ok');
        }
        
        const data = await response.json();
        console.log("API-Daten empfangen:", data); // Debug: Zeige die Daten an
        
        if (data && data.length > 0) {
            const measuredAt = data[0].measured_at;
            const summe = data[0].summe;
            const temperature2m = data[0].temperature_2m;

            console.log(`Gemessen um: ${measuredAt}, Temperatur: ${temperature2m}, Personen: ${summe}`);
            
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

function displaySentence(measuredAt, temperature2m, summe) {
    const sentence = `Es ist ${measuredAt} Uhr, es ist ${temperature2m} Grad warm und es sind ${summe} Leute unterwegs.`;
    document.getElementById('dataDisplay').innerText = sentence;
}

window.onload = () => {
    fetchData(); // Ruft die Daten ab
};
