
const API_URL = "/api/produtos";

const form = document.getElementById("productForm");
const nomeInput = document.getElementById("nome");
const precoInput = document.getElementById("preco");
const listaEl = document.getElementById("lista");
const feedbackEl = document.getElementById("feedback");
const btnAdd = document.getElementById("btnAdd");
const addSpinner = document.getElementById("addSpinner");
const countLabel = document.getElementById("countLabel");
const themeToggle = document.getElementById("themeToggle");


(function initTheme(){
  const t = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", t === "dark" ? "dark" : "light");
  themeToggle.textContent = t === "dark" ? "☀️" : "🌙";
})();
themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  themeToggle.textContent = next === "dark" ? "☀️" : "🌙";
});


function showFeedback(message, type = "info", timeout = 2500) {
  feedbackEl.textContent = message;
  feedbackEl.style.color = type === "error" ? "var(--danger)" : "var(--muted)";
  if(timeout > 0) setTimeout(()=> {
    if (feedbackEl.textContent === message) feedbackEl.textContent = "";
  }, timeout);
}


function setLoading(loading) {
  if (loading) {
    btnAdd.disabled = true;
    addSpinner.classList.add("visible");
  } else {
    btnAdd.disabled = false;
    addSpinner.classList.remove("visible");
  }
}


function renderProdutos(produtos) {
  listaEl.innerHTML = "";
  countLabel.textContent = `${produtos.length} ${produtos.length === 1 ? 'produto' : 'produtos'}`;
  if (produtos.length === 0) {
    listaEl.innerHTML = `<div class="item"><div class="left"><div class="title">Nenhum produto cadastrado</div><div class="meta">Adicione o primeiro produto</div></div></div>`;
    return;
  }

  produtos.forEach(p => {
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
      <div class="left">
        <div class="title">${escapeHtml(p.nome)} — R$ ${Number(p.preco).toFixed(2)}</div>
        <div class="meta">ID: ${p.id}</div>
      </div>
      <div class="actions">
        <button class="icon-btn secondary" title="Editar" onclick="alert('Edição não implementada nesta demo')">✏️</button>
        <button class="icon-btn danger" title="Excluir" onclick="deletarProduto(${p.id})">🗑️</button>
      </div>
    `;
    listaEl.appendChild(div);
  });
}


function escapeHtml(str = "") {
  return String(str).replace(/[&<>"']/g, function(m){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]; });
}


async function carregarProdutos() {
  try {
    countLabel.textContent = "Carregando...";
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`Erro ${res.status}`);
    const produtos = await res.json();
    renderProdutos(produtos);
  } catch (err) {
    renderProdutos([]);
    showFeedback("Não foi possível carregar produtos. Verifique se a API está ativa.", "error", 4000);
    console.error(err);
  }
}


async function criarProduto(nome, preco) {
  try {
    setLoading(true);
    const body = { nome: String(nome).trim(), preco: Number(preco) };
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `Erro ${res.status}`);
    }

    showFeedback("Produto adicionado com sucesso!", "info");
    nomeInput.value = "";
    precoInput.value = "";
    await carregarProdutos();
  } catch (err) {
    showFeedback("Erro ao adicionar produto.", "error", 4000);
    console.error("POST error:", err);
  } finally {
    setLoading(false);
  }
}


async function deletarProduto(id) {
  if (!confirm("Tem certeza que deseja excluir este produto?")) return;
  try {
    setLoading(true);
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`Erro ${res.status}`);
    showFeedback("Produto removido.", "info");
    await carregarProdutos();
  } catch (err) {
    showFeedback("Erro ao excluir produto.", "error", 3000);
    console.error("DELETE error:", err);
  } finally {
    setLoading(false);
  }
}


form.addEventListener("submit", (ev) => {
  ev.preventDefault();
  const nome = nomeInput.value.trim();
  const preco = parseFloat(precoInput.value);
  if (!nome) { showFeedback("Preencha o nome do produto.", "error"); return; }
  if (isNaN(preco) || preco < 0) { showFeedback("Informe um preço válido.", "error"); return; }
  criarProduto(nome, preco);
});


carregarProdutos();


window.deletarProduto = deletarProduto;
