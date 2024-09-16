document.getElementById('signupForm').addEventListener('submit', async function (event) {
  event.preventDefault();

  const name = document.getElementById('yourName').value.trim();
  const email = document.getElementById('yourEmail').value.trim();
  const username = document.getElementById('yourUsername').value.trim();
  const password = document.getElementById('yourPassword').value.trim();

  // Verificação de campos obrigatórios
  if (!name || !email || !username || !password) {
      showModal('Preencha todos os campos');
      return;
  }

  // Validação de formato de e-mail
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
      showModal('Insira um email válido');
      return;
  }

  try {
      // Envia os dados para o servidor Node.js com MongoDB
      const response = await fetch('http://localhost:3000/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, username, password }),
      });

      const data = await response.json();

      if (response.ok) {
          // Cadastro bem-sucedido
          showModal('Usuário cadastrado. Faça Login');
          
          // Simula um clique no botão de login após o sucesso no registro
          document.getElementById('login').click();
      } else {
          // Exibe a mensagem de erro recebida do backend
          showModal(data.message);
      }
  } catch (error) {
      // Erro ao tentar fazer a requisição ao servidor
      showModal('Erro ao registrar usuário. Tente novamente mais tarde.');
  }
});

// Função para exibir o modal com uma mensagem
async function showModal(message) {
  // Atualizar o conteúdo da mensagem do modal
  document.getElementById('modal-message').innerText = message;

  // Mostrar o modal usando o Bootstrap
  var myModal = new bootstrap.Modal(document.getElementById('exampleModal'));
  myModal.show();

  // Função para fechar o modal ao clicar no X
  document.querySelector('.btn-close').addEventListener('click', function () {
      myModal.hide();
  });

  // Espera 1,5 segundos antes de fechar automaticamente
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Fechar o modal automaticamente
  myModal.hide();
}
