// Função para manipular a ação do usuário (cadastrar, atualizar, remover)
function handleUserAction(action) {
    const userId = document.getElementById(`${action}UserId`).value;
    const userName = document.getElementById(`${action}UserName`)?.value || '';
    const userCpf = document.getElementById(`${action}UserCpf`)?.value || '';

    const userData = {
        id: userId,
        name: userName,
        cpf: userCpf
    };

    let url, method;
    if (action === 'cadastrar') {
        url = '/api/users';
        method = 'POST';
    } else if (action === 'atualizar') {
        url = `/api/users/${userId}`;
        method = 'PUT';
    } else if (action === 'remover') {
        url = `/api/users/${userId}`;
        method = 'DELETE';
    }

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: action !== 'remover' ? JSON.stringify(userData) : null
    })
    .then(response => response.json())
    .then(data => {
        showModal(data.message);
        updateUserTable(); // Atualiza a tabela após a ação
    });
}

// Função para atualizar a tabela na página users.html
function updateUserTable() {
    fetch('/api/users')
    .then(response => response.json())
    .then(users => {
        const userTableBody = document.querySelector('#usersTable tbody');

        // Limpa o conteúdo atual da tabela
        // userTableBody.innerHTML = '';

        // Adiciona os usuários na tabela
        users.forEach((user, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <th scope="row">${index + 1}</th>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.cpf}</td>
            `;
            userTableBody.appendChild(row); // Adiciona a nova linha ao final da tabela
        });
    });
}

// Atualiza a tabela ao carregar a página users.html
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.endsWith('users.html')) {
        updateUserTable();
    }
});
