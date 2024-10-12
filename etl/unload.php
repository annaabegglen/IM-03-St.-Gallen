<?php

require_once 'config.php'; // Verbindet die Datenbankkonfiguration

// PDO-Instanz erstellen
try {
    $pdo = new PDO($dsn, $username, $password, $options);
} catch (PDOException $e) {
    die("Datenbankverbindung fehlgeschlagen: " . $e->getMessage());
}

// SQL-Query, um die neuesten Daten aus der pedestrian_data-Tabelle zu laden
$sql = "SELECT measured_at, summe, temperature_2m, weather_code FROM pedestrian_data ORDER BY measured_at DESC LIMIT 1";

try {
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($result) {
        // Erfolgreiche Datenabfrage, gebe die Daten als JSON zurück
        header('Content-Type: application/json');
        echo json_encode([$result]);
    } else {
        // Falls keine Daten vorhanden sind
        header('Content-Type: application/json');
        echo json_encode(['message' => 'Keine Daten verfügbar']);
    }
    
} catch (PDOException $e) {
    echo "Fehler bei der Datenabfrage: " . $e->getMessage();
}

?>
