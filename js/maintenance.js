import { getUserRole, fetchData } from './common.js';  //importing some functionality

document.addEventListener('DOMContentLoaded', () => {
    const userRole = getUserRole();
    //Check for the existence of a valid login session
    if (userRole == null) {
        window.location.href = 'login.html';
    } else if (userRole !== 'manager' && userRole !== 'supervisor' && userRole !== 'plumber') {
        window.location.href = 'dashboard.html';
    }

    const pendingTasksContainer = document.querySelector('#pending .cards-container');
    const inProgressTasksContainer = document.querySelector('#progress .cards-container');
    const completeTasksContainer = document.querySelector('#complete .cards-container');

    // Map the status value for each task
    const statusMap = {
        0: { name: 'Pending', class: 'pending' },
        1: { name: 'In Progress', class: 'progress' },
        2: { name: 'Complete', class: 'complete' },
        3: { name: 'In Progress', class: 'progress' }   // An assigned task i treated as in-progress
    };

    // const priorityMap = {
    //     0: { name: 'Informational', class: 'low' },
    //     1: { name: 'Low', class: 'low' },
    //     2: { name: 'Medium', class: 'medium' },
    //     3: { name: 'High', class: 'high' },
    //     4: { name: 'Critical', class: 'critical' }
    // };

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
    // async function fetchData(url) {
    //     try {
    //         const response = await fetch(url);
    //             if (!response.ok) {
    //             const errorBody = await response.text(); // Get error message from response body
    //             throw new Error(`HTTP error! status: ${response.status}. Message: ${errorBody || 'No specific error message.'}`);
    //         }
    //         return await response.json();
    //     } catch (error) {
    //         console.error('Error fetching data:', error);
    //         return null;
    //     }
    // }
    
    /* Function to generate a task card for the Manager */
    async function generateTaskCard(task, availablePersonnel) {
        console.log("Task data for card generation:", task); // Debug log

        const taskStatusInt = parseInt(task.status, 10);
        let currentStatus;
        let showAssignButton = false;

        // Logic to determine the displayed status and assign button visibility
        if (task.assignedPlumberId == null) {
            // If no plumber is assigned, treat it as 'Pending' for display purposes
            // and show the assign button.
            currentStatus = { name: 'Pending', class: 'pending' };
            showAssignButton = true;
            console.log(`Task ${task.id}: assignedPlumberId is null. Displaying as Pending.`); // Debug
        } else {
            // If a plumber is assigned, use the actual status from the API
            currentStatus = statusMap[taskStatusInt] || { name: 'Unknown', class: 'unknown' };
            showAssignButton = false; // Hide assign button if already assigned
            console.log(`Task ${task.id}: assignedPlumberId is not null. Displaying as ${currentStatus.name}.`); // Debug
        }

        const reportId = task.reportId;

        // Retrieve report related to the task
        const report = await fetchData(`https://wisapi-latest.onrender.com/api/Reports/${reportId}`);

        // Initialize with default values
        let reportPriority = 0;
        let reportDescription = 'N/A';
        let priorityName = 'Low';

        // Check if report data was successfully fetched and assign values
        if (report) {
            reportPriority = report.priorityLevel;
            reportDescription = report.description;
        }

        const cardDiv = document.createElement('div');

        if (reportPriority === 4) {
            priorityName = 'Critical';
            cardDiv.classList.add('critical-priority');
        } else if (reportPriority === 3) {
            priorityName = 'High';
            cardDiv.classList.add('high-priority');
        } else if (reportPriority === 2) {
            priorityName = 'Medium';
            cardDiv.classList.add('medium-priority');
        } else if (reportPriority === 1) {
            priorityName = 'Low';
            cardDiv.classList.add('low-priority');
        } else if (reportPriority === 0) {
            priorityName = 'Informational';
            cardDiv.classList.add('low-priority');
        } else {
            priorityName = 'Low';
            cardDiv.classList.add('low-priority');
        }

        cardDiv.innerHTML = `
        <div class="card">
            <div class="card-header">
                <div class="card-title">${task.title || 'N/A'}</div>
                <span class="card-status ${currentStatus.class}">${currentStatus.name}</span>
            </div>
            <div class="card-body">
                <p> <i class="fa fa-clock"></i> Reported: ${formatDateTime(task.generatedAt)}</p>
                <p> <i class="fa fa-exclamation-circle"></i> Priority: ${priorityName} </p>
                <p> <i class="fa fa-book"></i> Note: ${reportDescription} </p>
                ${(taskStatusInt === 1 || taskStatusInt === 3) && task.assignedPlumberId !== null ? `<p> <i class="fa fa-user"></i> Assigned To: ${task.assignedTo || 'N/A'} </p>` : ''}
                ${taskStatusInt === 2 ? `<p> <i class="fa fa-user"></i> Completed By: ${task.completedBy || 'N/A'} </p>` : ''}

                ${showAssignButton ? `
                    <div class="card-footer">
                        <input type="checkbox" id="modal-toggle-${task.id}" class="modal-toggle" hidden>
                        <label for="modal-toggle-${task.id}" class="btn btn-orange rounded-pill py-2 mt-2 me-2 assign-task-btn">Assign Task</label>
                        <div class="modal">
                            <div class="modal-content">
                                <label for="modal-toggle-${task.id}" class="close">×</label>
                                <h4>Available Personnel</h4>
                                <div class="personnel-list">
                                    ${(availablePersonnel || []).map(person => `
                                        <div class="person">
                                            <span>${person.fullname}</span>
                                            <button class="notify-btn" 
                                            data-task-id="${task.id}" 
                                            data-person-id="${person.id}" 
                                            data-person-fullname="${person.fullname}"
                                            >Assign Task</button>
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
    document.addEventListener('click', async function (event) {
        // Handle assign task button clicks inside the modal
        if (event.target.matches('.notify-btn')) {
            const taskId = event.target.dataset.taskId;
            const personId = event.target.dataset.personId;
            const assignedPersonFullName = event.target.dataset.personFullname;

            console.log(`Attempting to assign task ${taskId} to ${personId}`); // Debugging log

            try {
                const response = await fetch(`https://wisapi-latest.onrender.com/api/MaintenanceTask/${taskId}/${personId}/assignment`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
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
                //const assignedPersonFullName = await fetchFullName(personId);
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
            const maintenanceTasks = await fetchData('https://wisapi-latest.onrender.com/api/MaintenanceTask/Get-All-Tasks');
            const personnelData = await fetchData('https://wisapi-latest.onrender.com/api/User/Plumbers/ByAvailability/true');

            console.log("Available Plumbers: ", personnelData); //Debug log

            // Create personnel array with IDs and names
            const availablePersonnel = [];
            if (personnelData && personnelData.length > 0) {
                for (const personnel of personnelData) {
                    let id = personnel.plumberId;
                    console.log("Personnel: ", personnel);
                    //console.log("Personnel Id", id); // Debug
                    let fullname = personnel.name + ' ' + personnel.surname;   // This portion of code does no work because the returned json object is shaky
                    availablePersonnel.push({ id, fullname });
                }
            }


            pendingTasksContainer.innerHTML = '';
            inProgressTasksContainer.innerHTML = '';
            completeTasksContainer.innerHTML = '';

            for (const task of maintenanceTasks || []) {
                const taskCard = await generateTaskCard(task, availablePersonnel || []);
                const taskStatusInt = parseInt(task.status, 10);

                // Primary logic: If no plumber is assigned, it's pending assignment.
                if (task.assignedPlumberId == null) {
                    pendingTasksContainer.appendChild(taskCard);
                    console.log(`Task ${task.id} (status ${taskStatusInt}): No plumber assigned, placed in Pending.`); // Debug
                } else if (taskStatusInt === 1 || taskStatusInt === 3) {
                    // If a plumber is assigned AND status is 1 or 3, it's In Progress.
                    inProgressTasksContainer.appendChild(taskCard);
                    console.log(`Task ${task.id} (status ${taskStatusInt}): Plumber assigned, placed in In Progress.`); // Debug
                } else if (taskStatusInt === 2) {
                    // If a plumber is assigned AND status is 2, it's Complete.
                    completeTasksContainer.appendChild(taskCard);
                    console.log(`Task ${task.id} (status ${taskStatusInt}): Plumber assigned, placed in Complete.`); // Debug
                }
                // Any other status or unhandled combination would not be displayed,
                // but with the current logic, all tasks should fall into one of these.
            }

            if (!maintenanceTasks || maintenanceTasks.length === 0) {
                pendingTasksContainer.innerHTML = '<p class="no-tasks-message">No pending tasks found.</p>';
                inProgressTasksContainer.innerHTML = '<p class="no-tasks-message">No in-progress tasks found.</p>';
                completeTasksContainer.innerHTML = '<p class="no-tasks-message">No completed tasks found.</p>';
            }

        } catch (error) {
            console.error('Error rendering tasks:', error);
            pendingTasksContainer.innerHTML = '<p class="error-message">Failed to load tasks</p>';
            inProgressTasksContainer.innerHTML = '<p class="error-message">Failed to load tasks</p>';
            completeTasksContainer.innerHTML = '<p class="error-message">Failed to load tasks</p>';
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