document.addEventListener('DOMContentLoaded', () => {
    const pendingTasksContainer = document.querySelector('#pending .cards-container');
    const inProgressTasksContainer = document.querySelector('#progress .cards-container');
    const completeTasksContainer = document.querySelector('#complete .cards-container');

    // Sample data for maintenance tasks
    const maintenanceTasks = [
        {
            id: 'pipeLeak4',
            title: 'Pipe Leak - Zone 4',
            status: 'pending',
            location: 'Tank 4',
            reported: 'Apr 21, 2025, 10:00AM',
            priority: 'High',
            note: 'Bring your tools',
            assignedTo: [] // Personnel available for assignment
        },
        {
            id: 'valveCheck14',
            title: 'Valve Check - Zone 14',
            status: 'pending',
            location: 'Valve 8',
            reported: 'Apr 23, 2025, 7:00AM',
            priority: 'Low',
            note: 'Bring your tools',
            assignedTo: []
        },
        {
            id: 'pressureValveReplacement1',
            title: 'Pressure Valve Replacement - Zone 1',
            status: 'progress',
            location: 'Pipe 6',
            reported: 'Apr 25, 2025, 01:00PM',
            priority: 'High',
            note: 'Bring new pressure valve, size 92r',
            assignedTo: 'Mary Kenn'
        },
        {
            id: 'waterFiltering19',
            title: 'Water Filtering - Zone 19',
            status: 'progress',
            location: 'Tank D2',
            reported: 'Apr 28, 2025, 12:00PM',
            priority: 'Low',
            note: 'Bring filtering equipment',
            assignedTo: 'Joseph McKnight'
        },
        {
            id: 'pipeLeak8',
            title: 'Pipe Leak - Zone 8',
            status: 'complete',
            location: 'Tank 6',
            reported: 'Apr 20, 2025, 11:00AM',
            priority: 'High',
            note: 'Bring your tools',
            completedBy: 'Tom Little'
        },
        {
            id: 'valveCheck14Complete',
            title: 'Valve Check - Zone 14',
            status: 'complete',
            location: 'Tank D4',
            reported: 'Apr 21, 2025, 10:00AM',
            priority: 'Low',
            note: 'Bring your tools',
            completedBy: 'Tom Little'
        }
    ];

    // Sample data for available personnel for assignment
    const availablePersonnel = [
        'Albert Tim',
        'Tom Little',
        'Joseph McKnight',
        'Mary Kenn',
        'Moses Kine',
        'Emma Hosea',
        'Matt Kris',
        'John Bee'
    ];


    function generateTaskCard(task) {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add(task.priority === 'High' ? 'high-priority' : 'low-priority');
        cardDiv.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <div class="card-title">${task.title}</div>
                    <span class="card-status ${task.status}">${task.status.charAt(0).toUpperCase() + task.status.slice(1)}</span>
                </div>
                <div class="card-body">
                    <p> <a href="https://www.google.com/maps?q=Pipe+6" target="_blank" style="margin-left: 5px; color: #007bff;">
                        <i class="fa fa-map-marker-alt"></i> Location</a>: ${task.location}
                    </p>
                    <p> <i class="fa fa-clock"></i> Reported: ${task.reported}</p>
                    <p> <i class="fa fa-exclamation-circle"></i> Priority: ${task.priority} </p>
                    <p> <i class="fa fa-book"></i> Note: ${task.note} </p>
                    ${task.status === 'progress' ? `<p> <i class="fa fa-user"></i> Assigned To: ${task.assignedTo} </p>` : ''}
                    ${task.status === 'complete' ? `<p> <i class="fa fa-user"></i> Completed By: ${task.completedBy} </p>` : ''}
                    ${task.status === 'pending' ? `
                        <div class="card-footer">
                            <input type="checkbox" id="modal-toggle-${task.id}" hidden>
                            <label for="modal-toggle-${task.id}" class="btn btn-orange rounded-pill py-2 mt-2 me-2">Assign Task</label>
                            <div class="modal">
                                <div class="modal-content">
                                    <label for="modal-toggle-${task.id}" class="close">×</label>
                                    <h4>Available Personnel </h4>
                                    <div class="personnel-list">
                                        ${availablePersonnel.map(person => `
                                            <div class="person">
                                                <span>${person}</span>
                                                <label for="modal-toggle-${task.id}" class="notify-btn" data-task-id="${task.id}" data-person="${person}"> Assign </label>
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

    function renderTasks() {
        pendingTasksContainer.innerHTML = '';
        inProgressTasksContainer.innerHTML = '';
        completeTasksContainer.innerHTML = '';

        maintenanceTasks.forEach(task => {
            const taskCard = generateTaskCard(task);
            if (task.status === 'pending') {
                pendingTasksContainer.appendChild(taskCard);
            } else if (task.status === 'progress') {
                inProgressTasksContainer.appendChild(taskCard);
            } else if (task.status === 'complete') {
                completeTasksContainer.appendChild(taskCard);
            }
        });

        // Add event listeners to the "Notify" buttons
        document.querySelectorAll('.notify-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const taskId = event.target.dataset.taskId;
                const person = event.target.dataset.person;
                alert(`Notifying ${person} for task: ${maintenanceTasks.find(t => t.id === taskId)?.title}`);
                // In a real application, you would send this to a backend or update the task status
                // For demonstration, let's move the task to 'In Progress' and assign it
                const taskToUpdate = maintenanceTasks.find(t => t.id === taskId);
                if (taskToUpdate) {
                    taskToUpdate.status = 'progress';
                    taskToUpdate.assignedTo = person;
                    renderTasks(); // Re-render the tasks to reflect the change
                }
            });
        });

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

        // Set initial tab display
        document.querySelector('input[name="tabs"]:checked').dispatchEvent(new Event('change'));
    }

    renderTasks(); // Initial rendering of tasks

    

});