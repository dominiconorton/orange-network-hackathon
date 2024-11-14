body {
    font-family: 'Roboto', sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f4f4f9;
}

.header {
    padding: 20px;
    text-align: center;
}

.container {
    padding: 20px;
}

.map-section, .alerts, .traffic-count, .incidents {
    margin-bottom: 20px;
    padding: 20px;
}

h2 {
    margin-top: 0;
}

#map {
    height: 400px;
    width: 100%;
    border-radius: 8px;
}

#traffic-chart {
    height: 200px;
    width: 100%;
    border-radius: 8px;
    background-color: #ddd;
    padding: 10px;
    box-sizing: border-box;
}

.shadecn-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
}

.shadecn-list {
    list-style-type: none;
    padding: 0;
}

.shadecn-list li {
    background-color: #fff;
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
}

.vehicle-status {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.connected {
    background-color: #e0f7fa;
    color: #00796b;
}

.disconnected {
    background-color: #ffebee;
    color: #c62828;
}

.icon {
    font-size: 24px;
    margin-right: 10px;
}

.connected-icon::before {
    content: '🔗'; /* Example icon for connected vehicles */
}

.disconnected-icon::before {
    content: '❌'; /* Example icon for disconnected vehicles */
}

.alert-tag, .incident-tag {
    background-color: #f0f0f0;
    padding: 5px 10px;
    border-radius: 3px;
    font-size: 12px;
    color: #333;
    margin-left: 5px;
}

.high-priority {
    background-color: #ffcccc;
    color: #c62828;
}

.medium-priority {
    background-color: #fff3cd;
    color: #856404;
}

.low-priority {
    background-color: #d4edda;
    color: #155724;
}

.traffic {
    background-color: #e0f7fa;
    color: #00796b;
}

.weather {
    background-color: #cce5ff;
    color: #004085;
}

.roadwork {
    background-color: #ffeeba;
    color: #856404;
}

.safety {
    background-color: #f8d7da;
    color: #721c24;
}

.route-change {
    background-color: #d1ecf1;
    color: #0c5460;
}

/* Modal styles */
.modal {
    display: none; /* Hidden by default */
    position: fixed; /* Stay in place */
    z-index: 1000; /* Sit on top */
    left: 0;
    top: 0;
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    overflow: auto; /* Enable scroll if needed */
    background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
    padding-top: 60px;
}

.modal-content {
    background-color: #fefefe;
    margin: 5% auto; /* 15% from the top and centered */
    padding: 20px;
    border: 1px solid #888;
    width: 80%; /* Could be more or less, depending on screen size */
    border-radius: 8px;
}

.close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
}

.close:hover,
.close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
}

button {
    background-color: #4CAF50; /* Green */
    border: none;
    color: white;
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 4px;
}

/* Custom marker colors */
.red-marker .leaflet-marker-icon {
    filter: hue-rotate(180deg) saturate(5) brightness(0.8);
}

/* Eye icon styles */
.toggle-visibility {
    margin-left: 10px;
    cursor: pointer;
    color: #00796b; /* Default color for the icon */
}

.toggle-visibility:hover {
    color: #004d40; /* Darker color on hover */
}
JavaScript (script.js)
// Include Leaflet JS
const script = document.createElement('script');
script.src = 'https://unpkg.com/leaflet/dist/leaflet.js';
document.head.appendChild(script);

script.onload = () => {
    // Initialize the map
    const map = L.map('map').setView([48.8566, 2.3522], 13); // Coordinates for Paris, France

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Define custom icons for connected and disconnected vehicles
    const greenIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        shadowSize: [41, 41]
    });

    const redIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        shadowSize: [41, 41]
    });

    // Add markers for different locations in Paris
    const locations = [
        { coords: [48.8566, 2.3522], popup: 'Central Paris', icon: greenIcon },
        { coords: [48.8584, 2.2945], popup: 'Eiffel Tower', icon: greenIcon },
        { coords: [48.8606, 2.3376], popup: 'Louvre Museum', icon: greenIcon },
        { coords: [48.8738, 2.2950], popup: 'Arc de Triomphe', icon: redIcon },
        { coords: [48.8529, 2.3499], popup: 'Notre-Dame Cathedral', icon: redIcon }
    ];

    let connectedCount = 0;
    let disconnectedCount = 0;
    const connectedMarkers = [];
    const disconnectedMarkers = [];

    locations.forEach(location => {
        const marker = L.marker(location.coords, { icon: location.icon }).addTo(map)
            .bindPopup(location.popup);

        // Store references to connected and disconnected markers
        if (location.icon === greenIcon) {
            connectedCount++;
            connectedMarkers.push(marker);
        } else if (location.icon === redIcon) {
            disconnectedCount++;
            disconnectedMarkers.push(marker);
        }
    });

    // Update the traffic count display
    document.getElementById('connected-vehicles').textContent = connectedCount;
    document.getElementById('disconnected-vehicles').textContent = disconnectedCount;

    // Toggle visibility of connected markers
    let connectedVisible = true;
    document.getElementById('toggle-connected').addEventListener('click', () => {
        connectedVisible = !connectedVisible;
        connectedMarkers.forEach(marker => {
            if (connectedVisible) {
                marker.addTo(map);
            } else {
                map.removeLayer(marker);
            }
        });
    });

    // Toggle visibility of disconnected markers
    let disconnectedVisible = true;
    document.getElementById('toggle-disconnected').addEventListener('click', () => {
        disconnectedVisible = !disconnectedVisible;
        disconnectedMarkers.forEach(marker => {
            if (disconnectedVisible) {
                marker.addTo(map);
            } else {
                map.removeLayer(marker);
            }
        });
    });

    // Step 2: Set up the API request for the Eiffel Tower marker using the server-side proxy
    const proxyUrl = '/proxy'; // Use your server-side proxy endpoint

    function sendApiRequest() {
        fetch(proxyUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                device: {
                    phoneNumber: "+33699901040"
                }
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('API Response:', data);
            // Handle the response data as needed
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    // Step 3: Schedule the requests every 2 seconds
    setInterval(sendApiRequest, 2000);
};

// Initialize other components
function initAlerts() {
    const alerts = [
        { message: "Heavy traffic on Elm St.", type: "Traffic", priority: "High Priority" },
        { message: "Rain expected in the afternoon", type: "Weather", priority: "Medium Priority" },
        { message: "Construction on 2nd Ave.", type: "Roadwork", priority: "Low Priority" },
        { message: "Accident on 5th Ave.", type: "Safety", priority: "High Priority" },
        { message: "Reroute due to road closure", type: "Route Change", priority: "Immediate" }
    ];

    const alertsList = document.getElementById('alerts-list');
    alerts.forEach(alert => {
        const li = document.createElement('li');
        li.textContent = alert.message;

        const typeTag = document.createElement('span');
        typeTag.className = `alert-tag ${alert.type.toLowerCase().replace(' ', '-')}`;
        typeTag.textContent = alert.type;

        const priorityTag = document.createElement('span');
        priorityTag.className = `alert-tag ${alert.priority.toLowerCase().replace(' ', '-')}`;
        priorityTag.textContent = alert.priority;

        li.appendChild(typeTag);
        li.appendChild(priorityTag);
        alertsList.appendChild(li);
    });
}

function initIncidents() {
    const incidents = [
        { description: "Accident on Highway 101", type: "Accident" },
        { description: "Construction on 3rd St.", type: "Construction" },
        { description: "Heavy rain causing delays", type: "Weather" },
        { description: "Road closure on Main St.", type: "Closure" }
    ];

    const incidentList = document.getElementById('incident-list');
    incidents.forEach(incident => {
        const li = document.createElement('li');
        li.textContent = incident.description;

        const tag = document.createElement('span');
        tag.className = 'incident-tag';
        tag.textContent = incident.type;

        li.appendChild(tag);
        incidentList.appendChild(li);

        // Add click event to open modal
        li.addEventListener('click', () => openModal(incident.description));
    });
}

function openModal(description) {
    const modal = document.getElementById('incident-modal');
    const span = document.getElementsByClassName('close')[0];
    const alertMessageInput = document.getElementById('alert-message');

    // Set the alert message to the incident description
    alertMessageInput.value = description;

    // Display the modal
    modal.style.display = 'block';

    // Close the modal when the user clicks on <span> (x)
    span.onclick = function() {
        modal.style.display = 'none';
    }

    // Close the modal when the user clicks anywhere outside of the modal
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
}

function handleFormSubmit(event) {
    event.preventDefault();

    const alertMessage = document.getElementById('alert-message').value;
    const alertType = document.getElementById('alert-type').value;
    const alertPriority = document.getElementById('alert-priority').value;

    // Add the new alert to the alerts list
    const alertsList = document.getElementById('alerts-list');
    const li = document.createElement('li');
    li.textContent = alertMessage;

    const typeTag = document.createElement('span');
    typeTag.className = `alert-tag ${alertType.toLowerCase().replace(' ', '-')}`;
    typeTag.textContent = alertType;

    const priorityTag = document.createElement('span');
    priorityTag.className = `alert-tag ${alertPriority.toLowerCase().replace(' ', '-')}`;
    priorityTag.textContent = alertPriority;

    li.appendChild(typeTag);
    li.appendChild(priorityTag);
    alertsList.appendChild(li);

    // Close the modal
    document.getElementById('incident-modal').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    initAlerts();
    initIncidents();

    // Handle form submission
    document.getElementById('alert-form').addEventListener('submit', handleFormSubmit);
});