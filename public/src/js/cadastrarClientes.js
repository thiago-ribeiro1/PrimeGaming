// Ao carregar a página, atualiza a tabela
window.addEventListener('DOMContentLoaded', () => {
    updateTable();
});

// Cadastro de cliente com verificação de ID duplicado
document.getElementById('clientForm')?.addEventListener('submit', function (event) {
    event.preventDefault();

    let codCliente = document.getElementById('inputId').value;
    let name = document.getElementById('inputName').value;
    let cpf = document.getElementById('inputCpf').value;
    let age = parseInt(document.getElementById('inputAge').value);
    let createdAt = document.getElementById('inputCreatedAt').value;

    let client = {
        id: codCliente,
        name,
        cpf,
        age,
        createdAt
    };

    fetch('/api/clients')
        .then(response => response.json())
        .then(clients => {
            // Verifica se o ID já existe
            const existingClient = clients.find(c => c.id === codCliente);
            if (existingClient) {
                showModal('Cliente com esse código já existe!');
            } else {
                // Se não existir, faz o cadastro
                return fetch('/api/clients', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(client)
                });
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data) {
                showModal(data.message);
                if (data.message === 'Cliente cadastrado com sucesso!') {
                    updateTable();
                }
            }
        });
});

// Atualização de cliente
document.getElementById('clientUpdateForm')?.addEventListener('submit', function (event) {
    event.preventDefault();

    let codCliente = document.getElementById('updateId').value;
    let name = document.getElementById('updateName').value;
    let cpf = document.getElementById('updateCpf').value;
    let age = parseInt(document.getElementById('updateAge').value);

    let client = {
        name,
        cpf,
        age
    };

    fetch(`/api/clients/${codCliente}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(client)
    })
    .then(response => response.json())
    .then(data => {
        showModal(data.message);
        updateTable();
    });
});

// Remoção de cliente
document.getElementById('clientRemoveForm')?.addEventListener('submit', function (event) {
    event.preventDefault();

    let codCliente = document.getElementById('removeId').value;

    fetch(`/api/clients/${codCliente}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        showModal(data.message);
        updateTable();
    });
});

function updateTable() {
    const tableBody = document.querySelector('#clientTable tbody');
    // tableBody.innerHTML = ''; // Limpar tabela antes de adicionar novos dados

    fetch('/api/clients')
        .then(response => response.json())
        .then(clients => {
            clients.forEach((client, index) => {
                const row = document.createElement('tr');

                // Função para formatar a data
                const formatDate = (dateString) => {
                    const date = new Date(dateString);
                    const day = String(date.getDate()).padStart(2, '0');
                    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mês começa em 0
                    const year = date.getFullYear();
                    return `${day}-${month}-${year}`;
                };

                // Formatando a data criada (createdAt)
                const formatarDataCreatedAt = formatDate(client.createdAt);

                row.innerHTML = `
                    <th scope="row">${index + 3}</th>
                    <td>${client.name}</td>
                    <td>${client.cpf}</td> 
                    <td>${client.age}</td>
                    <td>${formatarDataCreatedAt}</td> <!-- Data formatada -->
                `;
                tableBody.appendChild(row);
            });
        });
}

