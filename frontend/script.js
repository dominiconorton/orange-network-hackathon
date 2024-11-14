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
        { coords: [48.8566, 2.3522], id: 'ID1234', type: 'Car', icon: greenIcon, phoneNumber: "+33699901040" },
        { coords: [48.8584, 2.2945], id: 'ID5678', type: 'Truck', icon: greenIcon, phoneNumber: "+33699901039" },
        { coords: [48.8606, 2.3376], id: 'ID9101', type: 'Bus', icon: greenIcon, phoneNumber: "+33699901037" },
        { coords: [48.8738, 2.2950], id: 'ID1121', type: 'Car', icon: redIcon },
        { coords: [48.8529, 2.3499], id: 'ID3141', type: 'Truck', icon: redIcon }
    ];

    let connectedCount = 0;
    let disconnectedCount = 0;
    const connectedMarkers = [];
    const disconnectedMarkers = [];

    locations.forEach(location => {
        const popupContent = `
            <div>
                <strong>ID:</strong> ${location.id}<br>
                <strong>Type:</strong> ${location.type}<br>
                <a href="#" onclick="viewDashboard('${location.id}')">View Dashboard</a>
            </div>
        `;
        const marker = L.marker(location.coords, { icon: location.icon }).addTo(map)
            .bindPopup(popupContent);

        // Store references to connected and disconnected markers
        if (location.icon === greenIcon) {
            connectedCount++;
            connectedMarkers.push({ marker, phoneNumber: location.phoneNumber });
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
        connectedMarkers.forEach(({ marker }) => {
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

    // Function to send API requests for each connected marker
    function sendApiRequest(phoneNumber) {
        fetch('/proxy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                device: {
                    phoneNumber: phoneNumber
                }
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log(`API Response for ${phoneNumber}:`, data);
            // Handle the response data as needed
        })
        .catch(error => {
            console.error(`Error for ${phoneNumber}:`, error);
        });
    }

    // Schedule the requests every 2 seconds for each connected marker
    setInterval(() => {
        connectedMarkers.forEach(({ phoneNumber }) => {
            sendApiRequest(phoneNumber);
        });
    }, 2000);
};

// Define 50 random and differentiated incidents
const randomIncidents = [
    { description: "Heavy traffic on Elm St.", type: "Traffic" },
    { description: "Rain expected in the afternoon", type: "Weather" },
    { description: "Construction on 2nd Ave.", type: "Roadwork" },
    { description: "Accident on 5th Ave.", type: "Safety" },
    { description: "Reroute due to road closure", type: "Route Change" },
    { description: "Flooding on River Rd.", type: "Weather" },
    { description: "Power outage affecting traffic lights", type: "Safety" },
    { description: "Parade causing delays on Main St.", type: "Event" },
    { description: "Road closure for marathon", type: "Event" },
    { description: "High winds affecting bridge traffic", type: "Weather" },
    { description: "Traffic jam on 7th Ave.", type: "Traffic" },
    { description: "Snowstorm expected overnight", type: "Weather" },
    { description: "Bridge maintenance on River Rd.", type: "Roadwork" },
    { description: "Minor accident on Elm St.", type: "Safety" },
    { description: "Detour due to construction", type: "Route Change" },
    { description: "Landslide blocking highway", type: "Weather" },
    { description: "Traffic lights malfunctioning", type: "Safety" },
    { description: "Festival causing road closures", type: "Event" },
    { description: "Marathon route affecting traffic", type: "Event" },
    { description: "Fog reducing visibility", type: "Weather" },
    { description: "Congestion on Main St.", type: "Traffic" },
    { description: "Thunderstorm warning issued", type: "Weather" },
    { description: "Pothole repairs on 3rd Ave.", type: "Roadwork" },
    { description: "Vehicle breakdown on highway", type: "Safety" },
    { description: "Temporary road closure", type: "Route Change" },
    { description: "Flood warning in low areas", type: "Weather" },
    { description: "Traffic signal outage", type: "Safety" },
    { description: "Concert causing traffic delays", type: "Event" },
    { description: "Sporting event affecting traffic", type: "Event" },
    { description: "Ice on roads, drive carefully", type: "Weather" },
    { description: "Rush hour congestion", type: "Traffic" },
    { description: "Heatwave affecting road conditions", type: "Weather" },
    { description: "Utility work on 5th Ave.", type: "Roadwork" },
    { description: "Pedestrian accident on Main St.", type: "Safety" },
    { description: "New detour route available", type: "Route Change" },
    { description: "Severe weather alert", type: "Weather" },
    { description: "Traffic light synchronization issue", type: "Safety" },
    { description: "Parade route announced", type: "Event" },
    { description: "Street fair causing detours", type: "Event" },
    { description: "Visibility reduced by fog", type: "Weather" },
    { description: "Traffic congestion on 8th Ave.", type: "Traffic" },
    { description: "Rainstorm expected this evening", type: "Weather" },
    { description: "Road resurfacing on Elm St.", type: "Roadwork" },
    { description: "Minor collision on 7th Ave.", type: "Safety" },
    { description: "Alternate route suggested", type: "Route Change" },
    { description: "Flash flood warning", type: "Weather" },
    { description: "Traffic light repair ongoing", type: "Safety" },
    { description: "Community event affecting traffic", type: "Event" },
    { description: "Charity run causing road closures", type: "Event" },
    { description: "Dense fog advisory", type: "Weather" }
];

// Function to add a new random incident
function addRandomIncident() {
    const randomIndex = Math.floor(Math.random() * randomIncidents.length);
    const newIncident = randomIncidents[randomIndex];

    const incidentList = document.getElementById('incident-list');
    const li = document.createElement('li');
    const timestamp = new Date().toLocaleTimeString();
    li.innerHTML = `<strong>${timestamp}</strong> - ${newIncident.description}`;

    const tag = document.createElement('span');
    tag.className = 'incident-tag';
    tag.textContent = newIncident.type;

    li.appendChild(tag);
    incidentList.insertBefore(li, incidentList.firstChild); // Add to the top

    // Add click event to open modal
    li.addEventListener('click', () => openModal(newIncident.description));
}

// Initialize incidents and add a new one every 5 seconds
function initIncidents() {
    const initialIncidents = [
        { description: "Accident on Highway 101", type: "Accident" },
        { description: "Construction on 3rd St.", type: "Construction" },
        { description: "Heavy rain causing delays", type: "Weather" },
        { description: "Road closure on Main St.", type: "Closure" }
    ];

    const incidentList = document.getElementById('incident-list');
    initialIncidents.forEach(incident => {
        const li = document.createElement('li');
        const timestamp = new Date().toLocaleTimeString();
        li.innerHTML = `<strong>${timestamp}</strong> - ${incident.description}`;

        const tag = document.createElement('span');
        tag.className = 'incident-tag';
        tag.textContent = incident.type;

        li.appendChild(tag);
        incidentList.insertBefore(li, incidentList.firstChild); // Add to the top

        // Add click event to open modal
        li.addEventListener('click', () => openModal(incident.description));
    });

    // Add a new random incident every 5 seconds
    setInterval(addRandomIncident, 5000);
}

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
        const timestamp = new Date().toLocaleTimeString();
        li.innerHTML = `<strong>${timestamp}</strong> - ${alert.message}`;

        const typeTag = document.createElement('span');
        typeTag.className = `alert-tag ${alert.type.toLowerCase().replace(' ', '-')}`;
        typeTag.textContent = alert.type;

        const priorityTag = document.createElement('span');
        priorityTag.className = `alert-tag ${alert.priority.toLowerCase().replace(' ', '-')}`;
        priorityTag.textContent = alert.priority;

        li.appendChild(typeTag);
        li.appendChild(priorityTag);
        alertsList.insertBefore(li, alertsList.firstChild); // Add to the top
    });
}

function openModal(description) {
    const modal = document.getElementById('incident-modal');
    const span = document.getElementsByClassName('close')[0];
    const alertMessageInput = document.getElementById('alert-message');
    const incidentSubheading = document.getElementById('incident-subheading');

    // Set the alert message to the incident description
    alertMessageInput.value = description;

    // Set the subheading to the incident description
    incidentSubheading.textContent = `Incident: ${description}`;

    // Display the modal
    modal.style.display = 'block';

    // Close the modal when the user clicks on <span> (x)
    span.onclick = function() {
        modal.style.display = 'none';
        document.getElementById('advice-text').textContent = 'No advice generated yet.'; // Reset advice
    }

    // Close the modal when the user clicks anywhere outside of the modal
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
            document.getElementById('advice-text').textContent = 'No advice generated yet.'; // Reset advice
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
    const timestamp = new Date().toLocaleTimeString();
    li.innerHTML = `<strong>${timestamp}</strong> - ${alertMessage}`;

    const typeTag = document.createElement('span');
    typeTag.className = `alert-tag ${alertType.toLowerCase().replace(' ', '-')}`;
    typeTag.textContent = alertType;

    const priorityTag = document.createElement('span');
    priorityTag.className = `alert-tag ${alertPriority.toLowerCase().replace(' ', '-')}`;
    priorityTag.textContent = alertPriority;

    li.appendChild(typeTag);
    li.appendChild(priorityTag);
    alertsList.insertBefore(li, alertsList.firstChild); // Add to the top

    // Close the modal
    document.getElementById('incident-modal').style.display = 'none';
}

function viewDashboard(vehicleId) {
    // Example: Open a modal or redirect to a detailed dashboard page
    alert(`Viewing dashboard for vehicle ID: ${vehicleId}`);
    // You can replace the alert with actual logic to open a dashboard
}

document.getElementById('generate-advice-button').addEventListener('click', generateAdvice);

function generateAdvice() {
    const incidentDescription = document.getElementById('incident-subheading').textContent.replace('Incident: ', '');

    fetch('/generate-advice', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ incidentDescription })
    })
    .then(response => response.json())
    .then(data => {
        const advice = data.choices[0].message.content;
        document.getElementById('advice-text').textContent = advice;
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('advice-text').textContent = 'Failed to generate advice. Please try again.';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initAlerts();
    initIncidents();

    // Handle form submission
    document.getElementById('alert-form').addEventListener('submit', handleFormSubmit);
});