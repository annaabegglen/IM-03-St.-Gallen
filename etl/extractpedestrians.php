<?php

// URL der API für die Fußgängerfrequenz-Daten
$url = "https://daten.stadt.sg.ch/api/explore/v2.1/catalog/datasets/fussganger-stgaller-innenstadt-vadianstrasse/records?order_by=datum_tag%20DESC&limit=20";

// Initialisiert eine cURL-Sitzung
$ch = curl_init($url);

// Setzt Optionen für die cURL-Sitzung
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

// Führt die cURL-Sitzung aus und erhält den Inhalt
$response = curl_exec($ch);

// Schließt die cURL-Sitzung
curl_close($ch);

// Decodiert die JSON-Antwort in ein assoziatives Array und gibt die rohen Daten zurück
$pedestrian_data = json_decode($response, true);

// Debugging-Ausgabe: Überprüfe, ob Daten korrekt empfangen wurden

//print_r($pedestrian_data);


return $pedestrian_data;

?>
