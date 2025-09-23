 
// Variáveis Globais
let projetos = [];
let filtroAtual = 'all';
let contadorIdProjeto = 1;
let taxasCambio = {};

// Dados iniciais de exemplo
const projetosAmostra = [
    {
        id: 1,
        titulo: "Cirurgia de Emergência para João",
        descricao: "João, de 8 anos, precisa de uma cirurgia cardíaca urgente. Sua família não tem recursos para custear o procedimento.",
        categoria: "saude",
        meta: 50000,
        arrecadado: 32000,
        imagem: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        doadores: 156,
        diasRestantes: 15
    },
    {
        id: 2,
        titulo: "Reforma da Escola Rural",
        descricao: "Nossa escola rural precisa de reformas urgentes no telhado e nas salas de aula para continuar funcionando.",
        categoria: "educacao",
        meta: 25000,
        arrecadado: 18500,
        imagem: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        doadores: 89,
        diasRestantes: 30
    },
    {
        id: 3,
        titulo: "Resgate de Animais Abandonados",
        descricao: "ONG que resgata animais abandonados precisa de recursos para medicamentos e ração.",
        categoria: "animal",
        meta: 15000,
        arrecadado: 12000,
        imagem: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        doadores: 203,
        diasRestantes: 45
    },
    {
        id: 4,
        titulo: "Família Desabrigada pelo Temporal",
        descricao: "Família perdeu tudo em enchente e precisa de ajuda para reconstruir sua casa e comprar móveis básicos.",
        categoria: "emergencia",
        meta: 30000,
        arrecadado: 8000,
        imagem: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        doadores: 45,
        diasRestantes: 60
    },
    {
        id: 5,
        titulo: "Equipamentos para Time de Futebol",
        descricao: "Time de futebol infantil da comunidade precisa de uniformes e equipamentos para participar do campeonato.",
        categoria: "esporte",
        meta: 8000,
        arrecadado: 6200,
        imagem: "https://images.unsplash.com/photo-1556056504-5c7696c4c28d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        doadores: 67,
        diasRestantes: 20
    },
    {
        id: 6,
        titulo: "Festival de Arte na Comunidade",
        descricao: "Organização de festival cultural para promover artistas locais e fortalecer a cultura da região.",
        categoria: "cultura",
        meta: 12000,
        arrecadado: 4500,
        imagem: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        doadores: 34,
        diasRestantes: 40
    }
];// Inicializar aplicação quando DOM carregar
document.addEventListener('DOMContentLoaded', function() {
    inicializarApp();
    configurarEventListeners();
    carregarProjetos();
    atualizarEstatisticas();
    buscarFraseDoDia();
    buscarTaxasCambio();
    configurarPagamentos();
});


// Inicializar aplicação
function inicializarApp() {
    projetos = [...projetosAmostra];
    contadorIdProjeto = projetosAmostra.length + 1;
    console.log('Aplicação inicializada com', projetos.length, 'projetos');
}

// Configurar event listeners
function configurarEventListeners() {
    // Toggle do menu mobile
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Fechar menu mobile ao clicar nos links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu) navMenu.classList.remove('active');
            if (navToggle) navToggle.classList.remove('active');
        });
    });

    // Botões de filtro de projetos
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filtroAtual = this.dataset.filter;
            renderizarProjetos();
        });
    });

    // Formulário de criar projeto
    const formCriarProjeto = document.getElementById('create-project-form');
    if (formCriarProjeto) {
        formCriarProjeto.addEventListener('submit', processarCriacaoProjeto);
    }

    // Formulário de doação
    const formDoacao = document.getElementById('donation-form');
    if (formDoacao) {
        formDoacao.addEventListener('submit', processarDoacao);
    }

    // Formulário de contato
    const formContato = document.getElementById('contact-form');
    if (formContato) {
        formContato.addEventListener('submit', processarContato);
    }

    // Botões de valor de doação
    document.querySelectorAll('.amount-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            const inputValor = document.querySelector('input[name="amount"]');
            if (inputValor) {
                inputValor.value = this.dataset.amount;
                atualizarResumoDoacao();
                atualizarConversaoMoeda(this.dataset.amount);
            }
        });
    });

    // Input de valor personalizado
    const inputValorPersonalizado = document.querySelector('input[name="amount"]');
    if (inputValorPersonalizado) {
        inputValorPersonalizado.addEventListener('input', function() {
            if (this.value) {
                document.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('selected'));
                atualizarResumoDoacao();
                atualizarConversaoMoeda(this.value);
            }
        });
    }

    // Scroll suave para âncoras
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Efeito no header durante scroll
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (header) {
            if (window.scrollY > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
            } else {
                header.style.background = '#fff';
                header.style.backdropFilter = 'none';
            }
        }
    });

    // Fechar modais ao clicar fora
    window.addEventListener('click', function(e) {
        const modalProjeto = document.getElementById('project-modal');
        const modalDoacao = document.getElementById('donation-modal');
        const modalSucesso = document.getElementById('success-modal');
        
        if (e.target === modalProjeto) fecharModal();
        if (e.target === modalDoacao) fecharModalDoacao();
        if (e.target === modalSucesso) fecharModalSucesso();
    });
}

// Carregar e renderizar projetos
function carregarProjetos() {
    renderizarProjetos();
}

function renderizarProjetos() {
    const gridProjetos = document.getElementById('projects-grid');
    if (!gridProjetos) return;

    const projetosFiltrados = filtroAtual === 'all' 
        ? projetos 
        : projetos.filter(projeto => projeto.categoria === filtroAtual);

    gridProjetos.innerHTML = projetosFiltrados.map(projeto => {
        const porcentagemProgresso = Math.min((projeto.arrecadado / projeto.meta) * 100, 100);
        const nomesCategorias = {
            'saude': 'Saúde',
            'educacao': 'Educação',
            'animal': 'Animais',
            'emergencia': 'Emergência',
            'esporte': 'Esporte',
            'cultura': 'Cultura'
        };

        return `
            <div class="project-card" data-category="${projeto.categoria}">
                <div class="project-image" style="background-image: url('${projeto.imagem}')">
                    <span class="project-category">${nomesCategorias[projeto.categoria]}</span>
                </div>
                <div class="project-content">
                    <h3 class="project-title">${projeto.titulo}</h3>
                    <p class="project-description">${projeto.descricao}</p>
                    <div class="project-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${porcentagemProgresso}%"></div>
                        </div>
                    </div>
                    <div class="project-stats">
                        <span class="raised">R$ ${formatarDinheiro(projeto.arrecadado)} arrecadado</span>
                        <span class="goal">Meta: R$ ${formatarDinheiro(projeto.meta)}</span>
                    </div>
                    <div class="project-stats">
                        <span>${projeto.doadores} doadores</span>
                        <span>${projeto.diasRestantes} dias restantes</span>
                    </div>
                    <div class="project-actions">
                        <button class="btn-secondary" onclick="compartilharProjeto(${projeto.id})">
                            <i class="fas fa-share-alt"></i> Compartilhar
                        </button>
                        <button class="btn-donate" onclick="abrirModalDoacao(${projeto.id})">
                            <i class="fas fa-heart"></i> Doar
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Processar criação de projeto
function processarCriacaoProjeto(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const novoProjeto = {
        id: contadorIdProjeto++,
        titulo: formData.get('title'),
        descricao: formData.get('description'),
        categoria: formData.get('category'),
        meta: parseInt(formData.get('goal')),
        arrecadado: 0,
        imagem: formData.get('image') || obterImagemPadrao(formData.get('category')),
        doadores: 0,
        diasRestantes: 60
    };

    projetos.unshift(novoProjeto);
    renderizarProjetos();
    atualizarEstatisticas();
    fecharModal();
    
    mostrarMensagem('Projeto criado com sucesso!', 'success');
    e.target.reset();
}

// Processar doação
function processarDoacao(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const projetoId = parseInt(document.getElementById('donation-modal').dataset.projectId);
    const valor = parseFloat(formData.get('amount'));
    const nomeDoador = formData.get('donor_name');
    const emailDoador = formData.get('donor_email');
    const metodoPagamento = formData.get('payment_method');

    if (!valor || valor <= 0) {
        mostrarMensagem('Por favor, insira um valor válido para a doação.', 'error');
        return;
    }

    if (!metodoPagamento) {
        mostrarMensagem('Por favor, selecione um método de pagamento.', 'error');
        return;
    }

    const projeto = projetos.find(p => p.id === projetoId);
    if (projeto) {
        const botaoSubmit = e.target.querySelector('button[type="submit"]');
        const textoOriginal = botaoSubmit.innerHTML;
        botaoSubmit.innerHTML = '<span class="loading-spinner"></span> Processando...';
        botaoSubmit.disabled = true;

        // Simular processamento de pagamento
        setTimeout(() => {
            projeto.arrecadado += valor;
            projeto.doadores += 1;
            
            renderizarProjetos();
            atualizarEstatisticas();
            fecharModalDoacao();
            
            mostrarMensagem(`Obrigado, ${nomeDoador}! Sua doação de R$ ${formatarDinheiro(valor)} foi processada com sucesso.`, 'success');
            
            botaoSubmit.innerHTML = textoOriginal;
            botaoSubmit.disabled = false;
            e.target.reset();
            
            // Enviar confirmação por email (simulado)
            enviarConfirmacaoDoacao(emailDoador, nomeDoador, valor, projeto.titulo);
        }, 2000);
    }
}

// Processar formulário de contato
function processarContato(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const botaoSubmit = e.target.querySelector('button[type="submit"]');
    const textoOriginal = botaoSubmit.innerHTML;
    
    botaoSubmit.innerHTML = '<span class="loading-spinner"></span> Enviando...';
    botaoSubmit.disabled = true;

    
    setTimeout(() => {
        const dadosEmail = {
            nome: formData.get('name'),
            email: formData.get('email'),
            mensagem: formData.get('message'),
            emailDestino: 'contato@doafacil.com.br'
        };
        
        console.log('Enviando email de contato:', dadosEmail);
        mostrarMensagem('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
        
        botaoSubmit.innerHTML = textoOriginal;
        botaoSubmit.disabled = false;
        e.target.reset();
    }, 1500);
}


function abrirModal() {
    const modal = document.getElementById('project-modal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function fecharModal() {
    const modal = document.getElementById('project-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function abrirModalDoacao(projetoId) {
    const projeto = projetos.find(p => p.id === projetoId);
    if (!projeto) return;

    const modal = document.getElementById('donation-modal');
    const infoProjeto = document.getElementById('donation-project-info');
    
    if (modal && infoProjeto) {
        infoProjeto.innerHTML = `
            <h3>${projeto.titulo}</h3>
            <p>Meta: R$ ${formatarDinheiro(projeto.meta)} | Arrecadado: R$ ${formatarDinheiro(projeto.arrecadado)}</p>
            <div class="progress-bar" style="margin-top: 0.5rem;">
                <div class="progress-fill" style="width: ${Math.min((projeto.arrecadado / projeto.meta) * 100, 100)}%"></div>
            </div>
        `;
        
        modal.dataset.projectId = projetoId;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        
        const form = modal.querySelector('form');
        if (form) form.reset();
        
        document.querySelectorAll('.payment-section').forEach(section => {
            section.style.display = 'none';
        });
        
        atualizarResumoDoacao();
    }
}

function fecharModalDoacao() {
    const modal = document.getElementById('donation-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        
        const form = document.getElementById('donation-form');
        if (form) form.reset();
        
        document.querySelectorAll('.amount-btn').forEach(btn => btn.classList.remove('selected'));
        document.querySelectorAll('.payment-section').forEach(section => {
            section.style.display = 'none';
        });
        
        const convertedAmount = document.getElementById('converted-amount');
        const addressInfo = document.getElementById('address-info');
        if (convertedAmount) convertedAmount.style.display = 'none';
        if (addressInfo) addressInfo.style.display = 'none';
    }
}

function fecharModalSucesso() {
    const modal = document.getElementById('success-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}


function formatarDinheiro(valor) {
    return new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(valor);
}

function obterImagemPadrao(categoria) {
    const imagensPadrao = {
        'saude': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        'educacao': 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        'animal': 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        'emergencia': 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        'esporte': 'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        'cultura': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    };
    return imagensPadrao[categoria] || imagensPadrao['saude'];
}

function atualizarEstatisticas() {
    const totalDoado = projetos.reduce((soma, projeto) => soma + projeto.arrecadado, 0);
    const totalProjetos = projetos.length;
    const totalDoadores = projetos.reduce((soma, projeto) => soma + projeto.doadores, 0);

    
    animarContador('total-donated', 0, totalDoado, 'currency');
    animarContador('total-projects', 0, totalProjetos, 'number');
    animarContador('total-donors', 0, totalDoadores, 'number');
}

function animarContador(elementId, inicio, fim, tipo) {
    const elemento = document.getElementById(elementId);
    if (!elemento) return;

    const duracao = 2000;
    const incremento = (fim - inicio) / (duracao / 16);
    let atual = inicio;

    const timer = setInterval(() => {
        atual += incremento;
        if (atual >= fim) {
            atual = fim;
            clearInterval(timer);
        }

        if (tipo === 'currency') {
            elemento.textContent = `R$ ${formatarDinheiro(Math.floor(atual))}`;
        } else {
            elemento.textContent = Math.floor(atual).toLocaleString('pt-BR');
        }
    }, 16);
}

function compartilharProjeto(projetoId) {
    const projeto = projetos.find(p => p.id === projetoId);
    if (!projeto) return;

    if (navigator.share) {
        navigator.share({
            title: projeto.titulo,
            text: projeto.descricao,
            url: `${window.location.origin}#project-${projetoId}`
        });
    } else {
        
        const url = `${window.location.origin}#project-${projetoId}`;
        navigator.clipboard.writeText(url).then(() => {
            mostrarMensagem('Link copiado para a área de transferência!', 'success');
        }).catch(() => {
            mostrarMensagem('Não foi possível copiar o link', 'error');
        });
    }
}

function compartilharRedeSocial(plataforma, projetoId) {
    const projeto = projetos.find(p => p.id === projetoId);
    if (!projeto) return;
    
    const url = encodeURIComponent(`${window.location.origin}#project-${projetoId}`);
    const texto = encodeURIComponent(`Ajude: ${projeto.titulo}`);
    
    let urlCompartilhamento = '';
    
    switch (plataforma) {
        case 'facebook':
            urlCompartilhamento = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            break;
        case 'twitter':
            urlCompartilhamento = `https://twitter.com/intent/tweet?text=${texto}&url=${url}`;
            break;
        case 'whatsapp':
            urlCompartilhamento = `https://wa.me/?text=${texto}%20${url}`;
            break;
        case 'telegram':
            urlCompartilhamento = `https://t.me/share/url?url=${url}&text=${texto}`;
            break;
    }
    
    if (urlCompartilhamento) {
        window.open(urlCompartilhamento, '_blank', 'width=600,height=400');
    }
}

function mostrarMensagem(texto, tipo) {
    
    document.querySelectorAll('.message').forEach(msg => msg.remove());

    const mensagem = document.createElement('div');
    mensagem.className = `message ${tipo}`;
    mensagem.textContent = texto;
    
    
    Object.assign(mensagem.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        zIndex: '3000',
        maxWidth: '300px',
        padding: '1rem',
        borderRadius: '5px',
        color: 'white',
        fontWeight: 'bold',
        backgroundColor: tipo === 'success' ? '#28a745' : '#dc3545',
        boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease'
    });

    document.body.appendChild(mensagem);
    
   
    setTimeout(() => {
        mensagem.style.transform = 'translateX(0)';
    }, 100);

    
    setTimeout(() => {
        mensagem.style.transform = 'translateX(100%)';
        setTimeout(() => mensagem.remove(), 300);
    }, 5000);
}


async function buscarTaxasCambio() {
    try {
        
        const resposta = await fetch('https://api.exchangerate-api.com/v4/latest/BRL');
        const dados = await resposta.json();
        
        taxasCambio = {
            USD: 1 / dados.rates.USD,
            EUR: 1 / dados.rates.EUR,
            BTC: await buscarPrecoBitcoin()
        };
        
        console.log('Taxas de câmbio carregadas:', taxasCambio);
    } catch (error) {
        console.log('Não foi possível buscar taxas de câmbio:', error);
        // Taxas fallback
        taxasCambio = {
            USD: 5.50,
            EUR: 6.20,
            BTC: 0.000012
        };
    }
}

async function buscarPrecoBitcoin() {
    try {
        const resposta = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=brl');
        const dados = await resposta.json();
        return 1 / dados.bitcoin.brl;
    } catch (error) {
        return 0.000012;
    }
}

async function buscarFraseDoDia() {
    try {
        const resposta = await fetch('https://api.quotable.io/random');
        const dados = await resposta.json();
        
        const elementoFrase = document.createElement('div');
        elementoFrase.className = 'daily-quote';
        elementoFrase.innerHTML = `
            <p><em>"${dados.content}"</em></p>
            <small>— ${dados.author}</small>
        `;
        
        const containerHero = document.querySelector('.hero-container');
        if (containerHero) {
            Object.assign(elementoFrase.style, {
                marginTop: '2rem',
                fontStyle: 'italic',
                opacity: '0.8',
                textAlign: 'center'
            });
            containerHero.appendChild(elementoFrase);
        }
    } catch (error) {
        console.log('Não foi possível buscar frase do dia:', error);
    }
}

function configurarPagamentos() {
    
    const selectPagamento = document.querySelector('select[name="payment_method"]');
    if (selectPagamento) {
        selectPagamento.addEventListener('change', function() {
            mostrarSecaoPagamento(this.value);
            atualizarResumoDoacao();
        });
    }

    
    const inputCPF = document.querySelector('input[name="donor_cpf"]');
    if (inputCPF) {
        inputCPF.addEventListener('input', function() {
            this.value = formatarCPF(this.value);
        });
    }

    
    const inputCEP = document.querySelector('input[name="donor_cep"]');
    if (inputCEP) {
        inputCEP.addEventListener('input', function() {
            this.value = formatarCEP(this.value);
            if (this.value.replace(/\D/g, '').length === 8) {
                carregarEnderecoPorCEP(this.value);
            }
        });
    }
}

function atualizarResumoDoacao() {
    const inputValor = document.querySelector('input[name="amount"]');
    const resumoElemento = document.getElementById('donation-summary');
    
    if (inputValor && resumoElemento && inputValor.value) {
        const valor = parseFloat(inputValor.value);
        resumoElemento.innerHTML = `
            <h4>Resumo da Doação</h4>
            <p>Valor: R$ ${formatarDinheiro(valor)}</p>
        `;
        resumoElemento.style.display = 'block';
    } else if (resumoElemento) {
        resumoElemento.style.display = 'none';
    }
}

function atualizarConversaoMoeda(valor) {
    const elementoConversao = document.getElementById('converted-amount');
    if (!elementoConversao || !valor || !taxasCambio.USD) return;
    
    const valorNum = parseFloat(valor);
    const valorUSD = valorNum / taxasCambio.USD;
    
    elementoConversao.innerHTML = `
        <small>≈ $${valorUSD.toFixed(2)} USD</small>
    `;
    elementoConversao.style.display = 'block';
}

function mostrarSecaoPagamento(metodo) {
    document.querySelectorAll('.payment-section').forEach(section => {
        section.style.display = 'none';
    });
    
    const secaoSelecionada = document.getElementById(`${metodo}-section`);
    if (secaoSelecionada) {
        secaoSelecionada.style.display = 'block';
    }
}


function formatarCPF(valor) {
    return valor
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
}

function formatarCEP(valor) {
    return valor
        .replace(/\D/g, '')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{3})\d+?$/, '$1');
}

function formatarCartao(numero) {
    return numero
        .replace(/\D/g, '')
        .replace(/(\d{4})(\d)/, '$1 $2')
        .replace(/(\d{4})(\d)/, '$1 $2')
        .replace(/(\d{4})(\d)/, '$1 $2')
        .replace(/(\d{4})\d+?$/, '$1');
}

function formatarValidadeCartao(validade) {
    return validade
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .replace(/(\/\d{2})\d+?$/, '$1');
}


async function carregarEnderecoPorCEP(cep) {
    try {
        const cepLimpo = cep.replace(/\D/g, '');
        if (cepLimpo.length !== 8) return null;
        
        const resposta = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const dados = await resposta.json();
        
        if (dados.erro) return null;
        
        
        const campoRua = document.querySelector('input[name="donor_street"]');
        const campoBairro = document.querySelector('input[name="donor_neighborhood"]');
        const campoCidade = document.querySelector('input[name="donor_city"]');
        const campoEstado = document.querySelector('input[name="donor_state"]');
        
        if (campoRua) campoRua.value = dados.logradouro || '';
        if (campoBairro) campoBairro.value = dados.bairro || '';
        if (campoCidade) campoCidade.value = dados.localidade || '';
        if (campoEstado) campoEstado.value = dados.uf || '';
        
        const infoEndereco = document.getElementById('address-info');
        if (infoEndereco) {
            infoEndereco.style.display = 'block';
        }
        
        return {
            rua: dados.logradouro,
            bairro: dados.bairro,
            cidade: dados.localidade,
            estado: dados.uf
        };
    } catch (error) {
        console.log('Erro ao buscar endereço:', error);
        mostrarMensagem('Erro ao buscar endereço pelo CEP', 'error');
        return null;
    }
}


async function processarPagamento(dadosDoacao) {
    const { valor, metodo, projetoId } = dadosDoacao;
    
    try {
        switch (metodo) {
            case 'pix':
                return await processarPagamentoPix(valor, projetoId);
            case 'credit_card':
                return await processarPagamentoCartao(dadosDoacao);
            case 'boleto':
                return await processarPagamentoBoleto(valor, projetoId);
            default:
                throw new Error('Método de pagamento inválido');
        }
    } catch (error) {
        throw new Error(`Erro no processamento: ${error.message}`);
    }
}


async function processarPagamentoPix(valor, projetoId) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const chavePix = gerarChavePix();
            const qrCode = gerarQRCodePix(valor, chavePix);
            
            resolve({
                status: 'pendente',
                metodo: 'pix',
                chavePix: chavePix,
                qrCode: qrCode,
                expiraEm: 30, 
                transacaoId: gerarIdTransacao()
            });
        }, 1000);
    });
}


async function processarPagamentoCartao(dadosDoacao) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (validarCartaoCredito(dadosDoacao.numeroCartao)) {
                resolve({
                    status: 'aprovado',
                    metodo: 'cartao_credito',
                    transacaoId: gerarIdTransacao(),
                    parcelas: 1,
                    codigoAprovacao: Math.random().toString(36).substring(7).toUpperCase()
                });
            } else {
                reject(new Error('Cartão inválido ou recusado'));
            }
        }, 2000);
    });
}


async function processarPagamentoBoleto(valor, projetoId) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                status: 'pendente',
                metodo: 'boleto',
                urlBoleto: `https://example.com/boleto/${gerarIdTransacao()}.pdf`,
                dataVencimento: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                transacaoId: gerarIdTransacao()
            });
        }, 1500);
    });
}


function gerarChavePix() {
    return Math.random().toString(36).substring(2, 15) + '@pix.com.br';
}

function gerarQRCodePix(valor, chave) {
   
    return `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="black"/><text x="50" y="50" fill="white" text-anchor="middle">QR</text></svg>')}`;
}

function gerarIdTransacao() {
    return 'TXN' + Date.now() + Math.random().toString(36).substring(2, 9).toUpperCase();
}

function validarCartaoCredito(numero) {
    
    if (!numero) return false;
    
    const numeroLimpo = numero.replace(/\D/g, '');
    if (numeroLimpo.length < 13 || numeroLimpo.length > 19) return false;
    
    let soma = 0;
    let alternar = false;
    
    for (let i = numeroLimpo.length - 1; i >= 0; i--) {
        let digito = parseInt(numeroLimpo.charAt(i));
        
        if (alternar) {
            digito *= 2;
            if (digito > 9) {
                digito = (digito % 10) + 1;
            }
        }
        
        soma += digito;
        alternar = !alternar;
    }
    
    return (soma % 10) === 0;
}

function enviarConfirmacaoDoacao(email, nome, valor, tituloProjeto) {
    
    console.log(`Email de confirmação enviado para ${email}:`);
    console.log(`Caro ${nome}, obrigado por doar R$ ${formatarDinheiro(valor)} para "${tituloProjeto}"`);
    
    // Em uma implementação real, aqui seria feita a integração com serviços como:
    // - EmailJS
    // - SendGrid
    // - Amazon SES
    // - Mailgun
}


function carregarMaisProjetos() {
    mostrarMensagem('Carregando mais projetos...', 'success');
    
    
    setTimeout(() => {
        mostrarMensagem('Todos os projetos foram carregados.', 'success');
    }, 1000);
}


function configurarBusca() {
    const inputBusca = document.createElement('input');
    inputBusca.type = 'text';
    inputBusca.placeholder = 'Buscar projetos...';
    inputBusca.className = 'search-input';
    
    Object.assign(inputBusca.style, {
        padding: '0.5rem 1rem',
        border: '2px solid #e9ecef',
        borderRadius: '25px',
        marginBottom: '1rem',
        width: '100%',
        maxWidth: '300px',
        fontSize: '1rem'
    });
    
    const filtrosProjetos = document.querySelector('.projects-filter');
    if (filtrosProjetos) {
        filtrosProjetos.parentNode.insertBefore(inputBusca, filtrosProjetos);
    }
    
    inputBusca.addEventListener('input', function(e) {
        const termoBusca = e.target.value.toLowerCase();
        filtrarProjetosPorBusca(termoBusca);
    });
}

function filtrarProjetosPorBusca(termo) {
    const cartoesProjetos = document.querySelectorAll('.project-card');
    
    cartoesProjetos.forEach(cartao => {
        const titulo = cartao.querySelector('.project-title')?.textContent?.toLowerCase() || '';
        const descricao = cartao.querySelector('.project-description')?.textContent?.toLowerCase() || '';
        const categoria = cartao.dataset.category?.toLowerCase() || '';
        
        const corresponde = titulo.includes(termo) || 
                           descricao.includes(termo) || 
                           categoria.includes(termo);
        
        cartao.style.display = corresponde ? 'block' : 'none';
    });
}

// Animações das barras de progresso
function animarBarrasProgresso() {
    const barrasProgresso = document.querySelectorAll('.progress-fill');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const barraProgresso = entry.target;
                const largura = barraProgresso.style.width;
                barraProgresso.style.width = '0%';
                
                setTimeout(() => {
                    barraProgresso.style.transition = 'width 1.5s ease-out';
                    barraProgresso.style.width = largura;
                }, 200);
                
                observer.unobserve(barraProgresso);
            }
        });
    });
    
    barrasProgresso.forEach(barra => observer.observe(barra));
}

// Sistema de notificações melhorado
class SistemaNotificacoes {
    constructor() {
        this.notificacoes = [];
        this.container = this.criarContainer();
    }
    
    criarContainer() {
        const container = document.createElement('div');
        container.className = 'notifications-container';
        Object.assign(container.style, {
            position: 'fixed',
            top: '80px',
            right: '20px',
            zIndex: '3000',
            maxWidth: '350px'
        });
        document.body.appendChild(container);
        return container;
    }
    
    mostrar(mensagem, tipo = 'info', duracao = 5000) {
        const notificacao = document.createElement('div');
        notificacao.className = `notification notification-${tipo}`;
        
        Object.assign(notificacao.style, {
            background: 'white',
            borderLeft: `4px solid ${this.obterCorPorTipo(tipo)}`,
            padding: '1rem',
            marginBottom: '0.5rem',
            borderRadius: '5px',
            boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
            transform: 'translateX(100%)',
            transition: 'all 0.3s ease'
        });
        
        notificacao.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="${this.obterIconePorTipo(tipo)}" style="color: ${this.obterCorPorTipo(tipo)};"></i>
                <span>${mensagem}</span>
                <button onclick="this.parentElement.parentElement.remove()" style="margin-left: auto; background: none; border: none; cursor: pointer; font-size: 1.2rem;">&times;</button>
            </div>
        `;
        
        this.container.appendChild(notificacao);
        
        // Animar entrada
        setTimeout(() => {
            notificacao.style.transform = 'translateX(0)';
        }, 100);
        
        // Remover automaticamente
        setTimeout(() => {
            notificacao.style.transform = 'translateX(100%)';
            setTimeout(() => notificacao.remove(), 300);
        }, duracao);
    }
    
    obterCorPorTipo(tipo) {
        const cores = {
            'success': '#28a745',
            'error': '#dc3545',
            'warning': '#ffc107',
            'info': '#007bff'
        };
        return cores[tipo] || cores.info;
    }
    
    obterIconePorTipo(tipo) {
        const icones = {
            'success': 'fas fa-check-circle',
            'error': 'fas fa-exclamation-circle',
            'warning': 'fas fa-exclamation-triangle',
            'info': 'fas fa-info-circle'
        };
        return icones[tipo] || icones.info;
    }
}

// Inicializar sistema de notificações
const sistemaNotificacoes = new SistemaNotificacoes();

// Atualizar função mostrarMensagem para usar o novo sistema
function mostrarMensagem(texto, tipo) {
    sistemaNotificacoes.mostrar(texto, tipo);
}

// Inicialização final
document.addEventListener('DOMContentLoaded', function() {
    // Configurar busca
    setTimeout(() => {
        configurarBusca();
    }, 1000);
    
    // Animar barras de progresso
    setTimeout(() => {
        animarBarrasProgresso();
    }, 1500);
});

// Monitoramento de performance
function monitorarPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const tempoCarregamento = performance.now();
            console.log(`Página carregada em ${tempoCarregamento.toFixed(2)}ms`);
            
            // Rastrear engajamento do usuário
            let profundidadeScroll = 0;
            window.addEventListener('scroll', () => {
                const scrollAtual = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
                if (scrollAtual > profundidadeScroll) {
                    profundidadeScroll = scrollAtual;
                }
            });
            
            // Enviar analytics quando usuário sair
            window.addEventListener('beforeunload', () => {
                console.log(`Profundidade máxima de scroll: ${profundidadeScroll}%`);
            });
        });
    }
}