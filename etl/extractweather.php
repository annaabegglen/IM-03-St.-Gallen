<?php

$url = "https://api.open-meteo.com/v1/forecast?latitude=46.9481&longitude=7.4474&hourly=temperature_2m,precipitation_probability,weather_code";

// Initialisiert eine cURL-Sitzung (statt fetch bei JS)
$ch = curl_init($url);

// Setzt Optionen
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

// Führt die cURL-Sitzung aus und erhält den Inhalt
$response = curl_exec($ch);

// Schließt die cURL-Sitzung
curl_close($ch);

// Zeigt die JSON-Antwort an (statt console.log bei JS)
//echo $response;

$weather = json_decode($response, true);

// Übergabe der transformierten Daten
return $weather;

?>