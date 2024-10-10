<?php

// URL der API für die Fußgängerfrequenz-Daten
$url = "https://daten.stadt.sg.ch/api/explore/v2.1/catalog/datasets/fussganger-stgaller-innenstadt-vadianstrasse/records?order_by=datum_tag%20DESC&limit=20";

// Initialisiert eine cURL-Sitzung
$ch = curl_init($url);

// Setzt Optionen für die cURL-Sitzung
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

// Führt die cURL-Sitzung aus und erhält den Inhalt
$response = curl_exec($ch);

// Prüfe auf cURL-Fehler
if (curl_errno($ch)) {
    echo 'cURL Error: ' . curl_error($ch);
}

// Schließt die cURL-Sitzung
curl_close($ch);

// Decodiert die JSON-Antwort in ein assoziatives Array
$pedestrian_data = json_decode($response, true);

// Debugging-Ausgabe: Überprüfe, ob Daten korrekt empfangen wurden
if ($pedestrian_data === null) {
    echo "Fehler beim Dekodieren der JSON-Daten:\n";
    echo json_last_error_msg(); // Gibt die Fehlermeldung zurück, falls das JSON ungültig ist
} else {
    // echo "<pre>";
    // print_r($pedestrian_data); // Zeigt die erhaltenen Daten an
    // echo "</pre>";
}

return $pedestrian_data;

?>
