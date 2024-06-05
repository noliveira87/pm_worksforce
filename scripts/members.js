const membersKey = 'project_management_members';
let members = [];

function loadMembers() {
    const storedMembers = localStorage.getItem(membersKey);
    if (storedMembers) {
        members = JSON.parse(storedMembers);
        renderMembers(); // Renderizar membros ao carregar a página
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

function renderMembers() {
    const membersList = document.getElementById('members');
    if (membersList) {
        membersList.innerHTML = '';
        members.forEach((member, index) => {
            const listGroupItem = document.createElement('li');
            listGroupItem.className = 'list-group-item d-flex justify-content-between align-items-center';

            const memberName = document.createElement('span');
            memberName.textContent = member.name;
            listGroupItem.appendChild(memberName);

            const buttonGroup = createEditButton(index);
            listGroupItem.appendChild(buttonGroup);

            membersList.appendChild(listGroupItem);
        });
    }
}

function addMember() {
    const memberNameInput = document.getElementById("memberName");
    const memberName = memberNameInput.value.trim();

    if (memberName !== "") {
        const newMember = { name: memberName };
        members.push(newMember);
        saveMembers(); // Salvar membros após adição
        renderMembers();
        populateTeamMembers();
        memberNameInput.value = "";
    } else {
        alert("Please enter the member's name.");
    }
}

function saveMembers() {
    localStorage.setItem(membersKey, JSON.stringify(members));
}

function createEditButton(index) {
    const buttonGroup = document.createElement("div");
    buttonGroup.className = "btn-group";

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.className = "btn btn-info btn-sm";
    editButton.onclick = function () {
        editMember(index);
    };

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "btn btn-danger btn-sm";
    deleteButton.onclick = function () {
        deleteMember(index);
    };

    buttonGroup.appendChild(editButton);
    buttonGroup.appendChild(deleteButton);

    return buttonGroup;
}

function deleteMember(index) {
    if (confirm("Are you sure you want to delete this member?")) {
        members.splice(index, 1);
        saveMembers(); // Salvar membros após exclusão
        renderMembers();
        populateTeamMembers();
    }
}

function editMember(index) {
    const newName = prompt('Enter the new name of the member:', members[index].name);
    if (newName && newName.trim() !== '') {
        members[index].name = newName.trim();
        saveMembers(); // Salvar membros após edição
        renderMembers();
        populateTeamMembers();
    } else {
        alert('Please enter a valid name.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadMembers();
    populateTeamMembers();
});
