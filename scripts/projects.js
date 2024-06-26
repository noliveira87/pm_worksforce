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

document.addEventListener('DOMContentLoaded', () => {
    loadProjectDetails(); // Carrega os detalhes do projeto ao carregar a página
});

function loadProjectDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const index = urlParams.get('index');

    if (index !== null && projects[index]) {
        const project = projects[index];

        // Preenche os campos do formulário com os detalhes do projeto
        document.getElementById('editProjectName').value = project.name;
        document.getElementById('editAllocationHours').value = project.allocationHours;
        document.getElementById('editVacationDays').value = project.vacationDays;
        document.getElementById('editOriginalEstimate').value = project.originalEstimate;

        // Preenche as opções do menu suspenso com os membros da equipe
        const selectElement = document.getElementById('editTeamMembers');
        selectElement.innerHTML = '';
        members.forEach(member => {
            const option = document.createElement('option');
            option.value = member.name;
            option.textContent = member.name;
            // Se o membro estiver na equipe do projeto, selecione-o
            if (project.team.some(teamMember => teamMember.name === member.name)) {
                option.selected = true;
            }
            selectElement.appendChild(option);
        });
    }
}

function saveEditedProject() {
    // Aqui você pode implementar a lógica para salvar as alterações do projeto
    // Recupere os valores dos campos do formulário
    const editedProjectName = document.getElementById('editProjectName').value;
    const editedAllocationHours = document.getElementById('editAllocationHours').value;
    const editedVacationDays = document.getElementById('editVacationDays').value;
    const editedOriginalEstimate = document.getElementById('editOriginalEstimate').value;
    const selectedMembers = Array.from(document.getElementById('editTeamMembers').selectedOptions).map(option => option.value);

    // Use o índice da URL para acessar o projeto no array projects
    const urlParams = new URLSearchParams(window.location.search);
    const index = urlParams.get('index');
    if (index !== null && projects[index]) {
        // Atualize os detalhes do projeto no array projects
        projects[index].name = editedProjectName;
        projects[index].allocationHours = editedAllocationHours;
        projects[index].vacationDays = editedVacationDays;
        projects[index].originalEstimate = editedOriginalEstimate;
        // Atualize os membros da equipe do projeto
        projects[index].team = selectedMembers.map(member => ({ name: member, hours: 0 }));
        // Salve as alterações
        saveProjects();
        // Redirecione de volta para a página de detalhes do projeto
        window.location.href = `project_details.html?index=${index}`;
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

function editProject(index) {
    // Redireciona para a página de edição do projeto com o índice do projeto na URL
    window.location.href = `edit_project.html?index=${index}`;
}

function deleteProject(index) {
    if (confirm("Tem certeza de que deseja excluir este projeto?")) {
        projects.splice(index, 1);
        saveProjects(); // Salva o array atualizado no armazenamento local
        renderProjects(); // Renderiza novamente a lista de projetos
    }
}

function renderProjects() {
    const projectsList = document.getElementById('projects');
    projectsList.innerHTML = '';

    projects.forEach((project, index) => {
        const projectItem = document.createElement('li');
        projectItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');

        const projectNameSpan = document.createElement('span');
        projectNameSpan.textContent = project.name;
        projectItem.appendChild(projectNameSpan);

        // Adiciona botões de "Editar" e "Apagar" para cada projeto na lista
        const buttonGroup = document.createElement('div');
        buttonGroup.classList.add('btn-group');

        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.className = 'btn btn-info btn-sm';
        editButton.onclick = function() {
            editProject(index);
        };

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Apagar';
        deleteButton.className = 'btn btn-danger btn-sm';
        deleteButton.onclick = function() {
            deleteProject(index);
        };

        buttonGroup.appendChild(editButton);
        buttonGroup.appendChild(deleteButton);

        projectItem.appendChild(buttonGroup);

        projectsList.appendChild(projectItem);
    });
}
