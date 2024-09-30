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

  Toastify({
    text: "Usuário Logado",
    duration: 1300,
    destination: "https://github.com/apvarun/toastify-js",
    newWindow: true,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    offset: {
      x: 0, // Distância da borda lateral (pode ajustar se quiser)
      y: 46  // Distância do topo (ajuste este valor para abaixar mais o toast)
    },
    style: {
      background: "linear-gradient(to right, #0073e6, #00c6ff)",
    },
    onClick: function(){} // Callback after click
  }).showToast();

  
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
          'Content-Type': 'application/json', // corpo da mensagem será em JSON
        },
        body: JSON.stringify({ msgAtividadesRecentes }), // converte o objeto contendo a mensagem de atividades recentes em uma string JSON
      })
      .then(response => response.json())  // Quando a resposta for recebida, convertê-la para JSON
      .then(data => console.log('Atividade salva:', data)) // Exibir no console uma mensagem de sucesso 
      .catch(error => console.error('Erro ao salvar atividade:', error));


    } else {
      showModal("Produto não encontrado ou usuário não encontrado");
    }
  } catch (error) {
    console.error("Erro:", error);
    showModal("Ocorreu um erro ao processar a compra");
  }
}

// Função para atualizar a interface da página de perfil e a imagem de perfil 
function updateUserProfile(user) {
  // Atualizar a imagem de perfil na navbar
  const profileImageElements = document.querySelectorAll(".nav-profile img");
  
  // Atualiza a imagem de perfil em todas as instâncias na navegação
  profileImageElements.forEach((imgElement) => {
      imgElement.src = user.profileImage || '../img/profile-img.jpg'; // Usar uma imagem padrão se não houver
  });

  

  // Atualizar a interface da página de perfil
  const profileNameElement = document.getElementById("profileName");
  const fullNameElement = document.getElementById("fullName");
  const emailElement = document.getElementById("email");
  const usernameElement = document.getElementById("username");

  // Atualizar o HTML da interface
  profileNameElement.innerHTML = `
      <div class="card-body profile-card pt-4 d-flex flex-column align-items-center">
          <img src="${user.profileImage || '../img/profile-img.jpg'}" alt="Profile" class="rounded-circle">
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

  // Padronizando o caminho removendo barras ou caracteres indesejados
const normalizedPath = path.toLowerCase().replace(/\\/g, '/');

// Atualizar a interface das páginas
if (normalizedPath.endsWith("src/views/home-page.html")) {
    updateHomePage(usuarioLogado);
    updateUserProfile(usuarioLogado);
}

if (normalizedPath.endsWith("src/views/users-profile.html")) {
    updateUserProfile(usuarioLogado);
    updateHomePage(usuarioLogado);
}

if (normalizedPath.endsWith("src/views/products.html")) {
    updateHomePage(usuarioLogado);
    updateUserProfile(usuarioLogado);
}

});


// Manipular imagem de perfil do html
document.getElementById("uploadImageButton").addEventListener("click", async () => {
  const fileInput = document.getElementById("profileImage"); // Obtém o elemento de input do arquivo onde o usuário seleciona a imagem
  const file = fileInput.files[0];
  
  if (file) { // se houver alguma imagem arquivo
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result; // String Base64 da imagem
      const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
      
      // Atualizar a imagem do perfil no MongoDB
      await fetch('/api/users/updateProfileImage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: usuarioLogado._id, // Assumindo que o ID do usuário está armazenado
          image: base64String // Imagem como string Base64
        }),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error("Erro ao atualizar a imagem"); // Lança um erro se a resposta não for OK
        }
        return response.json();
      })
      .then(data => {
        console.log('Imagem do perfil atualizada:', data);
        
        // Atualizar o localStorage com a nova imagem
        usuarioLogado.profileImage = base64String; // Atualiza a imagem no objeto do usuário
        localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado)); // Salva no localStorage
        
        // Atualizar a interface se necessário
        updateUserProfile({ ...usuarioLogado, profileImage: base64String });
      })
      .catch(error => console.error('Erro ao atualizar imagem:', error));
    };
    reader.readAsDataURL(file); // Converte a imagem para Base64
  } else {
    console.log("Nenhuma imagem selecionada");
  }
});

// Atualiza a imagem de perfil ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
  const user = JSON.parse(localStorage.getItem('currentUser')); // Obtém o usuário do localStorage
  if (user) {
      updateUserProfile(user); // Chama a função para atualizar a interface e a imagem
  }
});