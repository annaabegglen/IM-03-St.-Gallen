<?php

// Transformations-Skripte als 'transformpedestrians.php' und 'transformweather.php' einbinden
$pedestrianData = include('transformpedestrians.php');
$weatherData = include('transformweather.php');

// Dekodiert die Daten (falls notwendig, je nachdem wie die Daten in den Transformationsskripten geliefert werden)
$pedestrianArray = json_decode($pedestrianData, true);
$weatherArray = json_decode($weatherData, true);

require_once 'config.php'; // Bindet die Datenbankkonfiguration ein

try {
    // Erstellt eine neue PDO-Instanz mit der Konfiguration aus config.php
    $pdo = new PDO($dsn, $username, $password, $options);

    // SQL-Query mit Platzhaltern für das Einfügen von Daten in die pedestrian_data-Tabelle
    $sql = "INSERT INTO pedestrian_data (measured_at, summe, temperature_2m, precipitation_probability, weather_code) VALUES (?, ?, ?, ?, ?)";

    // Bereitet die SQL-Anweisung vor
    $stmt = $pdo->prepare($sql);

    // Daten extrahieren
    $measuredAt = isset($pedestrianArray['measured_at']) ? $pedestrianArray['measured_at'] : date('Y-m-d H:i:s');
    $summe = isset($pedestrianArray['summe']) ? $pedestrianArray['summe'] : null;

    $temperature = isset($weatherArray['hourly']['temperature_2m'][0]) ? $weatherArray['hourly']['temperature_2m'][0] : null;
    $precipitationProbability = isset($weatherArray['hourly']['precipitation_probability'][0]) ? $weatherArray['hourly']['precipitation_probability'][0] : null;
    $weatherCode = isset($weatherArray['hourly']['weather_code'][0]) ? $weatherArray['hourly']['weather_code'][0] : null;

    // Führt die SQL-Anweisung aus
    $stmt->execute([
        $measuredAt,
        $summe,
        $temperature,
        $precipitationProbability,
        $weatherCode
    ]);

    echo "Daten erfolgreich eingefügt.";
} catch (PDOException $e) {
    die("Verbindung zur Datenbank konnte nicht hergestellt werden: " . $e->getMessage());
}

?>
