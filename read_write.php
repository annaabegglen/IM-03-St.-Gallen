<?php

require_once 'config.php'; //config.php zusammen verlinkt. kann jetzt auf Datenbank zugreifen


try {
    // Create a new PDO instance using the values from config.php
    $pdo = new PDO($dsn, $username, $password, $options);

    // Define the SQL query
    $sql = "SELECT * FROM notes";

    // Prepare the statement
    $stmt = $pdo->prepare($sql);

    // Execute the query
    $stmt->execute();

    // Fetch all results
    $result = $stmt->fetchAll();

    // Check if any results were returned
    if ($result) {
        // Loop through the results and print each row
        foreach ($result as $row) {
            echo "ID: " . $row['ID'] . " - Note: " . $row['Notiz'] . "<br>";
        }
    } else {
        echo "Keine Ergebnisse gefunden";
    }

} catch (PDOException $e) {
    // If an error occurs, display the error message
    die("Fehler bei der Verbindung zur Datenbank: " . $e->getMessage());
}
// i want to add a new note

try {
    // Define the SQL query
    $sql = "INSERT INTO notes (Notiz) VALUES ('bliblablub')";

    // Prepare the statement
    $stmt = $pdo->prepare($sql);


    // Execute the query
    $stmt->execute();

    // Get the ID of the new row
    $id = $pdo->lastInsertId();

    // Print the ID of the new row
    echo "Neue Notiz hinzugefügt mit der ID: $id";

} catch (PDOException $e) {
    // If an error occurs, display the error message
    die("Fehler bei der Verbindung zur Datenbank: " . $e->getMessage());
}
?>
