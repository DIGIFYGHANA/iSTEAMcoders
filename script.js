function showMessage() {
    alert("Admissions are open! Visit admissions page.");
}


// PAGE LOAD
document.addEventListener("DOMContentLoaded", function () {
    loadStudents();
    loadDashboard();
    protectDashboard();

    // Admissions form
    let admissionForm = document.getElementById("admissionForm");

    if (admissionForm) {
        admissionForm.addEventListener("submit", function (event) {
            event.preventDefault();

            let name = document.getElementById("name").value;
            let age = document.getElementById("age").value;
            let studentClass = document.getElementById("class").value;
            let message = document.getElementById("message");

            if (name === "" || age === "" || studentClass === "") {
                message.style.color = "red";
                message.innerText = "Please fill all fields!";
                return;
            }

            let student = {
                name: name,
                age: age,
                class: studentClass
            };

            // SEND TO BACKEND
            fetch("http://localhost:3000/students", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(student)
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);

                message.style.color = "green";
                message.innerText = "Application submitted successfully!";

                admissionForm.reset();

                loadStudents();
                loadDashboard();
            });
        });
    }


    // Login form
    let loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            let username = document.getElementById("username").value;
            let password = document.getElementById("password").value;
            let loginMessage = document.getElementById("loginMessage");

            if (username === "admin" && password === "1234") {
                sessionStorage.setItem("loggedIn", "true");
                window.location.href = "dashboard.html";
            } else {
                loginMessage.style.color = "red";
                loginMessage.innerText = "Invalid login credentials!";
            }
        });
    }
});


// Protect dashboard
function protectDashboard() {
    if (window.location.pathname.includes("dashboard.html")) {
        let loggedIn = sessionStorage.getItem("loggedIn");

        if (loggedIn !== "true") {
            window.location.href = "login.html";
        }
    }
}


// Logout
function logout() {
    sessionStorage.removeItem("loggedIn");
    window.location.href = "login.html";
}


// Load students from backend
function loadStudents() {
    let studentList = document.getElementById("studentList");

    if (!studentList) return;

    fetch("http://localhost:3000/students")
        .then(response => response.json())
        .then(students => {
            studentList.innerHTML = "";

            students.forEach((student, index) => {
                let li = document.createElement("li");

                li.innerHTML = `
                    ${student.name} - Age: ${student.age} - ${student.class}
                `;

                studentList.appendChild(li);
            });
        });
}


// Dashboard
function loadDashboard() {
    let tableBody = document.getElementById("tableBody");
    let totalStudents = document.getElementById("totalStudents");

    if (!tableBody) return;

    fetch("http://localhost:3000/students")
        .then(response => response.json())
        .then(students => {
            tableBody.innerHTML = "";

            if (totalStudents) {
                totalStudents.innerText = students.length;
            }

            students.forEach(student => {
                let row = `
                    <tr>
                        <td>${student.name}</td>
                        <td>${student.age}</td>
                        <td>${student.class}</td>
                    </tr>
                `;

                tableBody.innerHTML += row;
            });
        });
}


// Search student
function searchStudent() {
    let input = document.getElementById("searchInput").value.toLowerCase();
    let rows = document.querySelectorAll("#tableBody tr");

    rows.forEach(row => {
        let name = row.cells[0].innerText.toLowerCase();

        row.style.display = name.includes(input) ? "" : "none";
    });
}


// Clear all frontend table only
function clearAllStudents() {
    let tableBody = document.getElementById("tableBody");

    if (tableBody) {
        tableBody.innerHTML = "";
    }
}