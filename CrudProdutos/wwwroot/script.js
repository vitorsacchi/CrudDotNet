const API_URL = "http://localhost:8080/api/produtos";

async function carregarProdutos() {
    const resposta = await fetch(API_URL);
    const produtos = await resposta.json();

    const lista = document.getElementById("lista");
    lista.innerHTML = "";

    produtos.forEach(p => {
        lista.innerHTML += `
            <div class="produto">
                <span>${p.id} - ${p.nome} (R$${p.preco})</span>
                <button onclick="deletarProduto(${p.id})">Excluir</button>
            </div>
        `;
    });
}

async function criarProduto() {
    const nome = document.getElementById("nome").value;
    const preco = parseFloat(document.getElementById("preco").value);

    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, preco })
    });

    document.getElementById("nome").value = "";
    document.getElementById("preco").value = "";

    carregarProdutos();
}

async function deletarProduto(id) {
    await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });

    carregarProdutos();
}

// carregamento inicial
carregarProdutos();
