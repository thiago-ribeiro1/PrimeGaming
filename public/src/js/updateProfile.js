// Função para atualizar a interface da página inicial
function updateHomePage(user) {
  // Selecionar os elementos onde os dados serão exibidos
  const userNameLoginElement = document.getElementById("userNameLogin");
  const bemVindoElement = document.getElementById("welcome");

  let msgDesconto = "";

  if (user.type === "Client") {
    // Verificar se o tipo é "Client"
    const anoCadastro = new Date(user.registrationDate).getFullYear();
    const anoAtual = new Date().getFullYear();
    const tempoCliente = anoAtual - anoCadastro;

    if (tempoCliente >= 2) {
      msgDesconto =
        "Parabéns por dois anos de cadastro na nossa loja! No final de qualquer compra, você terá 25% de desconto";
    }
  }

  // Atualizar o conteúdo com os dados do usuário e desconto
  userNameLoginElement.textContent = user.name;
  bemVindoElement.textContent = `Bem-vindo(a) ${user.name} ${msgDesconto}`;
}

async function botaoComprarCliente(productName) {
  try {
    // Recuperar a lista de produtos do servidor
    const response = await fetch("/api/products");
    if (!response.ok) {
      throw new Error("Erro ao buscar produtos do servidor");
    }
    const products = await response.json();

    // Log para ver o que está sendo retornado do servidor
    console.log("Produtos retornados do servidor:", products);

    // Encontrar o produto pelo nome
    const product = products.find((p) => p.name === productName);

    // Log para verificar o produto encontrado
    console.log("Produto encontrado:", product);

    // Recuperar a lista de usuários do localStorage
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado")) || {};

    console.log("Usuário atual:", usuarioLogado);

    // Verificar se o produto e o usuário existem
    if (product && usuarioLogado) {
      let msgAtividadesRecentes;

      if (usuarioLogado.type === "Client") {
        // Calcular o tempo de cliente
        const anoCadastro = new Date(usuarioLogado.registrationDate).getFullYear();
        const anoAtual = new Date().getFullYear();
        const tempoCliente = anoAtual - anoCadastro;

        console.log(`Tempo de cliente: ${tempoCliente} anos`);

        // Verificar se o cliente tem 2 anos ou mais de cadastro
        if (tempoCliente >= 2) {
          const desconto = 0.25;
          const precoDesconto = (product.price_current * (1 - desconto)).toFixed(2);
          showModal(`Você comprou ${product.name} com desconto de 25% por R$${precoDesconto}`);
        } else {
          showModal(`Você comprou ${product.name} por R$${product.price_current}`);
        }
      } else {
        showModal(`Você comprou ${product.name} por R$${product.price_current}`);
      }

      msgAtividadesRecentes = `${usuarioLogado.name} comprou ${product.name}`;

      // Adicionar a mensagem de atividade ao Redis
      fetch('/api/atividades', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ msgAtividadesRecentes }),
      })
      .then(response => response.json())
      .then(data => console.log('Atividade salva:', data))
      .catch(error => console.error('Erro ao salvar atividade:', error));


    } else {
      showModal("Produto não encontrado ou usuário não encontrado");
    }
  } catch (error) {
    console.error("Erro:", error);
    showModal("Ocorreu um erro ao processar a compra");
  }
}

// Função para atualizar a interface da página de perfil
function updateUserProfile(user) {
  // Selecionar os elementos onde os dados serão exibidos
  const profileNameElement = document.getElementById("profileName");
  const fullNameElement = document.getElementById("fullName");
  const emailElement = document.getElementById("email");
  const usernameElement = document.getElementById("username");

  // Atualizar o HTML da interface
  profileNameElement.innerHTML = `
        <div class="card-body profile-card pt-4 d-flex flex-column align-items-center">
            <img src="../img/profile-img.jpg" alt="Profile" class="rounded-circle">
            <h2>${user.name}</h2>
        </div>
    `;
  fullNameElement.textContent = user.name;
  emailElement.textContent = user.email;
  usernameElement.textContent = user.username;
}

// Atualizar a interface ao carregar a página
window.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

  if (!usuarioLogado) {
    // Se o usuário não estiver logado, redireciona para o login
    showModal("Nenhum usuário encontrado. Por favor, faça login");
    window.location.href = "../../index.html";
    return; // Saímos da função
  }

  // Atualizar a interface dependendo da página
  if (path.endsWith("src/views/home-page.html")) {
    updateHomePage(usuarioLogado);
  } else if (path.endsWith("src/views/users-profile.html")) {
    updateUserProfile(usuarioLogado);
  } else if (path.endsWith("src/views/products.html")) {
    updateHomePage(usuarioLogado);
  }
});
