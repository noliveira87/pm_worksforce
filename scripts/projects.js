const projectsKey = 'project_management_projects';
let projects = JSON.parse(localStorage.getItem(projectsKey)) || [];

document.addEventListener('DOMContentLoaded', () => {
    loadProjects();
    loadMembers(); 
});

function loadMembers() {
    const storedMembers = localStorage.getItem(membersKey);
    if (storedMembers) {
        members = JSON.parse(storedMembers);
        populateTeamMembers(); // Popula os membros da equipe após o carregamento
    }
}

function populateTeamMembers() {
    const teamMembersContainer = document.getElementById('teamMembers');
    if (teamMembersContainer) {
        teamMembersContainer.innerHTML = '';

        members.forEach(member => {
            const memberDiv = document.createElement('div');
            memberDiv.classList.add('form-check');

            const memberCheckbox = document.createElement('input');
            memberCheckbox.type = 'checkbox';
            memberCheckbox.classList.add('form-check-input');
            memberCheckbox.id = `member-${member.name}`;
            memberCheckbox.value = member.name;

            const memberLabel = document.createElement('label');
            memberLabel.classList.add('form-check-label');
            memberLabel.htmlFor = `member-${member.name}`;
            memberLabel.textContent = member.name;

            const memberHoursInput = document.createElement('input');
            memberHoursInput.type = 'number';
            memberHoursInput.classList.add('form-control');
            memberHoursInput.id = `hours-${member.name}`;
            memberHoursInput.placeholder = 'Horas alocadas';
            memberHoursInput.style.marginLeft = '10px';

            memberDiv.appendChild(memberCheckbox);
            memberDiv.appendChild(memberLabel);
            memberDiv.appendChild(memberHoursInput);
            teamMembersContainer.appendChild(memberDiv);
        });
    }
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

        renderProjects(); // Render projects after adding
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
        renderProjects(); // Render projects after loading
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
