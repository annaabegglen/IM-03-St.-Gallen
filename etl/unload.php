<?php

require_once 'config.php'; // Verbindet die Datenbankkonfiguration
//header json
header('Content-Type: application/json');


try {
    // Erstellt eine neue PDO-Instanz
    $pdo = new PDO($dsn, $username, $password, $options);
    
    // SQL-Query zum Abrufen der neuesten Einträge
    $sql = "SELECT measured_at, summe, temperature_2m, weather_code FROM pedestrian_data ORDER BY measured_at DESC LIMIT 10"; // Ändere LIMIT nach Bedarf
    $stmt = $pdo->query($sql);
    
    // Holt alle Datensätze
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Gibt die Daten als JSON aus
    echo json_encode($data);

} catch (PDOException $e) {
    die("Fehler beim Abrufen der Daten: " . $e->getMessage());
}

?>
