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

    locations.forEach(location => {
        L.marker(location.coords, { icon: location.icon }).addTo(map)
            .bindPopup(location.popup);

        // Count connected and disconnected vehicles
        if (location.icon === greenIcon) {
            connectedCount++;
        } else if (location.icon === redIcon) {
            disconnectedCount++;
        }
    });

    // Update the traffic count display
    document.getElementById('connected-vehicles').textContent = connectedCount;
    document.getElementById('disconnected-vehicles').textContent = disconnectedCount;

    // Step 2: Set up the API request for the Eiffel Tower marker
    const apiUrl = 'https://api.orange.com/camara/orange-lab/device-reachability-status/v0/retrieve';

    function sendApiRequest() {
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJ2ZXIiOiIxLjAiLCJhbGciOiJFUzM4NCIsImtpZCI6Ikg1RkdUNXhDUlJWU0NseG5vTXZCWEtUM1AyckhTRVZUNV9VdE16UFdCYTQifQ.eyJpc3MiOiJodHRwczovL2FwaS5vcmFuZ2UuY29tL29hdXRoL3YzIiwiYXVkIjpbIm9wZSJdLCJleHAiOjE3MzE1MDk2MjQsImlhdCI6MTczMTUwNjAyNCwianRpIjoiUUpSeU5GQXVIcG84a3FSWGtITnpOZ3RBWVlmdEJPaWZ0OGN0QWN4NFVGYzdDVDhyc2k4UXNER3o2ek1WWTZrN2I0blJ2M3Z6OHE5c09YU0pHTG1GRnl2TWZUeUdxRFlMV0dnSiIsImNsaWVudF9pZCI6IllKaUF6a0J3T212dWJjcks0UHhIRlo4MExZZmhKUGcwIiwic3ViIjoiWUppQXprQndPbXZ1YmNySzRQeEhGWjgwTFlmaEpQZzAiLCJjbGllbnRfbmFtZSI6eyJkZWZhdWx0IjoiT3JhbmdlIE5ldHdvcmsgRGV2ZWxvcGVyIEhhY2thdGhvbiJ9LCJjbGllbnRfdGFnIjoieFMxR0VlR0UybDZpMXNiZiIsInNjb3BlIjpbIm9wZTpjYW1hcmFfZ2VvZmVuY2luZ19vcmFuZ2UtbGFiOnYwOmFjY2VzcyIsIm9wZTpjYW1hcmFfZGV2aWNlLXJlYWNoYWJpbGl0eS1zdGF0dXNfb3JhbmdlLWxhYjp2MDphY2Nlc3MiXSwibWNvIjoiU0VLQVBJIn0.xA2WkGodSi3yv4w7QeF8Ury7e5q5intsbqC3U2I48ZrI4Q729XqjrQXzdArNEuXGK9nalAPvM1sRk4W53mrTbvczYIsuuYbXR9GxMbx0JtwQmD4yhPW-8nkKFbHBsWUe',
                'accept': 'application/json',
                'Cache-Control': 'no-cache'
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