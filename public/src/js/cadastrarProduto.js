document.addEventListener('DOMContentLoaded', function() {
    // Carrega e atualiza os produtos quando a página é carregada
    loadProducts();
});

// Função para carregar e atualizar a tabela de produtos
function loadProducts() {
    fetch('/api/products')
        .then(response => response.json())
        .then(products => {
            const tableBody = document.querySelector('table tbody');

            products.forEach(product => {
                const row = document.createElement('tr');
                
                // Condicional para adicionar o botão "Comprar" apenas na página products.html
                const isProductsPage = window.location.pathname.includes('products.html');
                
                row.innerHTML = `
                    <th scope="row"><a><img src="${product.image}" alt="Produto Imagem" style="width: 50px; height: 50px;"></a></th>
                    <td><a href="#" class="text-primary fw-bold">${product.name}</a></td>
                    <td>R$${product.price_current}</td>
                    <td class="fw-bold">R$${product.price_promotion}</td>
                    <td>${product.type}</td>
                    <td>${product.description}</td>
                    ${isProductsPage ? `<td><button class="btn btn-primary" onclick="botaoComprarCliente('${product.name}')">Comprar</button></td>` : ''}
                `;
                
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Erro ao carregar produtos:', error));
}

// Função para cadastrar um produto
function cadastrarProduto() {
    const productImage = document.getElementById('productImage').value.trim();

    const product = {
        codProd: document.getElementById('productId').value,
        name: document.getElementById('productName').value,
        price_current: document.getElementById('productPriceCurrent').value,
        price_promotion: document.getElementById('productPricePromotion').value,
        type: document.getElementById('productType').value,
        description: document.getElementById('productDescription').value,
        created_at: document.getElementById('productCreatedAt').value,
        updated_at: document.getElementById('productUpdatedAt').value,
        image: productImage.length > 0 ? productImage : '../img/product-1.jpg' // Define a imagem padrão se o usuário não inserir url da imagem
    };



    fetch('/api/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
    })
    .then(response => response.json())
    .then(data => {
        showModal(data.message);
        loadProducts(); // Atualiza a tabela de produtos após a ação
    })
    .catch(error => console.error('Erro ao cadastrar produto:', error));
}


// Função para atualizar um produto existente
function atualizarProduto() {
    const product = {
        name: document.getElementById('productName').value,
        price_current: document.getElementById('productPriceCurrent').value,
        price_promotion: document.getElementById('productPricePromotion').value,
        type: document.getElementById('productType').value,
        description: document.getElementById('productDescription').value,
        updated_at: new Date() // Atualiza a data automaticamente
    };

    const codProd = document.getElementById('productId').value;

    fetch(`/api/products/${codProd}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
    })
    .then(response => response.json())
    .then(data => {
        showModal(data.message);
        loadProducts(); // Atualiza a tabela de produtos após a ação
    })
    .catch(error => console.error('Erro ao atualizar produto:', error));
}

// Função para remover um produto
function removerProduto() {
    const codProd = document.getElementById('removerProductId').value; // Usando o novo ID

    fetch(`/api/products/${codProd}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        showModal(data.message);
        loadProducts(); // Atualiza a tabela de produtos após a ação
    })
    .catch(error => console.error('Erro ao remover produto:', error));
}

// Função principal para decidir qual ação tomar com base no botão clicado
function handleFormAction(action) {
    if (action === 'cadastrar') {
        cadastrarProduto();
    } else if (action === 'atualizar') {
        atualizarProduto();
    } else if (action === 'remover') {
        removerProduto();
    }

    // Limpa o formulário após a ação
    document.getElementById('productForm').reset();
}

// Adiciona os ouvintes de eventos para os botões do formulário
document.getElementById('cadastrarBtn').addEventListener('click', function() {
    handleFormAction('cadastrar');
});

document.getElementById('atualizarBtn').addEventListener('click', function() {
    handleFormAction('atualizar');
});

document.getElementById('removerBtn').addEventListener('click', function() {
    handleFormAction('remover');
});
