<?php

require_once 'config.php'; // Verbindet die Datenbankkonfiguration

// Bindet das Skript extractpedestrians.php für Rohdaten ein
$pedestrian_data = include('extractpedestrians.php');

// Funktion zum Sortieren der Daten nach 'measured_at_new'
function sortByNewestMeasurement($a, $b) {
    return strtotime($b['measured_at_new']) - strtotime($a['measured_at_new']);
}

// Prüfen, ob das 'results'-Array im Fußgängerdaten vorhanden ist
if (isset($pedestrian_data['results']) && is_array($pedestrian_data['results'])) {
    // Sortiere die Ergebnisse nach 'measured_at_new' in absteigender Reihenfolge
    usort($pedestrian_data['results'], 'sortByNewestMeasurement');
    
    // Nimmt den neuesten Eintrag (erster Eintrag nach dem Sortieren)
    $newest_entry = $pedestrian_data['results'][0];
    
    // Extrahiere die relevanten Daten
    $summe = isset($newest_entry['summe']) ? $newest_entry['summe'] : null;
    $measured_at = isset($newest_entry['measured_at_new']) ? $newest_entry['measured_at_new'] : date('Y-m-d H:i:s');

    if ($summe && $measured_at) {
        try {
            // Erstellt eine neue PDO-Instanz mit der Konfiguration aus config.php
            $pdo = new PDO($dsn, $username, $password, $options);

            // SQL-Query mit Platzhaltern für das Einfügen von Daten in die pedestrian_data-Tabelle
            $sql = "INSERT INTO pedestrian_data (measured_at, summe) VALUES (?, ?)";

            // Bereitet die SQL-Anweisung vor
            $stmt = $pdo->prepare($sql);

            // Führt die SQL-Anweisung aus und übergibt die Parameter
            $stmt->execute([
                $measured_at, // measured_at (Zeitstempel)
                $summe        // summe (Anzahl der Fußgänger)
            ]);

            echo "Fußgängerdaten erfolgreich in die Datenbank eingefügt.";
        } catch (PDOException $e) {
            die("Fehler beim Einfügen der Fußgängerdaten: " . $e->getMessage());
        }
    } else {
        echo "Unvollständige Fußgängerdaten: Zeit oder Summe fehlen.";
    }
} else {
    echo "Keine Fußgängerdaten verfügbar.";
}

?>
