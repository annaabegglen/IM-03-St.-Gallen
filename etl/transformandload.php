<?php

require_once 'config.php'; // Verbindet die Datenbankkonfiguration

// Fußgängerdaten verarbeiten
$pedestrian_data = include('extractpedestrians.php');

// Funktion zum Sortieren der Fußgängerdaten nach 'measured_at_new'
function sortByNewestMeasurement($a, $b) {
    return strtotime($b['measured_at_new']) - strtotime($a['measured_at_new']);
}

// Prüfen, ob das 'results'-Array im Fußgängerdaten vorhanden ist
if (isset($pedestrian_data['results']) && is_array($pedestrian_data['results'])) {
    // Sortiere die Ergebnisse nach 'measured_at_new' in absteigender Reihenfolge
    usort($pedestrian_data['results'], 'sortByNewestMeasurement');
    
    // Nimmt den neuesten Eintrag (erster Eintrag nach dem Sortieren)
    $newest_entry = $pedestrian_data['results'][0];
    
    // Extrahiere die relevanten Fußgängerdaten
    $summe = isset($newest_entry['summe']) ? $newest_entry['summe'] : null;
    $pedestrian_measured_at = isset($newest_entry['measured_at_new']) ? $newest_entry['measured_at_new'] : date('Y-m-d H:i:s');
} else {
    echo "Keine Fußgängerdaten verfügbar.";
    $summe = null;
    $pedestrian_measured_at = null;
}

// Wetterdaten verarbeiten
$weather = include('extractweather.php');

// Ermittelt den neuesten Zeitpunkt in den Wetterdaten
// $latest_weather_index = null;
// $current_time = time();

// foreach ($weather['hourly']['time'] as $index => $weather_time) {
//     $weather_timestamp = strtotime($weather_time);
//     // Finde den Eintrag, der am nächsten zur aktuellen Zeit ist
//     if ($weather_timestamp <= $current_time && (is_null($latest_weather_index) || $weather_timestamp > strtotime($weather['hourly']['time'][$latest_weather_index]))) {
//         $latest_weather_index = $index;
//     }
// }

$temperature = $weather['current']['temperature_2m'];
$weather_code = $weather['current']['weather_code'];

echo "Temperatur: " . $temperature . "°C\n";
echo "Wettercode: " . $weather_code . "\n";

// if ($latest_weather_index !== null) {
//     $weather_measured_at = $weather['hourly']['time'][$latest_weather_index];
//     $temperature = $weather['hourly']['temperature_2m'][$latest_weather_index];
//     $weather_code = $weather['hourly']['weather_code'][$latest_weather_index];
// } else {
//     echo "Keine aktuellen Wetterdaten verfügbar.";
//     $weather_measured_at = null;
//     $temperature = null;
//     $weather_code = null;
// }

// Überprüfen, ob alle notwendigen Daten vorhanden sind
if ($pedestrian_measured_at && $summe && $temperature && $weather_code) {
    try {
        // Erstellt eine neue PDO-Instanz und startet die Transaktion
        $pdo = new PDO($dsn, $username, $password, $options);
        $pdo->beginTransaction();

        // SQL-Query zum Einfügen der kombinierten Daten
        $sqlCombined = "INSERT INTO pedestrian_data (measured_at, summe, temperature_2m, weather_code) VALUES (?, ?, ?, ?)";
        $stmtCombined = $pdo->prepare($sqlCombined);
        $stmtCombined->execute([$pedestrian_measured_at, $summe, $temperature, $weather_code]);
        echo "Daten erfolgreich eingefügt.\n";

        // Commit der Transaktion
        $pdo->commit();
        echo "Datensatz erfolgreich in die Datenbank eingefügt.";
        
    } catch (PDOException $e) {
        // Rollback bei Fehlern und Ausgabe der Fehlermeldung
        $pdo->rollBack();
        die("Fehler beim Einfügen der Daten: " . $e->getMessage());
    }

} else {
    echo "Unvollständige Daten: Überprüfen Sie die Fußgänger- und Wetterdaten.";
}

?>
