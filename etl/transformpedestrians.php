<?php

require_once 'config.php'; // Include the database configuration

// Include the script for raw data
$pedestrian_data = include('extractpedestrians.php');

// Function to sort the array by 'measured_at_new'
function sortByNewestMeasurement($a, $b) {
    return strtotime($b['measured_at_new']) - strtotime($a['measured_at_new']);
}

// Check if 'results' array is available in pedestrian_data
if (isset($pedestrian_data['results']) && is_array($pedestrian_data['results'])) {
    // Sort the results by 'measured_at_new' in descending order
    usort($pedestrian_data['results'], 'sortByNewestMeasurement');
    
    // Get the newest entry (first element after sorting)
    $newest_entry = $pedestrian_data['results'][0];
    
    // Print only the 'summe' value (number of pedestrians)
    echo $newest_entry['summe'];
} else {
    echo "No pedestrian data available.";
}

?>
