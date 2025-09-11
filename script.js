// Global Variables
let projects = [];
let currentFilter = 'all';
let projectIdCounter = 1;

// Sample initial data
const sampleProjects = [
    {
        id: 1,
        title: "Cirurgia de Emergência para João",
        description: "João, de 8 anos, precisa de uma cirurgia cardíaca urgente. Sua família não tem recursos para custear o procedimento.",
        category: "saude",
        goal: 50000,
        raised: 32000,
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        donors: 156,
        daysLeft: 15
    },
    {
        id: 2,
        title: "Reforma da Escola Rural",
        description: "Nossa escola rural precisa de reformas urgentes no telhado e nas salas de aula para continuar funcionando.",
        category: "educacao",
        goal: 25000,
        raised: 18500,
        image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        donors: 89,
        daysLeft: 30
    },
    {
        id: 3,
        title: "Resgate de Animais Abandonados",
        description: "ONG que resgata animais abandonados precisa de recursos para medicamentos e ração.",
        category: "animal",
        goal: 15000,
        raised: 12000,
        image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        donors: 203,
        daysLeft: 45
    },
    {
        id: 4,
        title: "Família Desabrigada pelo Temporal",
        description: "Família perdeu tudo em enchente e precisa de ajuda para reconstruir sua casa e comprar móveis básicos.",
        category: "emergencia",
        goal: 30000,
        raised: 8000,
        image: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        donors: 45,
        daysLeft: 60
    },
    {
        id: 5,
        title: "Equipamentos para Time de Futebol",
        description: "Time de futebol infantil da comunidade precisa de uniformes e equipamentos para participar do campeonato.",
        category: "esporte",
        goal: 8000,
        raised: 6200,
        image: "https://images.unsplash.com/photo-1556056504-5c7696c4c28d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        donors: 67,
        daysLeft: 20
    },
    {
        id: 6,
        title: "Festival de Arte na Comunidade",
        description: "Organização de festival cultural para promover artistas locais e fortalecer a cultura da região.",
        category: "cultura",
        goal: 12000,
        raised: 4500,
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        donors: 34,
        daysLeft: 40
    }
    
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadProjects();
    updateStats();
    fetchQuoteOfTheDay();
});

// Initialize the application
function initializeApp() {
    // Load projects from localStorage or use sample data
    const savedProjects = localStorage.getItem('projects');
    if (savedProjects) {
        projects = JSON.parse(savedProjects);
        projectIdCounter = Math.max(...projects.map(p => p.id)) + 1;
    } else {
        projects = [...sampleProjects];
        projectIdCounter = sampleProjects.length + 1;
        saveProjects();
    }
}

// Setup event listeners
function setupEventListeners() {
    // Mobile navigation toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking on links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Project filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.filter;
            renderProjects();
        });
    });

    // Form submissions
    const createProjectForm = document.getElementById('create-project-form');
    createProjectForm.addEventListener('submit', handleCreateProject);

    const donationForm = document.getElementById('donation-form');
    donationForm.addEventListener('submit', handleDonation);

    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', handleContactForm);

    // Donation amount buttons
    document.querySelectorAll('.amount-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            document.querySelector('input[name="amount"]').value = this.dataset.amount;
        });
    });

    // Custom amount input
    document.querySelector('input[name="amount"]').addEventListener('input', function() {
        if (this.value) {
            document.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('selected'));
        }
    });

    // Smooth scrolling for anchor links
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

    // Window scroll event for navbar
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = '#fff';
            header.style.backdropFilter = 'none';
        }
    });
}

// Load and render projects
function loadProjects() {
    renderProjects();
}

function renderProjects() {
    const projectsGrid = document.getElementById('projects-grid');
    const filteredProjects = currentFilter === 'all' 
        ? projects 
        : projects.filter(project => project.category === currentFilter);

    projectsGrid.innerHTML = filteredProjects.map(project => {
        const progressPercentage = Math.min((project.raised / project.goal) * 100, 100);
        const categoryNames = {
            'saude': 'Saúde',
            'educacao': 'Educação',
            'animal': 'Animais',
            'emergencia': 'Emergência',
            'esporte': 'Esporte',
            'cultura': 'Cultura'
        };

        return `
            <div class="project-card" data-category="${project.category}">
                <div class="project-image" style="background-image: url('${project.image}')">
                    <span class="project-category">${categoryNames[project.category]}</span>
                </div>
                <div class="project-content">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="project-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progressPercentage}%"></div>
                        </div>
                    </div>
                    <div class="project-stats">
                        <span class="raised">R$ ${formatMoney(project.raised)} arrecadado</span>
                        <span class="goal">Meta: R$ ${formatMoney(project.goal)}</span>
                    </div>
                    <div class="project-stats">
                        <span>${project.donors} doadores</span>
                        <span>${project.daysLeft} dias restantes</span>
                    </div>
                    <div class="project-actions">
                        <button class="btn-secondary" onclick="shareProject(${project.id})">
                            <i class="fas fa-share-alt"></i> Compartilhar
                        </button>
                        <button class="btn-donate" onclick="openDonationModal(${project.id})">
                            <i class="fas fa-heart"></i> Doar
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Handle create project form
function handleCreateProject(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const newProject = {
        id: projectIdCounter++,
        title: formData.get('title'),
        description: formData.get('description'),
        category: formData.get('category'),
        goal: parseInt(formData.get('goal')),
        raised: 0,
        image: formData.get('image') || getDefaultImage(formData.get('category')),
        donors: 0,
        daysLeft: 60
    };

    projects.unshift(newProject);
    saveProjects();
    renderProjects();
    updateStats();
    closeModal();
    
    showMessage('Projeto criado com sucesso!', 'success');
    e.target.reset();
}

// Handle donation
function handleDonation(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const projectId = parseInt(document.getElementById('donation-modal').dataset.projectId);
    const amount = parseFloat(formData.get('amount'));
    const donorName = formData.get('donor_name');
    const donorEmail = formData.get('donor_email');
    const message = formData.get('message');

    if (!amount || amount <= 0) {
        showMessage('Por favor, insira um valor válido para a doação.', 'error');
        return;
    }

    const project = projects.find(p => p.id === projectId);
    if (project) {
        project.raised += amount;
        project.donors += 1;
        
        // Simulate payment processing
        const submitButton = e.target.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<span class="loading"></span> Processando...';
        submitButton.disabled = true;

        setTimeout(() => {
            saveProjects();
            renderProjects();
            updateStats();
            closeDonationModal();
            
            showMessage(`Obrigado, ${donorName}! Sua doação de R$ ${formatMoney(amount)} foi processada com sucesso.`, 'success');
            
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            e.target.reset();
            
            // Send confirmation email (simulation)
            sendDonationConfirmation(donorEmail, donorName, amount, project.title);
        }, 2000);
    }
}

// Handle contact form
function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    submitButton.innerHTML = '<span class="loading"></span> Enviando...';
    submitButton.disabled = true;

    // Simulate email sending
    setTimeout(() => {
        showMessage('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        e.target.reset();
    }, 1500);
}

// Modal functions
function openModal() {
    document.getElementById('project-modal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('project-modal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function openDonationModal(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const modal = document.getElementById('donation-modal');
    const projectInfo = document.getElementById('donation-project-info');
    
    projectInfo.innerHTML = `
        <h3>${project.title}</h3>
        <p>Meta: R$ ${formatMoney(project.goal)} | Arrecadado: R$ ${formatMoney(project.raised)}</p>
    `;
    
    modal.dataset.projectId = projectId;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeDonationModal() {
    document.getElementById('donation-modal').style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Reset form
    document.getElementById('donation-form').reset();
    document.querySelectorAll('.amount-btn').forEach(btn => btn.classList.remove('selected'));
}

// Close modals when clicking outside
window.addEventListener('click', function(e) {
    const projectModal = document.getElementById('project-modal');
    const donationModal = document.getElementById('donation-modal');
    
    if (e.target === projectModal) {
        closeModal();
    }
    if (e.target === donationModal) {
        closeDonationModal();
    }
});

// Utility functions
function formatMoney(amount) {
    return new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

function getDefaultImage(category) {
    const defaultImages = {
        'saude': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        'educacao': 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        'animal': 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        'emergencia': 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        'esporte': 'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        'cultura': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    };
    return defaultImages[category] || defaultImages['saude'];
}

function saveProjects() {
    // In a real application, this would save to localStorage
    // Since we can't use localStorage in artifacts, we'll simulate it
    console.log('Projects saved:', projects);
}

function updateStats() {
    const totalDonated = projects.reduce((sum, project) => sum + project.raised, 0);
    const totalProjects = projects.length;
    const totalDonors = projects.reduce((sum, project) => sum + project.donors, 0);

    // Animate counters
    animateCounter('total-donated', 0, totalDonated, 'currency');
    animateCounter('total-projects', 0, totalProjects, 'number');
    animateCounter('total-donors', 0, totalDonors, 'number');
}

function animateCounter(elementId, start, end, type) {
    const element = document.getElementById(elementId);
    const duration = 2000;
    const increment = (end - start) / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            current = end;
            clearInterval(timer);
        }

        if (type === 'currency') {
            element.textContent = `R$ ${formatMoney(Math.floor(current))}`;
        } else {
            element.textContent = Math.floor(current).toLocaleString('pt-BR');
        }
    }, 16);
}

function shareProject(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    if (navigator.share) {
        navigator.share({
            title: project.title,
            text: project.description,
            url: `${window.location.origin}#project-${projectId}`
        });
    } else {
        // Fallback: copy to clipboard
        const url = `${window.location.origin}#project-${projectId}`;
        navigator.clipboard.writeText(url).then(() => {
            showMessage('Link copiado para a área de transferência!', 'success');
        });
    }
}

function loadMoreProjects() {
    // Simulate loading more projects
    showMessage('Carregando mais projetos...', 'success');
    
    // In a real app, this would fetch more data from API
    setTimeout(() => {
        showMessage('Todos os projetos foram carregados.', 'success');
    }, 1000);
}

function showMessage(text, type) {
    // Remove existing messages
    document.querySelectorAll('.message').forEach(msg => msg.remove());

    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.textContent = text;
    
    document.body.appendChild(message);
    message.style.position = 'fixed';
    message.style.top = '100px';
    message.style.right = '20px';
    message.style.zIndex = '3000';
    message.style.maxWidth = '300px';

    setTimeout(() => {
        message.remove();
    }, 5000);
}

function sendDonationConfirmation(email, name, amount, projectTitle) {
    // Simulate sending confirmation email
    console.log(`Confirmation email sent to ${email}:`);
    console.log(`Dear ${name}, thank you for donating R$ ${formatMoney(amount)} to "${projectTitle}"`);
}

// Fetch quote of the day (using a free API)
async function fetchQuoteOfTheDay() {
    try {
        const response = await fetch('https://api.quotable.io/random');
        const data = await response.json();
        
        // Add quote to footer or hero section
        const quoteElement = document.createElement('div');
        quoteElement.className = 'daily-quote';
        quoteElement.innerHTML = `
            <p><em>"${data.content}"</em></p>
            <small>— ${data.author}</small>
        `;
        
        // Add to hero section
        const heroContainer = document.querySelector('.hero-container');
        if (heroContainer) {
            quoteElement.style.marginTop = '2rem';
            quoteElement.style.fontStyle = 'italic';
            quoteElement.style.opacity = '0.8';
            quoteElement.style.textAlign = 'center';
            heroContainer.appendChild(quoteElement);
        }
    } catch (error) {
        console.log('Could not fetch quote of the day:', error);
    }
}

// Weather widget (using a free weather API)
async function fetchWeatherData() {
    try {
        // Using wttr.in API for weather (no API key required)
        const response = await fetch('https://wttr.in/SaoPaulo?format=j1');
        const data = await response.json();
        
        const weather = data.current_condition[0];
        const temp = weather.temp_C;
        const desc = weather.weatherDesc[0].value;
        
        const weatherWidget = document.createElement('div');
        weatherWidget.className = 'weather-widget';
        weatherWidget.innerHTML = `
            <div class="weather-info">
                <i class="fas fa-thermometer-half"></i>
                <span>${temp}°C - ${desc}</span>
            </div>
        `;
        
        // Add weather to navbar
        const navContainer = document.querySelector('.nav-container');
        if (navContainer && window.innerWidth > 768) {
            weatherWidget.style.fontSize = '0.9rem';
            weatherWidget.style.color = '#666';
            navContainer.appendChild(weatherWidget);
        }
    } catch (error) {
        console.log('Could not fetch weather data:', error);
    }
}

// Initialize weather when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Only load weather on desktop to avoid clutter
    if (window.innerWidth > 768) {
        fetchWeatherData();
    }
});

// Advanced search functionality
function setupSearchFunctionality() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Buscar projetos...';
    searchInput.className = 'search-input';
    searchInput.style.cssText = `
        padding: 0.5rem 1rem;
        border: 2px solid #e9ecef;
        border-radius: 25px;
        margin-bottom: 1rem;
        width: 100%;
        max-width: 300px;
        font-size: 1rem;
    `;
    
    const projectsFilter = document.querySelector('.projects-filter');
    if (projectsFilter) {
        projectsFilter.parentNode.insertBefore(searchInput, projectsFilter);
    }
    
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        filterProjectsBySearch(searchTerm);
    });
}

function filterProjectsBySearch(searchTerm) {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        const title = card.querySelector('.project-title').textContent.toLowerCase();
        const description = card.querySelector('.project-description').textContent.toLowerCase();
        const category = card.dataset.category.toLowerCase();
        
        const matches = title.includes(searchTerm) || 
                       description.includes(searchTerm) || 
                       category.includes(searchTerm);
        
        card.style.display = matches ? 'block' : 'none';
    });
}

// Donation progress animation
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressFill = entry.target;
                const width = progressFill.style.width;
                progressFill.style.width = '0%';
                
                setTimeout(() => {
                    progressFill.style.transition = 'width 1.5s ease-out';
                    progressFill.style.width = width;
                }, 200);
                
                observer.unobserve(progressFill);
            }
        });
    });
    
    progressBars.forEach(bar => observer.observe(bar));
}

// Initialize search functionality
document.addEventListener('DOMContentLoaded', function() {
    setupSearchFunctionality();
    
    // Animate progress bars when they come into view
    setTimeout(() => {
        animateProgressBars();
    }, 1000);
});

// Social media sharing
function shareOnSocialMedia(platform, projectId) {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    
    const url = encodeURIComponent(`${window.location.origin}#project-${projectId}`);
    const text = encodeURIComponent(`Ajude: ${project.title}`);
    
    let shareUrl = '';
    
    switch (platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
            break;
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${text}%20${url}`;
            break;
        case 'telegram':
            shareUrl = `https://t.me/share/url?url=${url}&text=${text}`;
            break;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
}

// Enhanced project card with social sharing
function createEnhancedProjectCard(project) {
    const progressPercentage = Math.min((project.raised / project.goal) * 100, 100);
    const categoryNames = {
        'saude': 'Saúde',
        'educacao': 'Educação',
        'animal': 'Animais',
        'emergencia': 'Emergência',
        'esporte': 'Esporte',
        'cultura': 'Cultura'
    };

    return `
        <div class="project-card" data-category="${project.category}">
            <div class="project-image" style="background-image: url('${project.image}')">
                <span class="project-category">${categoryNames[project.category]}</span>
                <div class="project-social-share">
                    <button onclick="shareOnSocialMedia('facebook', ${project.id})" title="Compartilhar no Facebook">
                        <i class="fab fa-facebook-f"></i>
                    </button>
                    <button onclick="shareOnSocialMedia('twitter', ${project.id})" title="Compartilhar no Twitter">
                        <i class="fab fa-twitter"></i>
                    </button>
                    <button onclick="shareOnSocialMedia('whatsapp', ${project.id})" title="Compartilhar no WhatsApp">
                        <i class="fab fa-whatsapp"></i>
                    </button>
                </div>
            </div>
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progressPercentage}%"></div>
                    </div>
                </div>
                <div class="project-stats">
                    <span class="raised">R$ ${formatMoney(project.raised)} arrecadado</span>
                    <span class="goal">Meta: R$ ${formatMoney(project.goal)}</span>
                </div>
                <div class="project-stats">
                    <span>${project.donors} doadores</span>
                    <span>${project.daysLeft} dias restantes</span>
                </div>
                <div class="project-actions">
                    <button class="btn-secondary" onclick="shareProject(${project.id})">
                        <i class="fas fa-share-alt"></i> Compartilhar
                    </button>
                    <button class="btn-donate" onclick="openDonationModal(${project.id})">
                        <i class="fas fa-heart"></i> Doar
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Notification system
class NotificationSystem {
    constructor() {
        this.notifications = [];
        this.container = this.createContainer();
    }
    
    createContainer() {
        const container = document.createElement('div');
        container.className = 'notifications-container';
        container.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            z-index: 3000;
            max-width: 350px;
        `;
        document.body.appendChild(container);
        return container;
    }
    
    show(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            background: white;
            border-left: 4px solid ${this.getColorByType(type)};
            padding: 1rem;
            margin-bottom: 0.5rem;
            border-radius: 5px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="${this.getIconByType(type)}" style="color: ${this.getColorByType(type)};"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" style="margin-left: auto; background: none; border: none; cursor: pointer; font-size: 1.2rem;">&times;</button>
            </div>
        `;
        
        this.container.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }
    
    getColorByType(type) {
        const colors = {
            'success': '#28a745',
            'error': '#dc3545',
            'warning': '#ffc107',
            'info': '#007bff'
        };
        return colors[type] || colors.info;
    }
    
    getIconByType(type) {
        const icons = {
            'success': 'fas fa-check-circle',
            'error': 'fas fa-exclamation-circle',
            'warning': 'fas fa-exclamation-triangle',
            'info': 'fas fa-info-circle'
        };
        return icons[type] || icons.info;
    }
}

// Initialize notification system
const notifications = new NotificationSystem();

// Update showMessage function to use new notification system
function showMessage(text, type) {
    notifications.show(text, type);
}

// Dark mode toggle
function setupDarkMode() {
    const darkModeToggle = document.createElement('button');
    darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    darkModeToggle.className = 'dark-mode-toggle';
    darkModeToggle.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #007bff;
        color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        cursor: pointer;
        box-shadow: 0 5px 15px rgba(0,123,255,0.3);
        transition: all 0.3s;
        z-index: 1000;
    `;
    
    darkModeToggle.addEventListener('click', toggleDarkMode);
    document.body.appendChild(darkModeToggle);
    
    // Load saved dark mode preference
    if (localStorage.getItem('darkMode') === 'enabled') {
        enableDarkMode();
    }
}

function toggleDarkMode() {
    const darkModeEnabled = document.body.classList.contains('dark-mode');
    
    if (darkModeEnabled) {
        disableDarkMode();
    } else {
        enableDarkMode();
    }
}

function enableDarkMode() {
    document.body.classList.add('dark-mode');
    localStorage.setItem('darkMode', 'enabled');
    
    const toggle = document.querySelector('.dark-mode-toggle');
    if (toggle) {
        toggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
}

function disableDarkMode() {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('darkMode', 'disabled');
    
    const toggle = document.querySelector('.dark-mode-toggle');
    if (toggle) {
        toggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
}

// Initialize dark mode
document.addEventListener('DOMContentLoaded', function() {
    setupDarkMode();
});

// Lazy loading for images
function setupLazyLoading() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.backgroundImage = img.dataset.bg;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('.project-image.lazy').forEach(img => {
        imageObserver.observe(img);
    });
}

// Performance monitoring
function trackPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
            
            // Track user engagement
            let scrollDepth = 0;
            window.addEventListener('scroll', () => {
                const currentScroll = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
                if (currentScroll > scrollDepth) {
                    scrollDepth = currentScroll;
                }
            });
            
            // Send analytics when user leaves
            window.addEventListener('beforeunload', () => {
                console.log(`Max scroll depth: ${scrollDepth}%`);
            });
        });
    }
}

// Initialize performance tracking
trackPerformance();

// Service Worker registration (for offline functionality)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker registered successfully');
            })
            .catch(error => {
                console.log('Service Worker registration failed');
            });
    });
}