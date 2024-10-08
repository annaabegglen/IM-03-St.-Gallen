<?php

require_once 'config.php'; // Verbindet die Datenbankkonfiguration

// Bindet das Skript extract.php für Rohdaten ein
$weather = include('extractweather.php');

//print_r($weather);

print_r($weather['hourly']['time'][0]);

$time = $weather['hourly']['time'][0];
echo $time;

echo "<br>";

$temperature = $weather['hourly']['temperature_2m'][0];
echo $temperature;

echo "<br>";

$weather_code = $weather['hourly']['weather_code'][0];
echo $weather_code;


?>
