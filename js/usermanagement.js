function createId() {
  return Math.floor(Math.random() * 2000000000);
}

// Dynamic User Table Population
document.addEventListener('DOMContentLoaded', () => {
  const userTableBody = document.getElementById('userTableBody');
  if (!userTableBody) return;

  async function fetchAndPopulateUsers() {
    try {
      const response = await fetch('http://localhost:5125/api/User/Get-All-System-Users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to fetch users:', response.status, response.statusText, errorText);
        userTableBody.innerHTML = `<tr><td colspan="5" class="text-center text-danger">Error loading users: ${response.statusText || 'Network error'}</td></tr>`;
        return;
      }

      const users = await response.json();
      populateTableRows(users);

    } catch (error) {
      console.error('Error fetching users:', error);
      userTableBody.innerHTML = `<tr><td colspan="5" class="text-center text-danger">Could not connect to the API.</td></tr>`;
    }
  }

  function populateTableRows(users) {
    userTableBody.innerHTML = '';

    if (!users || users.length === 0) {
      userTableBody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">No users found.</td></tr>`;
      return;
    }

    users.forEach(user => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${user.name + ' ' + user.surname || 'N/A'}</td>
        <td>${user.email || 'N/A'}</td>
        <td>${user.role || 'N/A'}</td>
        <td>${user.contactNumber || 'N/A'}</td>
        <td>
          <button class="btn btn-sm btn-info me-2 edit-btn" data-id="${user.id || ''}">
            <i class="fas fa-edit"></i> Edit
          </button>
          <button class="btn btn-sm btn-danger delete-btn" data-id="${user.id || ''}">
            <i class="fas fa-trash-alt"></i> Delete
          </button>
        </td>
      `;
      userTableBody.appendChild(row);
    });

    // Add event listeners
    userTableBody.querySelectorAll('.edit-btn').forEach(button => {
      button.addEventListener('click', (event) => {
        const userId = event.currentTarget.dataset.id;
        alert(`Edit user with ID: ${userId}`);
      });
    });

    userTableBody.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', (event) => {
        const userId = event.currentTarget.dataset.id;
        if (confirm(`Are you sure you want to delete user with ID: ${userId}?`)) {
          alert(`Deleting user with ID: ${userId}`);
          event.currentTarget.closest('tr').remove();
        }
      });
    });
  }

  fetchAndPopulateUsers();
});

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
