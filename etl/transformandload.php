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
    
    // Zeitumrechnung: Annahme, dass 'measured_at_new' in UTC ist
    if (isset($newest_entry['measured_at_new'])) {
        $pedestrian_measured_at_utc = $newest_entry['measured_at_new'];
        
        // Erstelle ein DateTime-Objekt in UTC
        $date = new DateTime($pedestrian_measured_at_utc, new DateTimeZone('UTC'));
        
        // Wandle die Zeit in die lokale Zeitzone (z.B. Europe/Zurich) um
        $date->setTimezone(new DateTimeZone('Europe/Zurich')); // Setzt die Zeit auf UTC+2 (MEZ/MESZ)
        
        // Formatiere die Zeit für die Speicherung
        $pedestrian_measured_at = $date->format('Y-m-d H:i:s');
    } else {
        $pedestrian_measured_at = date('Y-m-d H:i:s'); // Fallback zur aktuellen Zeit
    }
} else {
    echo "Keine Fußgängerdaten verfügbar.";
    $summe = null;
    $pedestrian_measured_at = null;
}

// Wetterdaten verarbeiten
$weather = include('extractweather.php');

$temperature = $weather['current']['temperature_2m'];
$weather_code = $weather['current']['weather_code'];

echo "Temperatur: " . $temperature . "°C\n";
echo "Wettercode: " . $weather_code . "\n";

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