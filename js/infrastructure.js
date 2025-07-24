// infrastructure.js

document.addEventListener('DOMContentLoaded', () => {
    // Function to fetch data from an API endpoint
    async function fetchData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching data:', error);
            return []; // Return an empty array on error
        }
    }

    const tankSection = document.getElementById('tankSection').querySelector('.row.flex-nowrap');
    const sensorSection = document.getElementById('sensorSection').querySelector('.row.flex-nowrap');
    const pipeSection = document.getElementById('pipeSection').querySelector('.row.flex-nowrap');

    // Function to create a tank card (remains the same as before)
    function createTankCard(data) {
        const colDiv = document.createElement('div');
        colDiv.className = 'col-4';
        colDiv.tabIndex = 0; // Make it focusable


        const waterLevel = (data.waterLevel/data.capacity)*100

        colDiv.innerHTML = `
            <div class="cards-container">
                <div class="card">
                    <div class="row">
                        <div class="col-6 p-0">
                            <div class="card-header">
                                <span class="tank-name"><strong>${data.name}</strong></span>
                            </div>
                            <div class="card-body p-0">
                                <p><i class="fa fa-map-marker-alt"></i> <a href="${data.location}" target="_blank" style="margin-left: 5px; color: #007bff;"><span class="text-edit">Location</span></a></p>
                                <div class="card-content">
                                    <p><i class="fa fa-clipboard-check"></i> <strong>Status:</strong> <span class="tank-status ${data.statusClass}">${data.operationalStatus}</span></p>
                                    <p><i class="fa fa-tachometer-alt"></i> <strong>Capacity:</strong> ${data.capacity}</p>
                                    <p><i class="fa fa-water"></i> <strong>Water Level:</strong> ${waterLevel}%</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="tank">
                                <img src="${data.image}" alt="">
                                <div class="water" id="waterLevel"></div>
                                <span class="level-text" id="levelText">${waterLevel}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        return colDiv;
    }

    // Function to create a sensor card (remains the same as before)
    function createSensorCard(data) {
        const colDiv = document.createElement('div');
        colDiv.className = 'col-4';
        colDiv.tabIndex = 0; // Make it focusable

        colDiv.innerHTML = `
            <div class="cards-container">
                <div class="card">
                    <div class="row">
                        <div class="col-6 p-0">
                            <div class="card-header">
                                <span class="tank-name"><strong>${data.name}</strong></span>
                            </div>
                            <div class="card-body p-0">
                                <p><i class="fa fa-map-marker-alt"></i> <a href="${data.location}" target="_blank" style="margin-left: 5px; color: #007bff;"><span class="text-edit">Location</span></a></p>
                                <div class="card-content">
                                    <p><i class="fa fa-barcode"></i> <strong>ID:</strong> ${data.id}</p>
                                    <p><i class="fa fa-clipboard-check"></i> <strong>Status:</strong> <span class="tank-status ${data.statusClass}">${data.status}</span></p>
                                    <p><i class="fa fa-tachometer-alt"></i> <strong>Type:</strong> ${data.type}</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="sensor">
                                <img src="${data.image}" alt="">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        return colDiv;
    }

    // Function to create a pipe card (remains the same as before)
    function createPipeCard(data) {
        const colDiv = document.createElement('div');
        colDiv.className = 'col-4';
        colDiv.tabIndex = 0; // Make it focusable

        colDiv.innerHTML = `
            <div class="cards-container">
                <div class="pipe-card">
                    <div class="row">
                        <div class="col-6 p-0">
                            <div class="card-header">
                                <span class="tank-name"><strong>${data.name}</strong></span>
                            </div>
                            <div class="card-body p-0">
                                <p><i class="fa fa-map-marker-alt"></i> <a href="${data.location}" target="_blank" style="margin-left: 5px; color: #007bff;"><span class="text-edit">Location</span></a></p>
                                <div class="card-content">
                                    <p><i class="fa fa-barcode"></i> <strong>ID:</strong> ${data.id}</p>
                                    <p><i class="fa fa-clipboard-check"></i> <strong>Status:</strong> <span class="tank-status ${data.statusClass}">${data.status}</span></p>
                                    <p><i class="fa fa-ruler-horizontal"></i> <strong>Diameter:</strong> ${data.diameter}</p>
                                    <p><i class="fa fa-ruler"></i> <strong>Length:</strong> ${data.length}</p>
                                    <p><i class="fa fa-tint"></i> <strong>Flow Rate:</strong> ${data.flowRate}</p>
                                    <p><i class="fa fa-tachometer-alt"></i> <strong>Pressure Level:</strong> ${data.pressureLevel}</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="sensor">
                                <img src="${data.image}" alt="">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        return colDiv;
    }

    // Function to render cards
    function renderCards(dataArray, containerElement, createCardFunction, addCardId) {
        containerElement.innerHTML = ''; // Clear existing cards

        dataArray.forEach(data => {
            const card = createCardFunction(data);
            containerElement.appendChild(card);
        });

        const addCardTemplate = document.getElementById(addCardId);
        if (addCardTemplate) {
            containerElement.appendChild(addCardTemplate.parentNode);
        }
    }

    // Main function to load all data and render cards
    async function loadInfrastructureData() {
		/*
		 * this is where i will fetch data from the API
		 * the data will then be used to dynamically populate the html page
		 */
        const tanksData = await fetchData('http://localhost:5125/api/Tank/get-all-tanks'); 
        const sensorsData = await fetchData('http://localhost:5125/api/Sensor/get-devices'); 
        const pipesData = await fetchData('http://localhost:5125/api/Tank/get-all-pipes'); 

        renderCards(tanksData, tankSection, createTankCard, 'tankCard');
        renderCards(sensorsData, sensorSection, createSensorCard, 'sensorCard');
        renderCards(pipesData, pipeSection, createPipeCard, 'pipeCard');
    }

    // Call the load function when the DOM is ready
    loadInfrastructureData();

    // Add event listeners for "Add Tank" form
    const addTankForm = document.getElementById('addTankForm');
    if (addTankForm) {
        addTankForm.addEventListener('submit', async function (event) { // Make the event listener async
            event.preventDefault();

            const tankName = document.getElementById('tankName').value;
            const tankArea = document.getElementById('tankArea').value;
            const tankStatus = document.getElementById('tankStatus').value;
            const tankCapacity = document.getElementById('tankCapacity').value;
            const tankLevel = document.getElementById('tankLevel').value;
            const phLevel = document.getElementById('phLevel').value;

            // Determine image based on water level
            let tankImage = "./img/WiS/wave-empty.svg";
            if (parseInt(tankLevel) > 0 && parseInt(tankLevel) <= 50) {
                tankImage = "./img/WiS/wave.svg";
            } else if (parseInt(tankLevel) > 50) {
                tankImage = "./img/WiS/wave-half.svg";
            }

            const newTank = {
                name: tankName,
                location: "https://www.google.com/maps?q=Pipe+6", // Default URL for new tanks
                status: tankStatus,
                statusClass: tankStatus.toLowerCase().includes('low') || tankStatus.toLowerCase().includes('faulty') ? 'faulty' : '',
                capacity: tankCapacity,
                waterLevel: `${tankLevel}%`,
                phLevel: phLevel,
                image: tankImage,
                timeToEmpty: "N/A" // This would ideally be calculated
            };

            // Assuming you have an API endpoint to add new tanks
            try {
                const response = await fetch('/api/tanks', { 
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newTank),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                // After successful addition, re-fetch and re-render the tanks to include the new one
                const updatedTanksData = await fetchData('/api/tanks');
                renderCards(updatedTanksData, tankSection, createTankCard, 'tankCard');

                addTankForm.reset(); // Clear form
                document.getElementById('tankForm').checked = false; // Close the add card
            } catch (error) {
                console.error('Error adding new tank:', error);
                alert('Failed to add tank. Please try again.');
            }
        });
    }

    // General functionality for selecting cards and delete buttons
    function setupCardSelection(sectionId, deleteBtnId) {
        const section = document.getElementById(sectionId);
        const deleteBtn = document.getElementById(deleteBtnId);
        let selectedCard = null;

        section.addEventListener('click', (event) => {
            let card = event.target.closest('.col-4');
            if (card && !card.classList.contains('newCard')) { // Exclude the "Add New" card
                if (selectedCard) {
                    selectedCard.classList.remove('selected-card');
                }
                selectedCard = card;
                selectedCard.classList.add('selected-card');
            }
        });

        deleteBtn.addEventListener('click', async () => { // Make the event listener async
            if (selectedCard) {
                // Assuming you have a way to get the ID of the item to delete from the card's data
                // This will depend on how you embed the ID into your card's HTML or data attributes.
                // For demonstration, let's assume the first element in the card's innerHTML contains the name
                const itemName = selectedCard.querySelector('.tank-name strong').textContent;
                let endpoint = '';
                let dataArrayRef = [];
                let renderFunction;
                let addCardId;

                // Determine which API endpoint and data array to use based on the section
                if (sectionId === 'tankSection') {
                    endpoint = '/api/tanks/'; // Append ID for specific deletion
                    dataArrayRef = await fetchData('/api/tanks'); // Get current data
                    renderFunction = createTankCard;
                    addCardId = 'tankCard';
                } else if (sectionId === 'sensorSection') {
                    endpoint = '/api/sensors/';
                    dataArrayRef = await fetchData('/api/sensors');
                    renderFunction = createSensorCard;
                    addCardId = 'sensorCard';
                } else if (sectionId === 'pipeSection') {
                    endpoint = '/api/pipes/';
                    dataArrayRef = await fetchData('/api/pipes');
                    renderFunction = createPipeCard;
                    addCardId = 'pipeCard';
                }

                // Find the ID of the item to delete (you'll need a more robust way to get the ID)
                const itemToDelete = dataArrayRef.find(item => item.name === itemName);

                if (itemToDelete && itemToDelete.id) { // Assuming your API uses an 'id' field for deletion
                    try {
                        const response = await fetch(`${endpoint}${itemToDelete.id}`, {
                            method: 'DELETE',
                        });

                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }

                        // Re-fetch and re-render the cards after deletion
                        const updatedData = await fetchData(endpoint.slice(0, -1)); // Remove trailing slash for fetch
                        renderCards(updatedData, section, renderFunction, addCardId);

                        selectedCard = null; // Clear selection
                    } catch (error) {
                        console.error('Error deleting item:', error);
                        alert('Failed to delete item. Please try again.');
                    }
                } else {
                    alert('Could not determine the item to delete or no ID found.');
                }
            } else {
                alert('Please select a card to delete.');
            }
        });
    }

    setupCardSelection('tankSection', 'deleteBtnTanks');
    setupCardSelection('sensorSection', 'deleteBtnSensors');
    setupCardSelection('pipeSection', 'deleteBtnPipes');
}); 