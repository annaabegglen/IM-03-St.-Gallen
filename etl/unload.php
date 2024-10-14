<?php

require_once 'config.php'; // Verbindet die Datenbankkonfiguration

// PDO-Instanz erstellen
try {
    $pdo = new PDO($dsn, $username, $password, $options);
} catch (PDOException $e) {
    die("Datenbankverbindung fehlgeschlagen: " . $e->getMessage());
}

// Datum und Uhrzeit aus der URL holen
if (isset($_GET['date']) && isset($_GET['time'])) {
    // Überprüfen, ob sowohl Datum als auch Uhrzeit vorhanden sind
    $date = $_GET['date']; // Format: YYYY-MM-DD
    $time = $_GET['time']; // Format: HH:MM (24-Stunden-Format)

    // Format the time to include only the hour, removing minutes and seconds
    $formatted_time = date('H:00:00', strtotime($time)); // Set minutes and seconds to 00

    // Combine date and formatted time into a datetime string
    $datetime = $date . ' ' . $formatted_time;

    // Calculate the next hour (input datetime + 1 hour)
    $next_hour = date('Y-m-d H:i:s', strtotime($datetime . ' +1 hour'));

    // Echo the formatted datetime and next hour for testing
    // echo "Start time: " . $datetime . '<br>';
    //  echo "End time: " . $next_hour . '<br>';
} else {
    // Wenn entweder Datum oder Uhrzeit nicht gesetzt ist, einen Standardwert verwenden
    
    echo "Datum oder Uhrzeit nicht angegeben.";
    return;
}

// SQL-Query, um die Daten zwischen input datetime und input datetime + 1 hour zu laden
$sql = "SELECT * FROM `pedestrian_data` WHERE `measured_at` BETWEEN ? AND ?";

try {
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $datetime,
        $next_hour
    ]);
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($result) {
        // Erfolgreiche Datenabfrage, gebe die Daten als JSON zurück
        
        //print_r($result);
        
        header('Content-Type: application/json');
        echo json_encode($result);


    } else {
        // Falls keine Daten vorhanden sind
        header('Content-Type: application/json');
        echo json_encode(['message' => 'Keine Daten verfügbar']);
    }
    
} catch (PDOException $e) {
    echo "Fehler bei der Datenabfrage: " . $e->getMessage();
}

?>
