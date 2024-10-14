<?php

require_once 'config.php'; // Connects the database configuration

// Create PDO instance
try {
    $pdo = new PDO($dsn, $username, $password, $options);
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}

// Get date and time from the URL
if (isset($_GET['date']) && isset($_GET['time'])) {
    // Check if both date and time are provided
    $date = $_GET['date']; // Format: YYYY-MM-DD
    $time = $_GET['time']; // Format: HH:MM (24-hour format)

    // Format the time to include only the hour, removing minutes and seconds
    $formatted_time = date('H:00:00', strtotime($time)); // Set minutes and seconds to 00

    // Combine date and formatted time into a datetime string
    $datetime = $date . ' ' . $formatted_time;

    // Calculate the next hour (input datetime + 1 hour)
    $next_hour = date('Y-m-d H:i:s', strtotime($datetime . ' +1 hour'));

    // SQL query to load data between input datetime and input datetime + 1 hour
    $sql = "SELECT * FROM `pedestrian_data` WHERE `measured_at` BETWEEN ? AND ?";

    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $datetime,
            $next_hour
        ]);
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($result) {
            // Successful data retrieval, return data as JSON
            header('Content-Type: application/json');
            echo json_encode($result);
        } else {
            // If no data is available
            header('Content-Type: application/json');
            echo json_encode(['message' => 'Keine Daten verfügbar']);
        }

    } catch (PDOException $e) {
        echo "Error fetching data: " . $e->getMessage();
    }

} else {
    // If date or time is not set, retrieve the latest data
    $sql = "SELECT * FROM `pedestrian_data` ORDER BY `measured_at` DESC LIMIT 1";

    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($result) {
            // Successful data retrieval, return data as JSON
            header('Content-Type: application/json');
            echo json_encode($result);
        } else {
            // If no data is available
            header('Content-Type: application/json');
            echo json_encode(['message' => 'Keine Daten verfügbar']);
        }

    } catch (PDOException $e) {
        echo "Error fetching data: " . $e->getMessage();
    }
}

?>
