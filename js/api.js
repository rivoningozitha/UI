function createId() {
  return Math.floor(Math.random() * 2000000000);
}

//REGISTER
function register() {
  const registerBtn = document.querySelector("#regID");

  const firstName = document.querySelector("#firstName");
  const lastName = document.querySelector("#lastName");
  const username = document.querySelector("#username");
  const email = document.querySelector("#email");
  const contactNumber = document.querySelector("#phone");
  const password = document.querySelector("#password");

  const role = "Manager";
  const verified = false;
  const token = "";



  function addUser() {
    const userData = {
      Id: createId(),
      Username: username.value,
      Name: firstName.value,
      Surname: lastName.value,
      Email: email.value,
      ContactNumber: contactNumber.value,
      Role: role,
      PasswordHash: password.value,
      Verified: verified,
      Token: token,
    };

    console.log("User data being sent:", userData);

    fetch("https://localhost:7238/api/User/register", {
      method: "POST",
      body: JSON.stringify(userData),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          const errTxt = await response.text();
          throw new Error(
            `Registration failed: ${response.status} - ${errTxt}`
          );
        }

        let data;
        try {
          data = await response.json();
        } catch (e) {
          data = null;
        }

        console.log("User registered:", data);
        // alert("Registration successful!");

        window.location.href = "/login.html";
      })
      .catch((error) => {
        console.error("Error registering user:", error);
        alert("Registration failed.");
      });
  }

  registerBtn.addEventListener("click", function (e) {
    e.preventDefault();
    addUser();
  });
}

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

  const password = "default123"; // default placeholder
  const token = "";
  const verified = false;

  // Disable button and show loading state
  function setLoadingState(isLoading) {
    addEmployeeBtn.disabled = isLoading;

    if (typeof bootstrap !== 'undefined') {
      addEmployeeBtn.innerHTML = isLoading
        ? '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Adding...'
        : '<i class="fas fa-user-plus me-2"></i> Add Employee';
    } else {
      addEmployeeBtn.textContent = isLoading ? 'Adding Employee...' : 'Add Employee';
    }
  }

  async function sendEmployee() {
    setLoadingState(true);

    const userId = createId(); // generate ID
    const role = roleSelect.value;

    const employeeData = {
      UserId: userId,
      FirstName: firstName.value.trim(),
      LastName: lastName.value.trim(),
      Email: email.value.trim(),
      ContactNumber: contactNumber.value.trim(),
      Password: password,
      Verified: verified,
      Role: role,
      Token: token,
      Qualification: qualification.value.trim(),
      ExperienceYears: parseInt(experience.value.trim(), 10) || 0
    };

    // Add specializations if plumber
    if (role === 'Plumber') {
      const checkboxGroup = document.querySelectorAll('#specializationGroup input[type="checkbox"]:checked');

      const selectedSpecs = Array.from(checkboxGroup)
        .map(checkbox => checkbox.value);

      // Always include the key, even if nothing is selected
      employeeData.Specializations = selectedSpecs.length > 0
        ? selectedSpecs.join(", ")
        : "";

      console.log(selectedSpecs);
    }


    // if (role === "Plumber") {
    //   employeeData.SpecialistRoles = ["Special Role"]; // example placeholder
    // }

    console.log("Final employeeData payload:", JSON.stringify(employeeData, null, 2));
    try {
      const response = await fetch("https://localhost:7238/api/User/addnewemployee", {
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

document.addEventListener("DOMContentLoaded", addEmployee);

async function populateUserTable() {
  try {
    const response = await fetch("https://localhost:7238/Get-All-System-Users"); // Update if needed
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Failed: ${response.status} - ${errText}`);
    }

    const users = await response.json();
    const tbody = document.querySelector("#table_body");
    tbody.innerHTML = ""; // Clear previous rows

    users.forEach(user => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${user.name} ${user.surname}</td>
        <td>${user.email}</td>
        <td>${user.role}</td>
        <td>${user.contactNumber}</td>
        <td>
          <button class="btn btn-sm btn-primary me-1" onclick="editUser('${user.id}')">
            <i class="fas fa-edit"></i>
          </button>
          <!-- <button class="btn btn-sm btn-danger" onclick="deleteUser('${user.id}')">
            <i class="fas fa-trash-alt"></i>
          </button> -->
        </td>
      `;

      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error("Error populating user table:", error);
  }
}

// Fetch and render when page loads
document.addEventListener("DOMContentLoaded", populateUserTable);

// LOGIN
function loginUser() {
  const loginBtn = document.querySelector("#loginBtn");
  const emailInput = document.querySelector("#loginUsername");
  const passwordInput = document.querySelector("#loginPassword");

  loginBtn.addEventListener("click", function (e) {
    e.preventDefault();

    //   const  email = emailInput.value;
    //    const passwordHash = passwordInput.value;

    console.log("Email:", emailInput.value);
    console.log("Password:", passwordInput.value);

    const url = `https://localhost:7238/api/User/login`;

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: emailInput.value,
        password: passwordInput.value,
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errTxt = await response.text();
          throw new Error(`Login failed: ${response.status} - ${errTxt}`);
        }

        const result = await response.json();
        console.log("Login successful", result);
        if (result.role === "Supervisor") {
          window.location.href = "dashboard.html";
        } else if (result.role === "Plumber") {
          window.location.href = "dashboard.html";
        } else if (result.role === "Manager") {
          window.location.href = "dashboard.html";
        } else {
          alert("Unknown role: " + result.role);
          window.location.href = "dashboard.html";
        }
      })
      .catch((error) => {
        console.error("Error loggin in user:", error);
        alert("Login failed.");
      });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  if (document.querySelector("#regID")) {
    register();
  }

  if (document.querySelector("#loginBtn")) {
    loginUser();
  }
});

// ADDING ASSETS

function addSensor() {
  document
    .getElementById("authForm")
    .addEventListener("submit", async function (e) {
      e.preventDefault(); // Prevent form reload

      const Sensor = {
        SensorName: document.getElementById("SensorName").value.trim(),
        Location: document.getElementById("location").value.trim(),
        ID: document.getElementById("ID").value.trim(),
        Status: document.getElementById("status").value.trim(),
        type: document.getElementById("type").value.trim(),
        Battery: document.getElementById("battery").value.trim(),
      };
      console.log(Sensor);
      try {
        const response = await fetch("https://localhost:7238/api/Sensor", {
          method: "POST",
          body: JSON.stringify(Sensor),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Registration failed: ${response.status}`);
        }

        const result = await response.json();
        console.log("Registration success:", result);
      } catch (error) {
        console.error("Error registering user:", error);
      }
    });
}

// TANKS

function addTank() {
  document
    .getElementById("addTankForm")
    .addEventListener("submit", async function (e) {
      e.preventDefault(); // Prevent form reload

      function createId() {
        return Math.floor(Math.random() * 2000000000);
      }

      const Tank = {
        Id: createId(),
        Name: document.getElementById("tankName").value.trim(),
        OperationalStatus: document.getElementById("tankStatus").value.trim(),
        Capacity: parseFloat(
          document.getElementById("tankCapacity").value.trim()
        ),
        WaterLevel: parseFloat(
          document.getElementById("tankLevel").value.trim()
        ),
        AreaId: parseInt(document.getElementById("tankArea").value.trim()),
      };

      console.log(Tank);
      try {
        const response = await fetch(
          "https://localhost:7238/api/Tank/addnewtank",
          {
            method: "POST",
            body: JSON.stringify(Tank),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Addition failed: ${response.status}`);
        }

        const result = await response.json();
        console.log("Addition success:", result);
      } catch (error) {
        console.error("Error adding tank:", error);
      }
    });
}

document.addEventListener("DOMContentLoaded", function () {
  if (document.querySelector("#addTankBtn")) {
    addTank();
  }
});

// PIPES

function addPipe() {
  document
    .getElementById("authForm")
    .addEventListener("submit", async function (e) {
      e.preventDefault(); // Prevent form reload

      const Pieps = {
        PipeName: document.getElementById("PipeName").value.trim(),
        Location: document.getElementById("location").value.trim(),
        ID: document.getElementById("ID").value.trim(),
        Status: document.getElementById("status").value.trim(),
        Diameter: document.getElementById("Diameter").value.trim(),
        lenght: document.getElementById("length").value.trim(),
        FlowRate: document.getElementById("flowrate").value.trim(),
        PressureLevel: document.getElementById("pressurelevel").value.trim(),
      };
      console.log(Pipes);
      try {
        const response = await fetch("https://localhost:7238/api/pipes", {
          method: "POST",
          body: JSON.stringify(Pipes),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Registration failed: ${response.status}`);
        }

        const result = await response.json();
        console.log("Registration success:", result);
      } catch (error) {
        console.error("Error registering user:", error);
      }
    });
}