// Fetch data from the provided URL
async function fetchData() {
    try {
        const response = await fetch('https://im3.annaabegglen.ch/etl/unload.php');
        const data = await response.json();

        // Process and extract the necessary fields
        const measuredAt = data.map(item => item.measured_at);
        const summe = data.map(item => item.summe);
        const temperature2m = data.map(item => item.temperature_2m);

        // Call the function to render the chart with the fetched data
        renderChart(measuredAt, summe, temperature2m);

    } catch (error) {
        console.error("Error fetching the data:", error);
    }
}

// Function to render chart with Chart.js
function renderChart(measuredAt, summe, temperature2m) {
    const ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, {
        type: 'line', // Line chart for showing trends
        data: {
            labels: measuredAt, // X-axis labels
            datasets: [
                {
                    label: 'Summe',
                    data: summe, // Data for 'Summe'
                    borderColor: 'rgba(75, 192, 192, 1)',
                    fill: false,
                    borderWidth: 2
                },
                {
                    label: 'Temperature 2m (°C)',
                    data: temperature2m, // Data for 'Temperature 2m'
                    borderColor: 'rgba(255, 99, 132, 1)',
                    fill: false,
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top'
                },
                title: {
                    display: true,
                    text: 'Visualization of Summe and Temperature Data'
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time of Measurement'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Values'
                    }
                }
            }
        }
    });
}

// Fetch data and render chart when page loads
fetchData();
