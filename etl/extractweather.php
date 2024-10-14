<?php

$url = "https://api.open-meteo.com/v1/forecast?latitude=47.485&longitude=9.5619&current=temperature_2m,weather_code&timezone=Europe/Zurich";

// Initialisiert eine cURL-Sitzung
$ch = curl_init($url);

// Setzt Optionen
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

// Führt die cURL-Sitzung aus und erhält den Inhalt
$response = curl_exec($ch);

// Schließt die cURL-Sitzung
curl_close($ch);

// print_r($response);

// Dekodiert die JSON-Antwort
$weather = json_decode($response, true);

// Übergabe der transformierten Daten
return $weather;
?>
