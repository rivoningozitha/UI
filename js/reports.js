document.addEventListener('DOMContentLoaded', () => {
    // Select the containers for each tab
    const allReportsContainer = document.querySelector('#allReports .cards-container');
    const userReportsContainer = document.querySelector('#userReports .cards-container');
    const systemReportsContainer = document.querySelector('#systemReports .cards-container');

    // Sample data for reports
    // This data will be dynamically populated into the cards.
    let reports = [
        {
            id: 'rep001',
            title: 'Monthly Water Quality Report - Zone 1',
            type: 'system', // 'user' or 'system'
            description: 'Automated report on water quality parameters for Zone 1. pH levels are slightly elevated.',
            reported: 'Jul 1, 2025, 08:00AM',
            priority: 'Medium', // Example: Medium priority
            status: 'Generated'
        },
        {
            id: 'rep002',
            title: 'User Feedback Summary - Q2 2025',
            type: 'user',
            description: 'Summary of user complaints and suggestions received in Q2 2025. Focus on billing issues.',
            reported: 'Jul 5, 2025, 09:30AM',
            priority: 'Low',
            status: 'Generated'
        },
        {
            id: 'rep003',
            title: 'Infrastructure Health Check - Pipe Network',
            type: 'system',
            description: 'Automated report on the structural integrity of the main pipe network. Minor corrosion detected in Section B.',
            reported: 'Jul 10, 2025, 11:00AM',
            priority: 'High',
            status: 'Generated'
        },
        {
            id: 'rep004',
            title: 'Customer Service Inquiry Volume',
            type: 'user',
            description: 'Analysis of inbound customer service inquiries for June 2025. High volume in billing category.',
            reported: 'Jul 12, 2025, 03:00PM',
            priority: 'Medium',
            status: 'Processed'
        },
        {
            id: 'rep005',
            title: 'Sensor Calibration Report - Station 5',
            type: 'system',
            description: 'Automated report on sensor calibration status at Pumping Station 5. All sensors within tolerance.',
            reported: 'Jul 14, 2025, 06:00AM',
            priority: 'Low',
            status: 'Completed'
        }
    ];

    /**
     * Generates the HTML for a single report card.
     * @param {Object} report - The report object containing details like title, type, description, etc.
     * @returns {HTMLElement} The created div element representing the report card.
     */
    function generateReportCard(report) {
        const cardDiv = document.createElement('div');
        // Add class based on priority for general styling (assuming style2.css handles these)
        if (report.priority === 'High') {
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
                </div>
            </div>
        `;
        return cardDiv;
    }

    /**
     * Renders reports into the appropriate containers based on the filter type.
     * @param {string} filterType - The type of reports to display ('all', 'user', 'system').
     */
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

        // Append filtered reports to the correct container
        filteredReports.forEach(report => {
            const reportCard = generateReportCard(report);
            if (filterType === 'all') {
                allReportsContainer.appendChild(reportCard);
            } else if (filterType === 'user' && report.type === 'user') {
                userReportsContainer.appendChild(reportCard);
            } else if (filterType === 'system' && report.type === 'system') {
                systemReportsContainer.appendChild(reportCard);
            }
        });

        // Ensure the correct tab content div is displayed and others are hidden
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

    // Initial rendering of reports when the page loads (defaults to 'All Reports')
    renderReports('all');
});