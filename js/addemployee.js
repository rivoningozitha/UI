
document.addEventListener('DOMContentLoaded', function () {
    const roleSelect = document.getElementById('role');
    const specializationGroup = document.getElementById('specializationGroup');

    roleSelect.addEventListener('change', function () {
        if (this.value === 'Plumber') {
            specializationGroup.style.display = 'block';
        } else {
            specializationGroup.style.display = 'none';
            specializationGroup.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
        }
    });

    const toggleBtn = document.getElementById('modeToggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
        });
    }

    // Call the addEmployee function to initialize event listeners and functionality
    addEmployee(); //
});


function addEmployee() {
    const employeeForm = document.querySelector("#employeeForm");
    const addEmployeeBtn = document.querySelector("#addEmployeeBtn");

    const firstName = document.querySelector("#firstName");
    const lastName = document.querySelector("#lastName");
    const email = document.querySelector("#email");
    const contactNumber = document.querySelector("#phone");
    const roleSelect = document.querySelector("#role");
    const qualification = document.querySelector("#qualification");
    const experience = document.querySelector("#experience");

    const password = "12345"; // default placeholder
    const token = "";
    const verified = false;

    // Disable button and show loading state
    function setLoadingState(isLoading) {
        addEmployeeBtn.disabled = isLoading;

        if (typeof bootstrap !== 'undefined') {
            addEmployeeBtn.innerHTML = isLoading
                ? '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Adding...'
                : 'Add Employee'; // Removed icon from button as it wasn't present in HTML button
        } else {
            addEmployeeBtn.textContent = isLoading ? 'Adding Employee...' : 'Add Employee';
        }
    }

    async function sendEmployee() {
        setLoadingState(true);

        const role = roleSelect.value;

        const employeeData = {
            FirstName: firstName.value.trim(),
            LastName: lastName.value.trim(),
            Email: email.value.trim(),
            Username: email.value.trim(),
            ContactNumber: contactNumber.value.trim(),
            Password: password,
            Verified: verified,
            Role: role,
            Token: token,
            Qualification: qualification.value.trim(),
            ExperienceYears: parseInt(experience.value.trim(), 10) || 0,
            Specialization: ""
        };

        // Add specializations if plumber
        if (role === 'Plumber') {
            const checkboxGroup = document.querySelectorAll('#specializationGroup input[type="checkbox"]:checked');

            const selectedSpecs = Array.from(checkboxGroup)
                .map(checkbox => checkbox.value);

            // Always include the key, even if nothing is selected
            employeeData.Specialization = selectedSpecs.length > 0
                ? selectedSpecs.join(", ")
                : "";

            console.log(selectedSpecs);
        }


        console.log("Final employeeData payload:", JSON.stringify(employeeData, null, 2));
        try {
            const response = await fetch("http://localhost:5125/api/User/addnewemployee", {
                method: "POST",
                body: JSON.stringify(employeeData),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                const errTxt = await response.text();
                throw new Error(`Employee creation failed: ${response.status} - ${errTxt}`);
            }

            const data = await response.json();
            console.log("Employee added:", data);
            alert("Employee added successfully!");
            employeeForm.reset();
        } catch (error) {
            console.error("Error adding employee:", error);
            alert("Employee creation failed: " + error.message);
        } finally {
            setLoadingState(false);
        }
    }

    employeeForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        await sendEmployee();
    });
}