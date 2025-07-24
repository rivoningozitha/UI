document.addEventListener('DOMContentLoaded', () => {
    const pendingTasksContainer = document.querySelector('#pending .cards-container');
    const inProgressTasksContainer = document.querySelector('#progress .cards-container');
    const completeTasksContainer = document.querySelector('#complete .cards-container');

    // Map the status value for each task
    const statusMap = {
        0: { name: 'Pending', class: 'pending' },
        1: { name: 'In Progress', class: 'progress' },
        2: { name: 'Complete', class: 'complete' }
    };

    // Corrects the time Format from the database
    const formatDateTime = (isoString) => {
        if (!isoString) return "N/A";

        const date = new Date(isoString);
        return date.toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Function to fetch data from an API endpoint
    async function fetchData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                const errorBody = await response.text(); // Get error message from response body
                throw new Error(`HTTP error! status: ${response.status}. Message: ${errorBody || 'No specific error message.'}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching data:', error);
            return null;
        }
    }

    // NEW: Function to fetch full name by ID
    async function fetchFullName(id) {
        try {
            const response = await fetch(`http://localhost:5125/api/User/Availablepersonnel/${id}`);
            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`HTTP error! status: ${response.status}. Message: ${errorBody || 'No specific error message.'}`);
            }
            return await response.text();
        } catch (error) {
            console.error(`Error fetching name for ID ${id}:`, error);
            return `Unknown User (ID: ${id})`;
        }
    }

    // Function to generate a task card
    async function generateTaskCard(task, availablePersonnel) {
        const taskStatusInt = parseInt(task.status, 10);
        const currentStatus = statusMap[taskStatusInt] || { name: 'Unknown', class: 'unknown' };

        const reportId = task.reportId;

        // Retrieve report related to the task
        const report = await fetchData(`http://localhost:5125/api/Reports/${reportId}`);

        // Initialize with default values
        let reportPriority = 'N/A'; // Changed from reportPriorityLevel
        let reportDescription = 'N/A';

        // Check if report data was successfully fetched and assign values
        if (report) {
            reportPriority = report.priority; // Corrected to 'report.priority'
            reportDescription = report.description;
        }

        const cardDiv = document.createElement('div');
        cardDiv.classList.add(task.priority === 'High' ? 'high-priority' : 'low-priority');

        cardDiv.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <div class="card-title">${task.title || 'N/A'}</div>
                    <span class="card-status ${currentStatus.class}">${currentStatus.name}</span>
                </div>
                <div class="card-body">
                    <p> <i class="fa fa-clock"></i> Reported: ${formatDateTime(task.generatedAt)}</p>
                    <p> <i class="fa fa-exclamation-circle"></i> Priority: ${reportPriority} </p>
                    <p> <i class="fa fa-book"></i> Note: ${reportDescription} </p>
                    ${taskStatusInt === 1 ? `<p> <i class="fa fa-user"></i> Assigned To: ${task.assignedTo || 'N/A'} </p>` : ''}
                    ${taskStatusInt === 2 ? `<p> <i class="fa fa-user"></i> Completed By: ${task.completedBy || 'N/A'} </p>` : ''}
                    ${taskStatusInt === 0 ? `
                        <div class="card-footer">
                            <input type="checkbox" id="modal-toggle-${task.id}" class="modal-toggle" hidden>
                            <label for="modal-toggle-${task.id}" class="btn btn-orange rounded-pill py-2 mt-2 me-2 assign-task-btn">Assign Task</label>
                            <div class="modal">
                                <div class="modal-content">
                                    <label for="modal-toggle-${task.id}" class="close">×</label>
                                    <h4>Available Personnel </h4>
                                    <div class="personnel-list">
                                        ${(availablePersonnel || []).map(person => `
                                            <div class="person">
                                                <span>${person.fullName}</span>
                                                <button class="notify-btn" data-task-id="${task.id}" data-person-id="${person.id}"> Assign </button>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        return cardDiv;
    }

    // Event delegation for assign buttons
    document.addEventListener('click', async function(event) {
        // Handle assign task button clicks inside the modal
        if (event.target.matches('.notify-btn')) {
            const taskId = event.target.dataset.taskId;
            const personId = event.target.dataset.personId; // Get ID

            console.log(`Attempting to assign task ${taskId} to ${personId}`); // Debugging log

            try {
                // Corrected API endpoint and method for assignment
                const response = await fetch(`http://localhost:5125/api/MaintenanceTask/${taskId}/${personId}/assignment`, {
                    method: 'POST', // Changed to POST
                    headers: {
                        'Content-Type': 'application/json', // Keep if your API expects it, even with empty body
                    },
                    // Removed body as plumber ID is in URL and no other data is expected
                });

                if (!response.ok) {
                    const errorBody = await response.text();
                    throw new Error(`HTTP error! status: ${response.status}. Message: ${errorBody || 'No specific error message.'}`);
                }

                // Close the modal
                const modalToggle = document.querySelector(`#modal-toggle-${taskId}`);
                if (modalToggle) {
                    modalToggle.checked = false;
                }

                // Fetch the full name of the assigned person for the alert
                const assignedPersonFullName = await fetchFullName(personId);
                alert(`Task assigned to ${assignedPersonFullName} and moved to In Progress.`); // Provide feedback
                renderTasks(); // Re-render tasks after successful assignment
            } catch (error) {
                console.error('Error assigning task:', error);
                alert('Failed to assign task. Please try again: ' + error.message);
            }
        }
    });

    async function renderTasks() {
        pendingTasksContainer.innerHTML = '<p class="loading-message">Loading tasks...</p>';
        inProgressTasksContainer.innerHTML = '<p class="loading-message">Loading tasks...</p>';
        completeTasksContainer.innerHTML = '<p class="loading-message">Loading tasks...</p>';

        try {
            // Fetch data from API endpoints
            const maintenanceTasks = await fetchData('http://localhost:5125/api/MaintenanceTask/Get-All-Tasks');
            const personnelData = await fetchData('http://localhost:5125/api/User/Plumbers?available=true'); // Renamed to personnelData
            
            // Create personnel array with IDs and names
            const availablePersonnel = [];
            if (personnelData && personnelData.length > 0) {
                for (const personnel of personnelData) {
                    id = personnel.employeeId
                    //console.log("Personnel Id", id); // Debug
                    const fullName = await fetchFullName(personnel.employeeId);
                    availablePersonnel.push({ id, fullName });
                }
            }

            console.log("Fetched Maintenance Tasks: ", maintenanceTasks); // Debugging log
            console.log("Fetched Available Personnel: ", availablePersonnel); // Debugging log


            pendingTasksContainer.innerHTML = '';
            inProgressTasksContainer.innerHTML = '';
            completeTasksContainer.innerHTML = '';

            for (const task of maintenanceTasks || []) {
                const taskCard = await generateTaskCard(task, availablePersonnel || []);
                const taskStatusInt = parseInt(task.status, 10);
                if (taskStatusInt === 0) {
                    pendingTasksContainer.appendChild(taskCard);
                } else if (taskStatusInt === 1) {
                    inProgressTasksContainer.appendChild(taskCard);
                } else if (taskStatusInt === 2) {
                    completeTasksContainer.appendChild(taskCard);
                }
            }

            if (!maintenanceTasks || maintenanceTasks.length === 0) {
                pendingTasksContainer.innerHTML = '<p class="no-tasks-message">No pending tasks found.</p>';
                inProgressTasksContainer.innerHTML = '<p class="no-tasks-message">No in-progress tasks found.</p>';
                completeTasksContainer.innerHTML = '<p class="no-tasks-message">No completed tasks found.</p>';
            }

        } catch (error) {
            console.error('Error rendering tasks:', error);
            pendingTasksContainer.innerHTML = '<p class="error-message">Failed to load tasks</p>';
            inProgressTasksContainer.innerHTML = ''; 
            completeTasksContainer.innerHTML = ''; 
        }

        // Handle tab switching
        const tabs = document.querySelectorAll('input[name="tabs"]');
        tabs.forEach(tab => {
            tab.addEventListener('change', (event) => {
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.style.display = 'none';
                });
                document.getElementById(event.target.id.replace('Tab', '')).style.display = 'block';
            });
        });

        // Set initial tab display (ensure element exists before dispatching event)
        const initialCheckedTab = document.querySelector('input[name="tabs"]:checked');
        if (initialCheckedTab) {
            initialCheckedTab.dispatchEvent(new Event('change'));
        }
    }

    renderTasks();
});