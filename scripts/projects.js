// projects.js

const projectsKey = 'project_management_projects';
let projects = JSON.parse(localStorage.getItem(projectsKey)) || [];

populateTeamMembers();

function loadProjectDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const index = urlParams.get('index');

    if (index !== null && projects[index]) {
        const project = projects[index];
        const projectDetails = document.getElementById('projectDetails');

        if (projectDetails) {
            const teamMembersDetails = project.team.map(member => {
                return `<li>${member.name}: ${member.hours} horas</li>`;
            }).join('');

            projectDetails.innerHTML = `
                <h2>${project.name}</h2>
                <p><strong>Team:</strong></p>
                <ul>${teamMembersDetails}</ul>
                <p><strong>Vacation Days:</strong> ${project.vacationDays}</p>
                <p><strong>Original Estimate:</strong> ${project.originalEstimate} days</p>
                <button class="btn btn-primary" onclick="editProject(${index})">Edit</button>
            `;
        }
    }
}

function editProject(index) {
    window.location.href = `edit_project.html?index=${index}`;
}

function addProject() {
    const projectName = document.getElementById('projectName').value.trim();
    const teamMembersContainer = document.getElementById('teamMembers');
    const teamMembers = Array.from(teamMembersContainer.querySelectorAll('input[type="checkbox"]:checked')).map(checkbox => {
        const hours = document.getElementById(`hours-${checkbox.value}`).value;
        return { name: checkbox.value, hours: hours };
    });
    const allocationHours = document.getElementById('allocationHours').value;
    const vacationDays = document.getElementById('vacationDays').value;
    const originalEstimate = document.getElementById('originalEstimate').value;

    if (projectName && teamMembers.length > 0 && allocationHours && vacationDays && originalEstimate) {
        const project = {
            name: projectName,
            team: teamMembers,
            allocationHours: allocationHours,
            vacationDays: vacationDays,
            originalEstimate: originalEstimate
        };

        projects.push(project);
        saveProjects();

        const successMessage = document.getElementById('successMessage');
        successMessage.textContent = `The Project ${projectName} has been successfully created!`;
        successMessage.style.display = 'block';

        document.getElementById('projectForm').reset();

        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 3000);
    } else {
        alert('Please fill in all fields.');
    }
}

function saveProjects() {
    localStorage.setItem(projectsKey, JSON.stringify(projects));
}

function loadProjects() {
    const storedProjects = localStorage.getItem(projectsKey);
    if (storedProjects) {
        projects = JSON.parse(storedProjects);
    }
}

function renderProjects() {
    const projectsList = document.getElementById('projects');
    projectsList.innerHTML = '';

    projects.forEach((project, index) => {
        const projectItem = document.createElement('li');
        projectItem.classList.add('list-group-item');
        projectItem.textContent = project.name;
        projectItem.addEventListener('click', () => {
            window.location.href = `project-details.html?index=${index}`;
        });
        projectsList.appendChild(projectItem);
    });
}

function renderGanttChart() {
    const chart = document.getElementById('chart');
    if (chart) {
        chart.innerHTML = '';
        projects.forEach((project, index) => {
            const ganttBar = document.createElement('div');
            ganttBar.className = 'gantt-bar';
            ganttBar.style.width = `${project.originalEstimate * 10}px`; // Adjust scale as needed
            const teamMembersNames = project.team.map(member => member.name).join(', ');
            ganttBar.textContent = `${project.name} (${teamMembersNames})`;
            chart.appendChild(ganttBar);
        });
    }
}

function deleteProject(index) {
    if (confirm("Are you sure you want to delete this project?")) {
        projects.splice(index, 1);
        saveProjects();
        renderProjects();
        renderGanttChart();
    }
}

// Initial call to render projects
renderProjects();

document.addEventListener('DOMContentLoaded', () => {
    loadProjects();
    renderProjects();
    // Load members and populate checkboxes
    loadMembers(); 
    populateTeamMembers(); 
});
