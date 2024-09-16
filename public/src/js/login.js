document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    const cadastroDate = document.getElementById("cadastroDate").value; // Captura a data de cadastro
    const userTypeUser = document.getElementById("userTypeUser").checked;
    const userTypeClient = document.getElementById("userTypeClient").checked;

    // Validação dos campos obrigatórios
    if (!username) {
        showModal("Insira um 'Nome de usuário'");
        return;
    }

    if (!password) {
        showModal("Insira uma 'Senha'");
        return;
    }

    if (!userTypeUser && !userTypeClient) {
        showModal("Selecione o tipo de usuário");
        return;
    }

    try {
        // Envia uma requisição POST para o servidor Node.js com os dados do login
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }), // Envia nome de usuário e senha
        });

        const data = await response.json(); // Recebe os dados de resposta do backend

        if (response.ok) {
            // Login bem-sucedido
            const user = data.user; // A resposta do backend contém o objeto do usuário ({ name, email, username, password })

            // Atualiza o tipo de usuário
            user.type = userTypeUser ? "User" : "Client";

            // Adiciona a data de cadastro ao objeto do usuário, capturada do Front no login se for CLiente
            user.registrationDate = cadastroDate;

            // Armazenar os dados do usuário logado no localStorage
            localStorage.setItem('usuarioLogado', JSON.stringify(user));

            // Verifica o tipo de usuário e redireciona para a página correspondente
            if (userTypeUser) {
                window.location.href = "src/views/home-page.html"; 
            } else if (userTypeClient) {
                window.location.href = "src/views/products.html"; 
            }
        } else {
            // Mostra o erro recebido do servidor
            showModal(data.message);
        }
    } catch (error) {
        // Exibe uma mensagem de erro genérica em caso de falha de conexão
        showModal("Erro ao tentar fazer login. Tente novamente mais tarde.");
    }
});

// Função para exibir o modal com mensagem de erro ou sucesso
async function showModal(message) {
    // Atualizar o conteúdo da mensagem do modal
    document.getElementById('modal-message').innerText = message;

    // Mostrar o modal usando o Bootstrap
    var myModal = new bootstrap.Modal(document.getElementById('exampleModal'));
    myModal.show();

    // Função para os usuários fecharem a box no X 
    document.querySelector('.btn-close').addEventListener('click', function () {
        myModal.hide();
    });

    // Espera 2 segundos e meio antes de fechar automaticamente
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Fechar o modal automaticamente após 2 segundos e meio
    myModal.hide();
}
