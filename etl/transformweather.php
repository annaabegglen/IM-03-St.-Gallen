<?php

require_once 'config.php'; // Verbindet die Datenbankkonfiguration

// Bindet das Skript extractweather.php für Rohdaten ein
$weather = include('extractweather.php');

// Hole die benötigten Wetterdaten
$time = isset($weather['hourly']['time'][0]) ? $weather['hourly']['time'][0] : null;
$temperature = isset($weather['hourly']['temperature_2m'][0]) ? $weather['hourly']['temperature_2m'][0] : null;
$weather_code = isset($weather['hourly']['weather_code'][0]) ? $weather['hourly']['weather_code'][0] : null;

if ($time && $temperature && $weather_code) {
    try {
        // Erstellt eine neue PDO-Instanz mit der Konfiguration aus config.php
        $pdo = new PDO($dsn, $username, $password, $options);

        // SQL-Query mit Platzhaltern für das Einfügen von Daten in die pedestrian_data-Tabelle
        $sql = "INSERT INTO pedestrian_data (measured_at, temperature_2m, weather_code) VALUES (?, ?, ?)";

        // Bereitet die SQL-Anweisung vor
        $stmt = $pdo->prepare($sql);

        // Führt die SQL-Anweisung aus und übergibt die Parameter
        $stmt->execute([
            $time,           // measured_at (die Zeit aus der Wetter-API)
            $temperature,    // temperature_2m
            $weather_code    // weather_code
        ]);

        echo "Wetterdaten erfolgreich in die Datenbank eingefügt.";
    } catch (PDOException $e) {
        die("Fehler beim Einfügen der Wetterdaten: " . $e->getMessage());
    }
} else {
    echo "Unvollständige Wetterdaten: Zeit, Temperatur oder Wettercode fehlen.";
}

?>
