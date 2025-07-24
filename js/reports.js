document.addEventListener('DOMContentLoaded', () => {
    const allReportsContainer = document.querySelector('#allReports .cards-container');
    const userReportsContainer = document.querySelector('#userReports .cards-container');
    const systemReportsContainer = document.querySelector('#systemReports .cards-container');

    let reports = [];

    // Search for the report that matches the report id
    function getReportTitleById(reportIdToMatch) {
        const foundReport = reports.find(report => report.id === reportIdToMatch);

        if (foundReport) {
            return foundReport.title;
        } else {
            return null;
        }
    }

    // Define mappings for enums based on the provided API specification
    const reportTypeMap = {
        0: 'system',
        1: 'user'
    };

    const statusMap = {
        0: 'Open',
        1: 'InProgress',
        2: 'Closed',
        3: 'Assigned'
    };

    const priorityLevelMap = {
        0: 'Informational',
        1: 'Low',
        2: 'Medium',
        3: 'High',
        4: 'Critical'
    };

    async function fetchReportsFromApi() {
        try {
            const response = await fetch('http://localhost:5125/api/Reports/Get-All-Reports');
            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`HTTP error! Status: ${response.status}. Message: ${errorBody || 'No specific error message.'}`);
            }
            const rawData = await response.json();

            const transformedReports = rawData.map(item => ({
                id: item.id,
                title: item.summary,
                type: reportTypeMap[item.reportType],
                description: item.description,
                reported: new Date(item.timeLogged).toLocaleString(), // Use toLocaleString for display
                rawTimeLogged: item.timeLogged, // Keep the raw timeLogged for dueDate calculation
                picture: item.picture,
                status: statusMap[item.status],
                priority: priorityLevelMap[item.priorityLevel]
            }));

            return transformedReports;

        } catch (error) {
            console.error("Error fetching reports from API:", error);
            return [];
        }
    }

    async function createTaskFromReport(reportId, title, dueDate, authorityId) {
        try {
            const response = await fetch(`http://localhost:5125/api/Reports/${reportId}/Report-To-Task`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    Title: title,
                    DueDate: dueDate,
                    AuthorityId: authorityId
                })
            });

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`Failed to create task! Status: ${response.status}. Message: ${errorBody || 'No specific error message.'}`);
            }

            const newTask = await response.json();
            alert(`Task created successfully for Report ID ${reportId}: ${newTask.title}`);
        } catch (error) {
            console.error("Error creating task:", error);
            alert(`Error creating task: ${error.message}`);
        }
    }

    //generate a report card
    function generateReportCard(report) {
        const cardDiv = document.createElement('div');
        if (report.priority === 'High' || report.priority === 'Critical') {
            cardDiv.classList.add('high-priority');
        } else if (report.priority === 'Medium') {
            cardDiv.classList.add('medium-priority');

        } else {
            cardDiv.classList.add('low-priority');
        }

        cardDiv.innerHTML = `
            <div class="card">
                <div class="card-header" ${report.priority === 'Medium' ? '"' : ''}>
                    <div class="card-title">${report.title}</div>
                    <span class="card-status ${report.status.toLowerCase().replace(' ', '-')}">${report.status}</span>
                </div>
                <div class="card-body">
                    <p> <i class="fa fa-info-circle"></i> Type: ${report.type.charAt(0).toUpperCase() + report.type.slice(1)} Report</p>
                    <p> <i class="fa fa-file-alt"></i> Description: ${report.description}</p>
                    <p> <i class="fa fa-clock"></i> Reported: ${report.reported}</p>
                    <p> <i class="fa fa-exclamation-circle"></i> Priority: ${report.priority} </p>
                    <div class="card-footer">
                            <button class="btn btn-orange rounded-pill py-2 mt-2 me-2 generate-task-btn" data-report-id="${report.id}" data-report-time-logged="${report.rawTimeLogged}">Generate Task</button>
                    </div>
                </div>
            </div>
        `;

        // Add event listener to the "Generate Task" button
        const generateTaskButton = cardDiv.querySelector('.generate-task-btn');
        generateTaskButton.addEventListener('click', () => {
            const reportId = parseInt(generateTaskButton.dataset.reportId);
            const reportTimeLogged = generateTaskButton.dataset.reportTimeLogged;

            const title = getReportTitleById(reportId);
            if (!title) return;

            // Auto-calculate dueDate 3 days from reportTimeLogged
            const reportDate = new Date(reportTimeLogged);
            const dueDate = new Date(reportDate.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(); // Format as ISO string

            const authorityId = 4;
            if (!authorityId || isNaN(parseInt(authorityId))) {
                alert("Invalid Authority ID. Please enter a number.");
                return;
            }

            createTaskFromReport(reportId, title, dueDate, parseInt(authorityId));
        });

        return cardDiv;
    }

    function renderReports(filterType = 'all') {
        // Clear existing content in all containers
        allReportsContainer.innerHTML = '';
        userReportsContainer.innerHTML = '';
        systemReportsContainer.innerHTML = '';

        // Filter reports based on the selected tab
        const filteredReports = reports.filter(report => {
            if (filterType === 'all') {
                return true;
            } else {
                return report.type === filterType;
            }
        });

        const containerToRender = (filterType === 'all') ? allReportsContainer :
            (filterType === 'user') ? userReportsContainer :
                systemReportsContainer;

        if (filteredReports.length === 0) {
            containerToRender.innerHTML = '<p class="no-reports-message">No reports to display for this category.</p>';
            return;
        }

        filteredReports.forEach(report => {
            const reportCard = generateReportCard(report);
            containerToRender.appendChild(reportCard);
        });

        document.querySelectorAll('.tab-content').forEach(content => {
            content.style.display = 'none';
        });
        document.getElementById(filterType + 'Reports').style.display = 'block';
    }

    // Event listeners for tab switching (radio buttons)
    const tabs = document.querySelectorAll('input[name="tabs"]');
    tabs.forEach(tab => {
        tab.addEventListener('change', (event) => {
            const selectedTabId = event.target.id;
            if (selectedTabId === 'allReportsTab') {
                renderReports('all');
            } else if (selectedTabId === 'userReportsTab') {
                renderReports('user');
            } else if (selectedTabId === 'systemReportsTab') {
                renderReports('system');
            }
        });
    });

    // Initial data load and rendering when the page loads
    async function initializeReports() {
        // Display a loading message while fetching
        allReportsContainer.innerHTML = '<p class="loading-message">Loading reports...</p>';
        userReportsContainer.innerHTML = '<p class="loading-message">Loading reports...</p>';
        systemReportsContainer.innerHTML = '<p class="loading-message">Loading reports...</p>';

        reports = await fetchReportsFromApi();

        renderReports('all');
    }

    initializeReports();
});