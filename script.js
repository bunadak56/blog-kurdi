// DOM yüklendikten sonra çalışacak kodlar
document.addEventListener('DOMContentLoaded', function() {
    // Lazy loading için görüntüleri yükle
    lazyLoadImages();

    // Menü toggle fonksiyonunu çağır
    setupMobileMenu();

    // Arama fonksiyonunu çağır
    setupSearch();

    // Kategori filtreleme fonksiyonunu çağır
    setupCategoryFilter();

    // İletişim formu gönderme işlemini ayarla
    setupContactForm();

    // Sayfa kaydırma animasyonunu ayarla
    setupSmoothScroll();
});

// Lazy loading fonksiyonu
function lazyLoadImages() {
    const images = document.querySelectorAll('.lazy-load');
    const options = {
        threshold: 0.5,
        rootMargin: "0px 0px 100px 0px"
    };

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('is-loaded');
                observer.unobserve(img);
            }
        });
    }, options);

    images.forEach(img => imageObserver.observe(img));
}

// Mobil menü toggle fonksiyonu
function setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav ul');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('show');
        });
    }
}

// Arama fonksiyonu
function setupSearch() {
    const searchForm = document.querySelector('.search-box');
    const searchInput = document.querySelector('.search-box input');

    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                // Burada arama işlemi yapılabilir, örneğin:
                console.log(`Aranan terim: ${searchTerm}`);
                // Gerçek bir uygulamada, burada sunucuya bir istek gönderilebilir
            }
        });
    }
}

// Kategori filtreleme fonksiyonu
function setupCategoryFilter() {
    const categoryButtons = document.querySelectorAll('.category-item');
    const posts = document.querySelectorAll('.post-item');

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;
            posts.forEach(post => {
                if (category === 'all' || post.dataset.category === category) {
                    post.style.display = 'block';
                } else {
                    post.style.display = 'none';
                }
            });
        });
    });
}

// İletişim formu gönderme işlemi
function setupContactForm() {
    const form = document.getElementById('contact-form');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            // Burada form verilerini işleyebilir veya bir API'ye gönderebilirsiniz
            console.log('Form gönderildi:', Object.fromEntries(formData));
            // Formu temizle
            form.reset();
            // Kullanıcıya bir geri bildirim göster
            alert('Mesajınız başarıyla gönderildi!');
        });
    }
}

// Sayfa içi yumuşak kaydırma
function setupSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Sayfa yüklenme hızını ölçme
const pageLoadTime = () => {
    window.addEventListener('load', () => {
        const timing = window.performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        console.log(`Sayfa yüklenme süresi: ${loadTime} ms`);
    });
};

// Sonsuz kaydırma (Infinite scroll) fonksiyonu
function setupInfiniteScroll() {
    let page = 1;
    const container = document.querySelector('.post-grid');
    const loading = document.createElement('div');
    loading.className = 'loading';
    loading.textContent = 'Yükleniyor...';

    window.addEventListener('scroll', () => {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 500 && !loading.parentNode) {
            container.appendChild(loading);
            fetchMorePosts();
        }
    });

    function fetchMorePosts() {
        // Burada gerçek bir API çağrısı yapılabilir
        setTimeout(() => {
            // Örnek veri
            const newPosts = [
                { title: 'Yeni Gönderi 1', excerpt: 'Lorem ipsum dolor sit amet...' },
                { title: 'Yeni Gönderi 2', excerpt: 'Consectetur adipiscing elit...' },
                { title: 'Yeni Gönderi 3', excerpt: 'Sed do eiusmod tempor incididunt...' }
            ];

            newPosts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.className = 'post-item';
                postElement.innerHTML = `
                    <h3>${post.title}</h3>
                    <p>${post.excerpt}</p>
                `;
                container.appendChild(postElement);
            });

            container.removeChild(loading);
            page++;
        }, 1000); // 1 saniye gecikme ile yeni gönderiler yükleniyor
    }
}

// Tema değiştirme fonksiyonu
function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-theme');
            const isDarkTheme = body.classList.contains('dark-theme');
            localStorage.setItem('dark-theme', isDarkTheme);
            updateThemeToggleText(isDarkTheme);
        });

        // Sayfa yüklendiğinde tema tercihini kontrol et
        const savedTheme = localStorage.getItem('dark-theme');
        if (savedTheme === 'true') {
            body.classList.add('dark-theme');
            updateThemeToggleText(true);
        }
    }

    function updateThemeToggleText(isDarkTheme) {
        themeToggle.textContent = isDarkTheme ? 'Açık Tema' : 'Koyu Tema';
    }
}

// Yorum sistemi
function setupCommentSystem() {
    const commentForm = document.getElementById('comment-form');
    const commentsContainer = document.getElementById('comments-container');

    if (commentForm && commentsContainer) {
        commentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameInput = commentForm.querySelector('#comment-name');
            const contentInput = commentForm.querySelector('#comment-content');

            if (nameInput.value && contentInput.value) {
                addComment(nameInput.value, contentInput.value);
                nameInput.value = '';
                contentInput.value = '';
            }
        });
    }

    function addComment(name, content) {
        const commentElement = document.createElement('div');
        commentElement.className = 'comment';
        commentElement.innerHTML = `
            <h4>${name}</h4>
            <p>${content}</p>
            <small>${new Date().toLocaleString()}</small>
        `;
        commentsContainer.appendChild(commentElement);
    }
}

// Sayfa yüklendiğinde tüm fonksiyonları çalıştır
document.addEventListener('DOMContentLoaded', () => {
    pageLoadTime();
    setupInfiniteScroll();
    setupThemeToggle();
    setupCommentSystem();
});
// CSRF token yönetimi
function setupCSRFProtection() {
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    
    // Tüm AJAX isteklerine CSRF token'ı ekle
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
}

// XSS koruması için input sanitizasyonu
function sanitizeInput(input) {
    const map = {
        '&': '&amp;',
        '<': '<',
        '>': '>',
        '"': '&quot;',
        "'": '&#x27;',
        "/": '&#x2F;',
    };
    const reg = /[&<>"'/]/ig;
    return input.replace(reg, (match)=>(map[match]));
}

// Rate limiting
const rateLimiter = {
    timestamps: {},
    limit: 5,
    interval: 60000, // 1 dakika

    check: function(action) {
        const now = Date.now();
        if (!this.timestamps[action]) {
            this.timestamps[action] = [now];
            return true;
        }

        const recentTimestamps = this.timestamps[action].filter(timestamp => now - timestamp < this.interval);
        
        if (recentTimestamps.length < this.limit) {
            recentTimestamps.push(now);
            this.timestamps[action] = recentTimestamps;
            return true;
        }

        return false;
    }
};

// Performans optimizasyonu: Debounce fonksiyonu
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performans optimizasyonu: Sayfa içi önbelleğe alma
const pageCache = {
    data: {},
    set: function(key, value, ttl) {
        const now = Date.now();
        this.data[key] = {
            value: value,
            expiry: now + ttl
        };
    },
    get: function(key) {
        const now = Date.now();
        if (this.data[key] && this.data[key].expiry > now) {
            return this.data[key].value;
        }
        return null;
    }
};

// Web Worker kullanımı
function setupWebWorker() {
    if (window.Worker) {
        const worker = new Worker('worker.js');
        
        worker.postMessage({action: 'start', data: 'some data'});
        
        worker.onmessage = function(e) {
            console.log('Worker\'dan gelen mesaj:', e.data);
        };
    }
}

// Service Worker kayıt işlemi
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
                console.log('ServiceWorker kaydı başarılı:', registration.scope);
            }, function(err) {
                console.log('ServiceWorker kaydı başarısız:', err);
            });
        });
    }
}

// Tüm optimizasyon ve güvenlik önlemlerini uygula
document.addEventListener('DOMContentLoaded', () => {
    setupCSRFProtection();
    setupWebWorker();
    registerServiceWorker();

    // Örnek kullanım: Rate limiting
    document.getElementById('submit-button').addEventListener('click', () => {
        if (rateLimiter.check('submit')) {
            // İşlemi gerçekleştir
            console.log('İşlem gerçekleştirildi');
        } else {
            console.log('Çok fazla istek gönderdiniz. Lütfen bir süre bekleyin.');
        }
    });

    // Örnek kullanım: Debounce
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', debounce(() => {
        console.log('Arama yapılıyor:', searchInput.value);
    }, 300));

    // Örnek kullanım: Sayfa içi önbelleğe alma
    const fetchData = (url) => {
        const cachedData = pageCache.get(url);
        if (cachedData) {
            console.log('Önbellekten veri alındı:', cachedData);
            return Promise.resolve(cachedData);
        }

        return fetch(url)
            .then(response => response.json())
            .then(data => {
                pageCache.set(url, data, 60000); // 1 dakika TTL
                return data;
            });
    };

    fetchData('/api/data').then(data => {
        console.log('Veri alındı:', data);
    });
});

// Birim test çerçevesi (basit bir örnek)
const assert = {
    equal: function(actual, expected, message) {
        if (actual !== expected) {
            throw new Error(message || `Beklenen: ${expected}, Alınan: ${actual}`);
        }
    },
    notEqual: function(actual, expected, message) {
        if (actual === expected) {
            throw new Error(message || `${actual} beklenmeyen bir değer`);
        }
    },
    true: function(value, message) {
        if (!value) {
            throw new Error(message || `${value} true değil`);
        }
    },
    false: function(value, message) {
        if (value) {
            throw new Error(message || `${value} false değil`);
        }
    }
};

// Test suite
function runTests() {
    console.log('Testler başlatılıyor...');

    try {
        // sanitizeInput fonksiyonu testi
        assert.equal(sanitizeInput('<script>alert("XSS")</script>'), '<script>alert("XSS")</script>', 'sanitizeInput XSS koruması sağlamalı');

        // rateLimiter testi
        assert.true(rateLimiter.check('testAction'), 'İlk istek rate limit\'e takılmamalı');
        for (let i = 0; i < 5; i++) {
            rateLimiter.check('testAction');
        }
        assert.false(rateLimiter.check('testAction'), '6. istek rate limit\'e takılmalı');

        // pageCache testi
        pageCache.set('testKey', 'testValue', 1000);
        assert.equal(pageCache.get('testKey'), 'testValue', 'Cache\'den doğru değer alınmalı');
        
        setTimeout(() => {
            assert.equal(pageCache.get('testKey'), null, 'TTL sonrası cache değeri null olmalı');
        }, 1100);

        console.log('Tüm testler başarıyla geçti!');
    } catch (error) {
        console.error('Test hatası:', error.message);
    }
}

// Hata yakalama ve raporlama
function setupErrorHandling() {
    window.onerror = function(message, source, lineno, colno, error) {
        console.error('Yakalanan hata:', {
            message: message,
            source: source,
            lineno: lineno,
            colno: colno,
            error: error
        });
        // Burada hata loglama servisi çağrılabilir
        logError({message, source, lineno, colno, error});
        return true;
    };

    window.addEventListener('unhandledrejection', function(event) {
        console.error('İşlenmeyen Promise reddi:', event.reason);
        // Burada hata loglama servisi çağrılabilir
        logError({type: 'unhandledRejection', reason: event.reason});
    });
}

// Hata loglama (örnek implementasyon)
function logError(errorData) {
    // Gerçek bir uygulamada, bu fonksiyon hataları bir sunucuya gönderebilir
    console.log('Hata loglandı:', errorData);
    // Örnek: fetch('/api/log-error', { method: 'POST', body: JSON.stringify(errorData) });
}

// Performans ölçümü
function measurePerformance() {
    const performanceEntries = performance.getEntriesByType('navigation');
    if (performanceEntries.length > 0) {
        const navigationEntry = performanceEntries[0];
        console.log('Sayfa yüklenme metrikleri:', {
            dnsLookup: navigationEntry.domainLookupEnd - navigationEntry.domainLookupStart,
            tcpConnection: navigationEntry.connectEnd - navigationEntry.connectStart,
            serverResponse: navigationEntry.responseStart - navigationEntry.requestStart,
            domLoading: navigationEntry.domInteractive - navigationEntry.responseEnd,
            domInteractive: navigationEntry.domInteractive - navigationEntry.navigationStart,
            domComplete: navigationEntry.domComplete - navigationEntry.navigationStart
        });
    }
}

// Debug modu
const DEBUG = true;

function debug(...args) {
    if (DEBUG) {
        console.log('[DEBUG]', ...args);
    }
}

// Tüm test ve hata ayıklama fonksiyonlarını çalıştır
document.addEventListener('DOMContentLoaded', () => {
    setupErrorHandling();
    runTests();
    measurePerformance();

    // Debug kullanım örneği
    debug('Uygulama başlatıldı');

    // Örnek hata fırlatma (test için)
    setTimeout(() => {
        try {
            throw new Error('Örnek hata');
        } catch (error) {
            console.error('Yakalanan hata:', error);
        }
    }, 2000);
});

// Modül Deseni (Module Pattern) kullanarak uygulama yapısını oluşturma
const BlogApp = (function() {
    // Özel (private) değişkenler ve fonksiyonlar
    let currentUser = null;
    const API_URL = 'https://api.blogakurdi.com/v1';

    function fetchFromAPI(endpoint) {
        return fetch(`${API_URL}${endpoint}`)
            .then(response => response.json())
            .catch(error => console.error('API hatası:', error));
    }

    // Genel (public) API
    return {
        // Kullanıcı işlemleri
        User: {
            login: function(username, password) {
                // Gerçek uygulamada burada bir API çağrısı yapılır
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        if (username === 'admin' && password === 'password') {
                            currentUser = { username, role: 'admin' };
                            resolve(currentUser);
                        } else {
                            reject(new Error('Geçersiz kullanıcı adı veya şifre'));
                        }
                    }, 1000);
                });
            },
            logout: function() {
                currentUser = null;
                // Burada oturum kapatma işlemleri yapılır (örn. local storage temizleme)
            },
            getCurrentUser: function() {
                return currentUser;
            }
        },

        // Blog gönderileri işlemleri
        Posts: {
            getAll: function() {
                return fetchFromAPI('/posts');
            },
            getById: function(id) {
                return fetchFromAPI(`/posts/${id}`);
            },
            create: function(postData) {
                // Gerçek uygulamada burada bir POST isteği yapılır
                console.log('Yeni gönderi oluşturuluyor:', postData);
                return Promise.resolve({ id: Date.now(), ...postData });
            },
            update: function(id, postData) {
                // Gerçek uygulamada burada bir PUT isteği yapılır
                console.log(`${id} ID'li gönderi güncelleniyor:`, postData);
                return Promise.resolve({ id, ...postData });
            },
            delete: function(id) {
                // Gerçek uygulamada burada bir DELETE isteği yapılır
                console.log(`${id} ID'li gönderi siliniyor`);
                return Promise.resolve({ success: true });
            }
        },

        // Yorum işlemleri
        Comments: {
            getForPost: function(postId) {
                return fetchFromAPI(`/posts/${postId}/comments`);
            },
            create: function(postId, commentData) {
                // Gerçek uygulamada burada bir POST isteği yapılır
                console.log(`${postId} ID'li gönderiye yorum ekleniyor:`, commentData);
                return Promise.resolve({ id: Date.now(), postId, ...commentData });
            }
        },

        // UI işlemleri
        UI: {
            showNotification: function(message, type = 'info') {
                const notification = document.createElement('div');
                notification.textContent = message;
                notification.className = `notification ${type}`;
                document.body.appendChild(notification);
                setTimeout(() => {
                    notification.remove();
                }, 3000);
            },
            renderPosts: function(posts) {
                const container = document.getElementById('posts-container');
                container.innerHTML = '';
                posts.forEach(post => {
                    const postElement = document.createElement('div');
                    postElement.className = 'post';
                    postElement.innerHTML = `
                        <h2>${post.title}</h2>
                        <p>${post.content}</p>
                        <button class="read-more" data-id="${post.id}">Devamını Oku</button>
                    `;
                    container.appendChild(postElement);
                });
            }
        },

        // Uygulama başlatma
        init: function() {
            console.log('Blog uygulaması başlatılıyor...');
            this.bindEvents();
            this.Posts.getAll().then(posts => this.UI.renderPosts(posts));
        },

        // Olay dinleyicileri
        bindEvents: function() {
            document.getElementById('login-form').addEventListener('submit', (e) => {
                e.preventDefault();
                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;
                this.User.login(username, password)
                    .then(() => this.UI.showNotification('Giriş başarılı!', 'success'))
                    .catch(error => this.UI.showNotification(error.message, 'error'));
            });

            document.getElementById('posts-container').addEventListener('click', (e) => {
                if (e.target.classList.contains('read-more')) {
                    const postId = e.target.dataset.id;
                    this.Posts.getById(postId).then(post => {
                        // Burada tam gönderi içeriği gösterilebilir
                        console.log('Gönderi detayları:', post);
                    });
                }
            });
        }
    };
})();

// Uygulamayı başlat
document.addEventListener('DOMContentLoaded', () => {
    BlogApp.init();
});

// BlogApp modülüne yeni özellikler ekliyoruz
BlogApp.Categories = {
    getAll: function() {
        return fetchFromAPI('/categories');
    },
    create: function(categoryData) {
        // Gerçek uygulamada bir POST isteği yapılır
        console.log('Yeni kategori oluşturuluyor:', categoryData);
        return Promise.resolve({ id: Date.now(), ...categoryData });
    }
};

BlogApp.Tags = {
    getAll: function() {
        return fetchFromAPI('/tags');
    },
    create: function(tagData) {
        console.log('Yeni etiket oluşturuluyor:', tagData);
        return Promise.resolve({ id: Date.now(), ...tagData });
    }
};

BlogApp.Search = {
    performSearch: function(query) {
        return fetchFromAPI(`/search?q=${encodeURIComponent(query)}`);
    }
};

// UI modülüne yeni metodlar ekliyoruz
BlogApp.UI.renderCategories = function(categories) {
    const container = document.getElementById('categories-container');
    container.innerHTML = '';
    categories.forEach(category => {
        const categoryElement = document.createElement('div');
        categoryElement.className = 'category';
        categoryElement.innerHTML = `
            <h3>${category.name}</h3>
            <p>${category.description}</p>
        `;
        container.appendChild(categoryElement);
    });
};

BlogApp.UI.renderTags = function(tags) {
    const container = document.getElementById('tags-container');
    container.innerHTML = '';
    tags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = 'tag';
        tagElement.textContent = tag.name;
        container.appendChild(tagElement);
    });
};

BlogApp.UI.renderSearchResults = function(results) {
    const container = document.getElementById('search-results');
    container.innerHTML = '';
    results.forEach(result => {
        const resultElement = document.createElement('div');
        resultElement.className = 'search-result';
        resultElement.innerHTML = `
            <h3><a href="/post/${result.id}">${result.title}</a></h3>
            <p>${result.excerpt}</p>
        `;
        container.appendChild(resultElement);
    });
};

// Yeni özellikler için olay dinleyicileri ekliyoruz
BlogApp.bindEvents = function() {
    // ... Önceki olay dinleyicileri ...

    document.getElementById('category-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const categoryName = document.getElementById('category-name').value;
        const categoryDescription = document.getElementById('category-description').value;
        this.Categories.create({ name: categoryName, description: categoryDescription })
            .then(() => {
                this.UI.showNotification('Kategori başarıyla oluşturuldu', 'success');
                this.Categories.getAll().then(categories => this.UI.renderCategories(categories));
            })
            .catch(error => this.UI.showNotification('Kategori oluşturulamadı', 'error'));
    });

    document.getElementById('tag-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const tagName = document.getElementById('tag-name').value;
        this.Tags.create({ name: tagName })
            .then(() => {
                this.UI.showNotification('Etiket başarıyla oluşturuldu', 'success');
                this.Tags.getAll().then(tags => this.UI.renderTags(tags));
            })
            .catch(error => this.UI.showNotification('Etiket oluşturulamadı', 'error'));
    });

    document.getElementById('search-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const searchQuery = document.getElementById('search-input').value;
        this.Search.performSearch(searchQuery)
            .then(results => this.UI.renderSearchResults(results))
            .catch(error => this.UI.showNotification('Arama gerçekleştirilemedi', 'error'));
    });
};

// Uygulama başlatma fonksiyonunu güncelliyoruz
BlogApp.init = function() {
    console.log('Blog uygulaması başlatılıyor...');
    this.bindEvents();
    this.Posts.getAll().then(posts => this.UI.renderPosts(posts));
    this.Categories.getAll().then(categories => this.UI.renderCategories(categories));
    this.Tags.getAll().then(tags => this.UI.renderTags(tags));
};

// Kürtçe dil desteği için basit bir çeviri mekanizması
BlogApp.Localization = {
    currentLanguage: 'ku',
    translations: {
        ku: {
            'Kategori başarıyla oluşturuldu': 'Kategorî bi serkeftî hat afirandin',
            'Kategori oluşturulamadı': 'Kategorî nehat afirandin',
            'Etiket başarıyla oluşturuldu': 'Etîket bi serkeftî hat afirandin',
            'Etiket oluşturulamadı': 'Etîket nehat afirandin',
            'Arama gerçekleştirilemedi': 'Lêgerîn pêk nehat',
            // ... Diğer çeviriler ...
        }
    },
    translate: function(key) {
        return this.translations[this.currentLanguage][key] || key;
    }
};

// UI.showNotification metodunu güncelliyoruz
BlogApp.UI.showNotification = function(message, type = 'info') {
    const translatedMessage = BlogApp.Localization.translate(message);
    // ... geri kalan kod aynı ...
};

// Kullanıcı rolleri ve izinleri
BlogApp.Roles = {
    ADMIN: 'admin',
    EDITOR: 'editor',
    AUTHOR: 'author',
    USER: 'user'
};

BlogApp.Permissions = {
    CREATE_POST: 'create_post',
    EDIT_ANY_POST: 'edit_any_post',
    DELETE_ANY_POST: 'delete_any_post',
    MANAGE_CATEGORIES: 'manage_categories',
    MANAGE_TAGS: 'manage_tags',
    MODERATE_COMMENTS: 'moderate_comments'
};

// Rol-izin eşleştirmesi
BlogApp.RolePermissions = {
    [BlogApp.Roles.ADMIN]: [
        BlogApp.Permissions.CREATE_POST,
        BlogApp.Permissions.EDIT_ANY_POST,
        BlogApp.Permissions.DELETE_ANY_POST,
        BlogApp.Permissions.MANAGE_CATEGORIES,
        BlogApp.Permissions.MANAGE_TAGS,
        BlogApp.Permissions.MODERATE_COMMENTS
    ],
    [BlogApp.Roles.EDITOR]: [
        BlogApp.Permissions.CREATE_POST,
        BlogApp.Permissions.EDIT_ANY_POST,
        BlogApp.Permissions.MANAGE_CATEGORIES,
        BlogApp.Permissions.MANAGE_TAGS
    ],
    [BlogApp.Roles.AUTHOR]: [
        BlogApp.Permissions.CREATE_POST
    ],
    [BlogApp.Roles.USER]: []
};

// Kullanıcı modülüne yeni metodlar ekliyoruz
BlogApp.User.hasPermission = function(permission) {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return false;

    const userRole = currentUser.role;
    return BlogApp.RolePermissions[userRole].includes(permission);
};

BlogApp.User.login = function(username, password) {
    // Gerçek uygulamada bu bir API çağrısı olacaktır
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (username === 'admin' && password === 'password') {
                const user = { username, role: BlogApp.Roles.ADMIN };
                this.setCurrentUser(user);
                resolve(user);
            } else if (username === 'editor' && password === 'password') {
                const user = { username, role: BlogApp.Roles.EDITOR };
                this.setCurrentUser(user);
                resolve(user);
            } else if (username === 'author' && password === 'password') {
                const user = { username, role: BlogApp.Roles.AUTHOR };
                this.setCurrentUser(user);
                resolve(user);
            } else {
                reject(new Error('Geçersiz kullanıcı adı veya şifre'));
            }
        }, 1000);
    });
};

BlogApp.User.setCurrentUser = function(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
};

BlogApp.User.getCurrentUser = function() {
    const userString = localStorage.getItem('currentUser');
    return userString ? JSON.parse(userString) : null;
};

BlogApp.User.logout = function() {
    localStorage.removeItem('currentUser');
};

// UI modülüne yeni metodlar ekliyoruz
BlogApp.UI.updateUIBasedOnPermissions = function() {
    const createPostButton = document.getElementById('create-post-button');
    const manageCategoriesButton = document.getElementById('manage-categories-button');
    const manageTagsButton = document.getElementById('manage-tags-button');

    if (BlogApp.User.hasPermission(BlogApp.Permissions.CREATE_POST)) {
        createPostButton.style.display = 'block';
    } else {
        createPostButton.style.display = 'none';
    }

    if (BlogApp.User.hasPermission(BlogApp.Permissions.MANAGE_CATEGORIES)) {
        manageCategoriesButton.style.display = 'block';
    } else {
        manageCategoriesButton.style.display = 'none';
    }

    if (BlogApp.User.hasPermission(BlogApp.Permissions.MANAGE_TAGS)) {
        manageTagsButton.style.display = 'block';
    } else {
        manageTagsButton.style.display = 'none';
    }
};

// Middleware benzeri bir yapı
BlogApp.checkPermission = function(permission, callback) {
    return function(...args) {
        if (BlogApp.User.hasPermission(permission)) {
            return callback.apply(this, args);
        } else {
            BlogApp.UI.showNotification('Bu işlem için yetkiniz yok', 'error');
        }
    };
};

// Olay dinleyicileri güncelleniyor
BlogApp.bindEvents = function() {
    // ... Önceki olay dinleyicileri ...

    document.getElementById('create-post-button').addEventListener('click', 
        BlogApp.checkPermission(BlogApp.Permissions.CREATE_POST, () => {
            // Post oluşturma işlemleri
            console.log('Yeni post oluşturuluyor...');
        })
    );

    document.getElementById('manage-categories-button').addEventListener('click', 
        BlogApp.checkPermission(BlogApp.Permissions.MANAGE_CATEGORIES, () => {
            // Kategori yönetimi işlemleri
            console.log('Kategoriler yönetiliyor...');
        })
    );

    document.getElementById('manage-tags-button').addEventListener('click', 
        BlogApp.checkPermission(BlogApp.Permissions.MANAGE_TAGS, () => {
            // Etiket yönetimi işlemleri
            console.log('Etiketler yönetiliyor...');
        })
    );
};

// Uygulama başlatma fonksiyonu güncelleniyor
BlogApp.init = function() {
    console.log('Blog uygulaması başlatılıyor...');
    this.bindEvents();
    this.Posts.getAll().then(posts => this.UI.renderPosts(posts));
    this.Categories.getAll().then(categories => this.UI.renderCategories(categories));
    this.Tags.getAll().then(tags => this.UI.renderTags(tags));
    
    const currentUser = this.User.getCurrentUser();
    if (currentUser) {
        this.UI.showNotification(`Hoş geldiniz, ${currentUser.username}!`, 'success');
        this.UI.updateUIBasedOnPermissions();
    }
};

// Yorum sistemi için yeni bir modül ekliyoruz
BlogApp.Comments = {
    getForPost: function(postId) {
        return fetchFromAPI(`/posts/${postId}/comments`);
    },
    create: function(postId, commentData) {
        // Gerçek uygulamada bu bir API çağrısı olacaktır
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const newComment = {
                    id: Date.now(),
                    postId: postId,
                    author: BlogApp.User.getCurrentUser().username,
                    content: commentData.content,
                    createdAt: new Date().toISOString()
                };
                resolve(newComment);
            }, 500);
        });
    },
    delete: function(commentId) {
        // Gerçek uygulamada bu bir API çağrısı olacaktır
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({ success: true });
            }, 500);
        });
    }
};

// Kullanıcı profili yönetimi için yeni metodlar ekliyoruz
BlogApp.User.updateProfile = function(profileData) {
    // Gerçek uygulamada bu bir API çağrısı olacaktır
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const currentUser = this.getCurrentUser();
            const updatedUser = { ...currentUser, ...profileData };
            this.setCurrentUser(updatedUser);
            resolve(updatedUser);
        }, 500);
    });
};

BlogApp.User.getProfile = function(userId) {
    // Gerçek uygulamada bu bir API çağrısı olacaktır
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const user = this.getCurrentUser(); // Örnek amaçlı, normalde userId'ye göre kullanıcı bilgisi getirilir
            resolve({
                username: user.username,
                role: user.role,
                bio: user.bio || 'Henüz bir biyografi eklenmemiş.',
                joinDate: user.joinDate || new Date().toISOString()
            });
        }, 500);
    });
};

// UI modülüne yeni metodlar ekliyoruz
BlogApp.UI.renderComments = function(comments) {
    const container = document.getElementById('comments-container');
    container.innerHTML = '';
    comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.className = 'comment';
        commentElement.innerHTML = `
            <h4>${comment.author}</h4>
            <p>${comment.content}</p>
            <small>${new Date(comment.createdAt).toLocaleString()}</small>
            ${BlogApp.User.hasPermission(BlogApp.Permissions.MODERATE_COMMENTS) ? 
                `<button class="delete-comment" data-id="${comment.id}">Sil</button>` : ''}
        `;
        container.appendChild(commentElement);
    });
};

BlogApp.UI.renderUserProfile = function(profile) {
    const container = document.getElementById('user-profile');
    container.innerHTML = `
        <h2>${profile.username}</h2>
        <p>Rol: ${profile.role}</p>
        <p>Biyografi: ${profile.bio}</p>
        <p>Katılım Tarihi: ${new Date(profile.joinDate).toLocaleDateString()}</p>
    `;
};

// Olay dinleyicileri güncelleniyor
BlogApp.bindEvents = function() {
    // ... Önceki olay dinleyicileri ...

    document.getElementById('comment-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const postId = e.target.dataset.postId;
        const content = document.getElementById('comment-content').value;
        BlogApp.Comments.create(postId, { content })
            .then(newComment => {
                BlogApp.UI.showNotification('Yorum başarıyla eklendi', 'success');
                return BlogApp.Comments.getForPost(postId);
            })
            .then(comments => BlogApp.UI.renderComments(comments))
            .catch(error => BlogApp.UI.showNotification('Yorum eklenemedi', 'error'));
    });

    document.getElementById('comments-container').addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-comment')) {
            const commentId = e.target.dataset.id;
            BlogApp.Comments.delete(commentId)
                .then(() => {
                    BlogApp.UI.showNotification('Yorum silindi', 'success');
                    // Yorumları yeniden yükle
                    const postId = document.getElementById('comment-form').dataset.postId;
                    return BlogApp.Comments.getForPost(postId);
                })
                .then(comments => BlogApp.UI.renderComments(comments))
                .catch(error => BlogApp.UI.showNotification('Yorum silinemedi', 'error'));
        }
    });

    document.getElementById('update-profile-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const bio = document.getElementById('user-bio').value;
        BlogApp.User.updateProfile({ bio })
            .then(updatedUser => {
                BlogApp.UI.showNotification('Profil güncellendi', 'success');
                return BlogApp.User.getProfile(updatedUser.id);
            })
            .then(profile => BlogApp.UI.renderUserProfile(profile))
            .catch(error => BlogApp.UI.showNotification('Profil güncellenemedi', 'error'));
    });
};

// Uygulama başlatma fonksiyonu güncelleniyor
BlogApp.init = function() {
    console.log('Blog uygulaması başlatılıyor...');
    this.bindEvents();
    this.Posts.getAll().then(posts => this.UI.renderPosts(posts));
    this.Categories.getAll().then(categories => this.UI.renderCategories(categories));
    this.Tags.getAll().then(tags => this.UI.renderTags(tags));
    
    const currentUser = this.User.getCurrentUser();
    if (currentUser) {
        this.UI.showNotification(`Hoş geldiniz, ${currentUser.username}!`, 'success');
        this.UI.updateUIBasedOnPermissions();
        this.User.getProfile(currentUser.id).then(profile => this.UI.renderUserProfile(profile));
    }

    // Eğer bir post sayfasındaysak, yorumları yükle
    const postId = document.getElementById('comment-form')?.dataset.postId;
    if (postId) {
        this.Comments.getForPost(postId).then(comments => this.UI.renderComments(comments));
    }
};

// Bildirim sistemi için yeni bir modül ekliyoruz
BlogApp.Notifications = {
    notifications: [],
    
    fetch: function() {
        // Gerçek uygulamada bu bir API çağrısı olacaktır
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(this.notifications);
            }, 500);
        });
    },
    
    add: function(notification) {
        this.notifications.unshift(notification);
        this.updateUI();
        this.showPopup(notification);
    },
    
    markAsRead: function(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
            this.updateUI();
        }
    },
    
    updateUI: function() {
        BlogApp.UI.renderNotifications(this.notifications);
    },
    
    showPopup: function(notification) {
        BlogApp.UI.showNotificationPopup(notification);
    }
};

// Gerçek zamanlı güncellemeler için WebSocket bağlantısı
BlogApp.RealtimeUpdates = {
    socket: null,
    
    connect: function() {
        // Gerçek uygulamada burada bir WebSocket bağlantısı kurulur
        this.socket = {
            onmessage: null,
            send: function(data) {
                console.log('WebSocket mesajı gönderildi:', data);
            }
        };
        
        this.socket.onmessage = this.handleMessage.bind(this);
        console.log('WebSocket bağlantısı kuruldu');
    },
    
    handleMessage: function(event) {
        const data = JSON.parse(event.data);
        switch(data.type) {
            case 'new_post':
                BlogApp.Posts.addToList(data.post);
                BlogApp.Notifications.add({
                    id: Date.now(),
                    type: 'new_post',
                    message: `Yeni bir gönderi yayınlandı: ${data.post.title}`,
                    read: false
                });
                break;
            case 'new_comment':
                BlogApp.Comments.addToList(data.comment);
                if (data.comment.postId === BlogApp.currentPostId) {
                    BlogApp.UI.renderComments(BlogApp.Comments.getForPost(data.comment.postId));
                }
                break;
            // Diğer gerçek zamanlı güncelleme türleri buraya eklenebilir
        }
    },
    
    sendUpdate: function(data) {
        this.socket.send(JSON.stringify(data));
    }
};

// UI modülüne yeni metodlar ekliyoruz
BlogApp.UI.renderNotifications = function(notifications) {
    const container = document.getElementById('notifications-container');
    container.innerHTML = '';
    notifications.forEach(notification => {
        const notificationElement = document.createElement('div');
        notificationElement.className = `notification ${notification.read ? 'read' : 'unread'}`;
        notificationElement.innerHTML = `
            <p>${notification.message}</p>
            <small>${new Date(notification.id).toLocaleString()}</small>
            ${!notification.read ? '<button class="mark-as-read">Okundu olarak işaretle</button>' : ''}
        `;
        container.appendChild(notificationElement);
    });
};

BlogApp.UI.showNotificationPopup = function(notification) {
    const popup = document.createElement('div');
    popup.className = 'notification-popup';
    popup.textContent = notification.message;
    document.body.appendChild(popup);
    setTimeout(() => {
        popup.remove();
    }, 5000);
};

// Posts ve Comments modüllerine yeni metodlar ekliyoruz
BlogApp.Posts.addToList = function(post) {
    // Yeni gönderiyi listenin başına ekle
    const postsContainer = document.getElementById('posts-container');
    const postElement = document.createElement('div');
    postElement.className = 'post';
    postElement.innerHTML = `
        <h2>${post.title}</h2>
        <p>${post.excerpt}</p>
        <a href="/post/${post.id}">Devamını Oku</a>
    `;
    postsContainer.insertBefore(postElement, postsContainer.firstChild);
};

BlogApp.Comments.addToList = function(comment) {
    // Yeni yorumu ilgili gönderinin yorum listesine ekle
    const commentsContainer = document.getElementById('comments-container');
    const commentElement = document.createElement('div');
    commentElement.className = 'comment';
    commentElement.innerHTML = `
        <h4>${comment.author}</h4>
        <p>${comment.content}</p>
        <small>${new Date(comment.createdAt).toLocaleString()}</small>
    `;
    commentsContainer.appendChild(commentElement);
};

// Olay dinleyicileri güncelleniyor
BlogApp.bindEvents = function() {
    // ... Önceki olay dinleyicileri ...

    document.getElementById('notifications-container').addEventListener('click', (e) => {
        if (e.target.classList.contains('mark-as-read')) {
            const notificationId = parseInt(e.target.closest('.notification').dataset.id);
            BlogApp.Notifications.markAsRead(notificationId);
        }
    });

    // Yeni gönderi oluşturma örneği
    document.getElementById('create-post-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('post-title').value;
        const content = document.getElementById('post-content').value;
        BlogApp.Posts.create({ title, content })
            .then(newPost => {
                BlogApp.RealtimeUpdates.sendUpdate({
                    type: 'new_post',
                    post: newPost
                });
                BlogApp.UI.showNotification('Gönderi başarıyla oluşturuldu', 'success');
            })
            .catch(error => BlogApp.UI.showNotification('Gönderi oluşturulamadı', 'error'));
    });
};

// Uygulama başlatma fonksiyonu güncelleniyor
BlogApp.init = function() {
    console.log('Blog uygulaması başlatılıyor...');
    this.bindEvents();
    this.Posts.getAll().then(posts => this.UI.renderPosts(posts));
    this.Categories.getAll().then(categories => this.UI.renderCategories(categories));
    this.Tags.getAll().then(tags => this.UI.renderTags(tags));
    this.Notifications.fetch().then(notifications => this.UI.renderNotifications(notifications));
    
    const currentUser = this.User.getCurrentUser();
    if (currentUser) {
        this.UI.showNotification(`Hoş geldiniz, ${currentUser.username}!`, 'success');
        this.UI.updateUIBasedOnPermissions();
        this.User.getProfile(currentUser.id).then(profile => this.UI.renderUserProfile(profile));
    }

    // Gerçek zamanlı güncelleme bağlantısını kur
    this.RealtimeUpdates.connect();

    // Eğer bir post sayfasındaysak, yorumları yükle
    const postId = document.getElementById('comment-form')?.dataset.postId;
    if (postId) {
        this.currentPostId = postId;
        this.Comments.getForPost(postId).then(comments => this.UI.renderComments(comments));
    }
};

// SEO optimizasyonları için yeni bir modül ekliyoruz
BlogApp.SEO = {
    updateMetaTags: function(data) {
        document.title = data.title + ' | BlogApp Kurdî';
        document.querySelector('meta[name="description"]').setAttribute('content', data.description);
        document.querySelector('meta[name="keywords"]').setAttribute('content', data.keywords.join(', '));
        
        // Open Graph meta etiketleri
        document.querySelector('meta[property="og:title"]').setAttribute('content', data.title);
        document.querySelector('meta[property="og:description"]').setAttribute('content', data.description);
        document.querySelector('meta[property="og:image"]').setAttribute('content', data.image);
        document.querySelector('meta[property="og:url"]').setAttribute('content', window.location.href);
        
        // Twitter Card meta etiketleri
        document.querySelector('meta[name="twitter:title"]').setAttribute('content', data.title);
        document.querySelector('meta[name="twitter:description"]').setAttribute('content', data.description);
        document.querySelector('meta[name="twitter:image"]').setAttribute('content', data.image);
    },
    
    generateStructuredData: function(data) {
        const structuredData = {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": data.title,
            "image": data.image,
            "author": {
                "@type": "Person",
                "name": data.author
            },
            "datePublished": data.datePublished,
            "dateModified": data.dateModified,
            "description": data.description,
            "articleBody": data.content
        };
        
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify(structuredData);
        document.head.appendChild(script);
    }
};

// Performans iyileştirmeleri için yeni bir modül ekliyoruz
BlogApp.Performance = {
    lazyLoadImages: function() {
        const images = document.querySelectorAll('img[data-src]');
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        }, options);
        
        images.forEach(img => imageObserver.observe(img));
    },
    
    deferNonCriticalCSS: function() {
        const nonCriticalStyles = document.querySelectorAll('link[rel="stylesheet"][data-critical="false"]');
        nonCriticalStyles.forEach(link => {
            link.setAttribute('media', 'print');
            link.setAttribute('onload', "this.media='all'");
        });
    },
    
    minifyHTML: function(html) {
        return html.replace(/\s+/g, ' ').trim();
    },
    
    cacheAPIResponses: function() {
        const cache = {};
        const originalFetch = window.fetch;
        window.fetch = function() {
            const url = arguments[0];
            if (cache[url]) {
                return Promise.resolve(new Response(new Blob([JSON.stringify(cache[url])])));
            }
            return originalFetch.apply(this, arguments).then(response => {
                response.clone().json().then(data => {
                    cache[url] = data;
                });
                return response;
            });
        };
    }
};

// UI modülüne yeni metodlar ekliyoruz
BlogApp.UI.renderPost = function(post) {
    const postContainer = document.getElementById('post-container');
    postContainer.innerHTML = BlogApp.Performance.minifyHTML(`
        <article>
            <h1>${post.title}</h1>
            <img data-src="${post.image}" alt="${post.title}" class="lazy-load">
            <p class="post-meta">Yazar: ${post.author} | Tarih: ${new Date(post.datePublished).toLocaleDateString()}</p>
            <div class="post-content">${post.content}</div>
        </article>
    `);
    
    BlogApp.SEO.updateMetaTags({
        title: post.title,
        description: post.excerpt,
        keywords: post.tags,
        image: post.image,
        author: post.author,
        datePublished: post.datePublished,
        dateModified: post.dateModified
    });
    
    BlogApp.SEO.generateStructuredData(post);
    BlogApp.Performance.lazyLoadImages();
};

// Uygulama başlatma fonksiyonu güncelleniyor
BlogApp.init = function() {
    console.log('Blog uygulaması başlatılıyor...');
    this.bindEvents();
    this.Performance.deferNonCriticalCSS();
    this.Performance.cacheAPIResponses();
    
    // Ana sayfa yüklemesi
    Promise.all([
        this.Posts.getAll(),
        this.Categories.getAll(),
        this.Tags.getAll(),
        this.Notifications.fetch()
    ]).then(([posts, categories, tags, notifications]) => {
        this.UI.renderPosts(posts);
        this.UI.renderCategories(categories);
        this.UI.renderTags(tags);
        this.UI.renderNotifications(notifications);
        this.Performance.lazyLoadImages();
    });
    
    const currentUser = this.User.getCurrentUser();
    if (currentUser) {
        this.UI.showNotification(`Hoş geldiniz, ${currentUser.username}!`, 'success');
        this.UI.updateUIBasedOnPermissions();
        this.User.getProfile(currentUser.id).then(profile => this.UI.renderUserProfile(profile));
    }

    // Gerçek zamanlı güncelleme bağlantısını kur
    this.RealtimeUpdates.connect();

    // Eğer bir post sayfasındaysak, postu ve yorumları yükle
    const postId = document.getElementById('post-container')?.dataset.postId;
    if (postId) {
        this.currentPostId = postId;
        this.Posts.getById(postId).then(post => {
            this.UI.renderPost(post);
            return this.Comments.getForPost(postId);
        }).then(comments => {
            this.UI.renderComments(comments);
        });
    }
};

// Sayfa yüklendiğinde uygulamayı başlat
document.addEventListener('DOMContentLoaded', BlogApp.init.bind(BlogApp));

// Analitik ve raporlama için yeni bir modül ekliyoruz
BlogApp.Analytics = {
    events: [],
    
    trackEvent: function(category, action, label, value) {
        const event = {
            category,
            action,
            label,
            value,
            timestamp: new Date().toISOString()
        };
        this.events.push(event);
        
        // Gerçek uygulamada, bu veriyi bir analytics servisine gönderebilirsiniz
        console.log('Event tracked:', event);
        
        // Örnek: Google Analytics entegrasyonu
        if (typeof ga !== 'undefined') {
            ga('send', 'event', category, action, label, value);
        }
    },
    
    trackPageView: function(pageTitle, pagePath) {
        this.trackEvent('Page View', pageTitle, pagePath);
        
        // Örnek: Google Analytics entegrasyonu
        if (typeof ga !== 'undefined') {
            ga('set', 'page', pagePath);
            ga('send', 'pageview');
        }
    },
    
    generateReport: function(startDate, endDate) {
        const filteredEvents = this.events.filter(event => {
            const eventDate = new Date(event.timestamp);
            return eventDate >= startDate && eventDate <= endDate;
        });
        
        const report = {
            totalEvents: filteredEvents.length,
            eventsByCategory: {},
            eventsByAction: {},
            topPages: {}
        };
        
        filteredEvents.forEach(event => {
            // Kategoriye göre olayları sayma
            report.eventsByCategory[event.category] = (report.eventsByCategory[event.category] || 0) + 1;
            
            // Eyleme göre olayları sayma
            report.eventsByAction[event.action] = (report.eventsByAction[event.action] || 0) + 1;
            
            // Sayfa görüntülemelerini sayma
            if (event.category === 'Page View') {
                report.topPages[event.label] = (report.topPages[event.label] || 0) + 1;
            }
        });
        
        return report;
    }
};

// Raporlama için UI modülüne yeni metodlar ekliyoruz
BlogApp.UI.renderAnalyticsReport = function(report) {
    const reportContainer = document.getElementById('analytics-report');
    reportContainer.innerHTML = `
        <h2>Analitik Raporu</h2>
        <p>Toplam Olay Sayısı: ${report.totalEvents}</p>
        
        <h3>Kategoriye Göre Olaylar</h3>
        <ul>
            ${Object.entries(report.eventsByCategory).map(([category, count]) => 
                `<li>${category}: ${count}</li>`
            ).join('')}
        </ul>
        
        <h3>Eyleme Göre Olaylar</h3>
        <ul>
            ${Object.entries(report.eventsByAction).map(([action, count]) => 
                `<li>${action}: ${count}</li>`
            ).join('')}
        </ul>
        
        <h3>En Çok Ziyaret Edilen Sayfalar</h3>
        <ul>
            ${Object.entries(report.topPages).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([page, count]) => 
                `<li>${page}: ${count} görüntülenme</li>`
            ).join('')}
        </ul>
    `;
};

// Kullanıcı etkileşimlerini izlemek için olay dinleyicileri ekliyoruz
BlogApp.bindAnalyticsEvents = function() {
    // Sayfa görüntüleme izleme
    this.Analytics.trackPageView(document.title, window.location.pathname);
    
    // Link tıklamalarını izleme
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link) {
            this.Analytics.trackEvent('Link Click', 'Click', link.href);
        }
    });
    
    // Gönderi okuma izleme
    document.querySelectorAll('.post').forEach(post => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const postTitle = post.querySelector('h2').textContent;
                    this.Analytics.trackEvent('Post View', 'Read', postTitle);
                    observer.unobserve(post);
                }
            });
        }, { threshold: 0.5 });
        observer.observe(post);
    });
    
    // Yorum gönderme izleme
    document.getElementById('comment-form')?.addEventListener('submit', (e) => {
        const postId = e.target.dataset.postId;
        this.Analytics.trackEvent('Comment', 'Submit', `Post ID: ${postId}`);
    });
    
    // Arama izleme
    document.getElementById('search-form')?.addEventListener('submit', (e) => {
        const searchQuery = document.getElementById('search-input').value;
        this.Analytics.trackEvent('Search', 'Perform', searchQuery);
    });
};

// Raporlama için yeni bir sayfa oluşturuyoruz
BlogApp.UI.renderReportPage = function() {
    const mainContainer = document.querySelector('main');
    mainContainer.innerHTML = `
        <h1>Analitik Raporu</h1>
        <div>
            <label for="start-date">Başlangıç Tarihi:</label>
            <input type="date" id="start-date">
            <label for="end-date">Bitiş Tarihi:</label>
            <input type="date" id="end-date">
            <button id="generate-report">Rapor Oluştur</button>
        </div>
        <div id="analytics-report"></div>
    `;
    
    document.getElementById('generate-report').addEventListener('click', () => {
        const startDate = new Date(document.getElementById('start-date').value);
        const endDate = new Date(document.getElementById('end-date').value);
        const report = BlogApp.Analytics.generateReport(startDate, endDate);
        BlogApp.UI.renderAnalyticsReport(report);
    });
};

// Uygulama başlatma fonksiyonunu güncelliyoruz
BlogApp.init = function() {
    console.log('Blog uygulaması başlatılıyor...');
    this.bindEvents();
    this.bindAnalyticsEvents();
    this.Performance.deferNonCriticalCSS();
    this.Performance.cacheAPIResponses();
    
    // Ana sayfa yüklemesi
    Promise.all([
        this.Posts.getAll(),
        this.Categories.getAll(),
        this.Tags.getAll(),
        this.Notifications.fetch()
    ]).then(([posts, categories, tags, notifications]) => {
        this.UI.renderPosts(posts);
        this.UI.renderCategories(categories);
        this.UI.renderTags(tags);
        this.UI.renderNotifications(notifications);
        this.Performance.lazyLoadImages();
    });
    
    const currentUser = this.User.getCurrentUser();
    if (currentUser) {
        this.UI.showNotification(`Hoş geldiniz, ${currentUser.username}!`, 'success');
        this.UI.updateUIBasedOnPermissions();
        this.User.getProfile(currentUser.id).then(profile => this.UI.renderUserProfile(profile));
        
        // Yönetici kullanıcılar için rapor sayfası bağlantısı ekleme
        if (this.User.hasPermission(this.Permissions.VIEW_ANALYTICS)) {
            const navMenu = document.querySelector('nav ul');
            const reportLink = document.createElement('li');
            reportLink.innerHTML = '<a href="#report">Analitik Raporu</a>';
            navMenu.appendChild(reportLink);
        }
    }

    // Gerçek zamanlı güncelleme bağlantısını kur
    this.RealtimeUpdates.connect();

    // Sayfa yönlendirmesi
    const hash = window.location.hash.slice(1);
    if (hash === 'report' && this.User.hasPermission(this.Permissions.VIEW_ANALYTICS)) {
        this.UI.renderReportPage();
    } else if (hash) {
        // Diğer sayfa yönlendirmeleri buraya eklenebilir
    } else {
        // Ana sayfa içeriğini yükle
    }
};

// Sayfa yüklendiğinde uygulamayı başlat
document.addEventListener('DOMContentLoaded', BlogApp.init.bind(BlogApp));

// Çoklu dil desteği için yeni bir modül ekliyoruz
BlogApp.I18n = {
    currentLanguage: 'ku', // Varsayılan dil Kürtçe
    
    translations: {
        ku: {
            "welcome": "Bi xêr hatî",
            "home": "Mal",
            "categories": "Kategorî",
            "tags": "Etîket",
            "search": "Lêgerîn",
            "login": "Têketin",
            "logout": "Derketin",
            "profile": "Profîl",
            "create_post": "Nivîsek Nû",
            "comments": "Şîrove",
            "read_more": "Zêdetir Bixwîne",
            "analytics": "Analîtîk",
            "language": "Ziman",
            // Diğer çeviriler...
        },
        en: {
            "welcome": "Welcome",
            "home": "Home",
            "categories": "Categories",
            "tags": "Tags",
            "search": "Search",
            "login": "Login",
            "logout": "Logout",
            "profile": "Profile",
            "create_post": "Create Post",
            "comments": "Comments",
            "read_more": "Read More",
            "analytics": "Analytics",
            "language": "Language",
            // Diğer çeviriler...
        },
        tr: {
            "welcome": "Hoş geldiniz",
            "home": "Ana Sayfa",
            "categories": "Kategoriler",
            "tags": "Etiketler",
            "search": "Arama",
            "login": "Giriş",
            "logout": "Çıkış",
            "profile": "Profil",
            "create_post": "Yazı Oluştur",
            "comments": "Yorumlar",
            "read_more": "Devamını Oku",
            "analytics": "Analitik",
            "language": "Dil",
            // Diğer çeviriler...
        }
    },
    
    translate: function(key) {
        return this.translations[this.currentLanguage][key] || key;
    },
    
    setLanguage: function(lang) {
        if (this.translations[lang]) {
            this.currentLanguage = lang;
            localStorage.setItem('language', lang);
            this.updateUILanguage();
        }
    },
    
    updateUILanguage: function() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = this.translate(key);
        });
        document.documentElement.lang = this.currentLanguage;
    },
    
    init: function() {
        const savedLang = localStorage.getItem('language');
        if (savedLang && this.translations[savedLang]) {
            this.currentLanguage = savedLang;
        }
        this.updateUILanguage();
    }
};

// UI modülüne dil değiştirme özelliği ekliyoruz
BlogApp.UI.renderLanguageSelector = function() {
    const languageSelector = document.createElement('select');
    languageSelector.id = 'language-selector';
    
    Object.keys(BlogApp.I18n.translations).forEach(lang => {
        const option = document.createElement('option');
        option.value = lang;
        option.textContent = BlogApp.I18n.translations[lang]['language'];
        if (lang === BlogApp.I18n.currentLanguage) {
            option.selected = true;
        }
        languageSelector.appendChild(option);
    });
    
    languageSelector.addEventListener('change', (e) => {
        BlogApp.I18n.setLanguage(e.target.value);
    });
    
    const navMenu = document.querySelector('nav ul');
    const languageItem = document.createElement('li');
    languageItem.appendChild(languageSelector);
    navMenu.appendChild(languageItem);
};

// Mevcut UI render fonksiyonlarını güncelliyoruz
BlogApp.UI.renderPosts = function(posts) {
    const container = document.getElementById('posts-container');
    container.innerHTML = '';
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.innerHTML = `
            <h2>${post.title}</h2>
            <p>${post.excerpt}</p>
            <a href="/post/${post.id}" data-i18n="read_more">Read More</a>
        `;
        container.appendChild(postElement);
    });
    BlogApp.I18n.updateUILanguage();
};

BlogApp.UI.renderUserProfile = function(profile) {
    const container = document.getElementById('user-profile');
    container.innerHTML = `
        <h2 data-i18n="profile">Profile</h2>
        <p>${profile.username}</p>
        <p data-i18n="role">Role: ${profile.role}</p>
        <p data-i18n="bio">Bio: ${profile.bio}</p>
    `;
    BlogApp.I18n.updateUILanguage();
};

// Uygulama başlatma fonksiyonunu güncelliyoruz
BlogApp.init = function() {
    console.log('Blog uygulaması başlatılıyor...');
    this.I18n.init();
    this.bindEvents();
    this.bindAnalyticsEvents();
    this.Performance.deferNonCriticalCSS();
    this.Performance.cacheAPIResponses();
    
    this.UI.renderLanguageSelector();
    
    // Ana sayfa yüklemesi
    Promise.all([
        this.Posts.getAll(),
        this.Categories.getAll(),
        this.Tags.getAll(),
        this.Notifications.fetch()
    ]).then(([posts, categories, tags, notifications]) => {
        this.UI.renderPosts(posts);
        this.UI.renderCategories(categories);
        this.UI.renderTags(tags);
        this.UI.renderNotifications(notifications);
        this.Performance.lazyLoadImages();
        this.I18n.updateUILanguage();
    });
    
    const currentUser = this.User.getCurrentUser();
    if (currentUser) {
        this.UI.showNotification(this.I18n.translate('welcome') + ', ' + currentUser.username + '!', 'success');
        this.UI.updateUIBasedOnPermissions();
        this.User.getProfile(currentUser.id).then(profile => this.UI.renderUserProfile(profile));
        
        if (this.User.hasPermission(this.Permissions.VIEW_ANALYTICS)) {
            const navMenu = document.querySelector('nav ul');
            const reportLink = document.createElement('li');
            reportLink.innerHTML = `<a href="#report" data-i18n="analytics">Analytics</a>`;
            navMenu.appendChild(reportLink);
        }
    }

    this.RealtimeUpdates.connect();

    const hash = window.location.hash.slice(1);
    if (hash === 'report' && this.User.hasPermission(this.Permissions.VIEW_ANALYTICS)) {
        this.UI.renderReportPage();
    } else if (hash) {
        // Diğer sayfa yönlendirmeleri
    } else {
        // Ana sayfa içeriği
    }
    
    this.I18n.updateUILanguage();
};

// HTML yapısını güncelliyoruz (örnek)
/*
<nav>
    <ul>
        <li><a href="#" data-i18n="home">Home</a></li>
        <li><a href="#" data-i18n="categories">Categories</a></li>
        <li><a href="#" data-i18n="tags">Tags</a></li>
        <li><a href="#" data-i18n="search">Search</a></li>
        <li><a href="#" data-i18n="login">Login</a></li>
    </ul>
</nav>
*/

// Sayfa yüklendiğinde uygulamayı başlat
document.addEventListener('DOMContentLoaded', BlogApp.init.bind(BlogApp));

// Genel hata yakalama mekanizması
window.onerror = function(message, source, lineno, colno, error) {
    console.error('Yakalanan hata:', { message, source, lineno, colno, error });
    BlogApp.UI.showNotification(BlogApp.I18n.translate('error_occurred'), 'error');
    BlogApp.Analytics.trackEvent('Error', 'Uncaught', message);
    return true;
};

// Uygulama durumunu yönetmek için basit bir state management
BlogApp.State = {
    data: {},
    listeners: {},

    set: function(key, value) {
        this.data[key] = value;
        if (this.listeners[key]) {
            this.listeners[key].forEach(callback => callback(value));
        }
    },

    get: function(key) {
        return this.data[key];
    },

    subscribe: function(key, callback) {
        if (!this.listeners[key]) {
            this.listeners[key] = [];
        }
        this.listeners[key].push(callback);
    }
};

// Performans izleme için yeni bir modül
BlogApp.PerformanceMonitor = {
    measures: {},

    startMeasure: function(name) {
        this.measures[name] = performance.now();
    },

    endMeasure: function(name) {
        if (this.measures[name]) {
            const duration = performance.now() - this.measures[name];
            console.log(`Performance: ${name} took ${duration.toFixed(2)}ms`);
            BlogApp.Analytics.trackEvent('Performance', name, '', duration);
            delete this.measures[name];
        }
    }
};

// Uygulama güncellemesi kontrolü
BlogApp.checkForUpdates = function() {
    // Gerçek uygulamada, burada bir API çağrısı yapılabilir
    console.log('Güncellemeler kontrol ediliyor...');
    setTimeout(() => {
        const hasUpdate = Math.random() < 0.3; // %30 ihtimalle güncelleme var
        if (hasUpdate) {
            BlogApp.UI.showNotification(BlogApp.I18n.translate('update_available'), 'info');
        }
    }, 2000);
};

// Kullanıcı geri bildirimi için yeni bir modül
BlogApp.Feedback = {
    submit: function(feedback) {
        // Gerçek uygulamada, burada bir API çağrısı yapılabilir
        console.log('Kullanıcı geri bildirimi:', feedback);
        BlogApp.Analytics.trackEvent('Feedback', 'Submit', feedback.type);
        BlogApp.UI.showNotification(BlogApp.I18n.translate('feedback_received'), 'success');
    }
};

// UI modülüne yeni metodlar ekliyoruz
BlogApp.UI.showFeedbackForm = function() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2 data-i18n="feedback">Feedback</h2>
            <textarea id="feedback-text" rows="4" placeholder="${BlogApp.I18n.translate('enter_feedback')}"></textarea>
            <select id="feedback-type">
                <option value="bug" data-i18n="bug">Bug</option>
                <option value="feature" data-i18n="feature_request">Feature Request</option>
                <option value="other" data-i18n="other">Other</option>
            </select>
            <button id="submit-feedback" data-i18n="submit">Submit</button>
            <button id="close-modal" data-i18n="close">Close</button>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('submit-feedback').addEventListener('click', () => {
        const text = document.getElementById('feedback-text').value;
        const type = document.getElementById('feedback-type').value;
        BlogApp.Feedback.submit({ text, type });
        modal.remove();
    });

    document.getElementById('close-modal').addEventListener('click', () => {
        modal.remove();
    });

    BlogApp.I18n.updateUILanguage();
};

// Ana uygulama başlatma fonksiyonunu son kez güncelliyoruz
BlogApp.init = function() {
    console.log('Blog uygulaması başlatılıyor...');
    this.PerformanceMonitor.startMeasure('appInit');

    this.I18n.init();
    this.bindEvents();
    this.bindAnalyticsEvents();
    this.Performance.deferNonCriticalCSS();
    this.Performance.cacheAPIResponses();
    
    this.UI.renderLanguageSelector();
    
    // Ana sayfa yüklemesi
    Promise.all([
        this.Posts.getAll(),
        this.Categories.getAll(),
        this.Tags.getAll(),
        this.Notifications.fetch()
    ]).then(([posts, categories, tags, notifications]) => {
        this.State.set('posts', posts);
        this.State.set('categories', categories);
        this.State.set('tags', tags);
        this.State.set('notifications', notifications);

        this.UI.renderPosts(posts);
        this.UI.renderCategories(categories);
        this.UI.renderTags(tags);
        this.UI.renderNotifications(notifications);
        this.Performance.lazyLoadImages();
        this.I18n.updateUILanguage();
    }).catch(error => {
        console.error('Veri yükleme hatası:', error);
        this.UI.showNotification(this.I18n.translate('loading_error'), 'error');
    });
    
    const currentUser = this.User.getCurrentUser();
    if (currentUser) {
        this.State.set('currentUser', currentUser);
        this.UI.showNotification(this.I18n.translate('welcome') + ', ' + currentUser.username + '!', 'success');
        this.UI.updateUIBasedOnPermissions();
        this.User.getProfile(currentUser.id).then(profile => {
            this.State.set('userProfile', profile);
            this.UI.renderUserProfile(profile);
        });
        
        if (this.User.hasPermission(this.Permissions.VIEW_ANALYTICS)) {
            const navMenu = document.querySelector('nav ul');
            const reportLink = document.createElement('li');
            reportLink.innerHTML = `<a href="#report" data-i18n="analytics">Analytics</a>`;
            navMenu.appendChild(reportLink);
        }
    }

    this.RealtimeUpdates.connect();

    const hash = window.location.hash.slice(1);
    if (hash === 'report' && this.User.hasPermission(this.Permissions.VIEW_ANALYTICS)) {
        this.UI.renderReportPage();
    } else if (hash === 'feedback') {
        this.UI.showFeedbackForm();
    } else if (hash) {
        // Diğer sayfa yönlendirmeleri
    } else {
        // Ana sayfa içeriği
    }
    
    this.I18n.updateUILanguage();
    this.checkForUpdates();

    // Feedback butonu ekleme
    const feedbackButton = document.createElement('button');
    feedbackButton.textContent = this.I18n.translate('give_feedback');
    feedbackButton.addEventListener('click', () => this.UI.showFeedbackForm());
    document.body.appendChild(feedbackButton);

    this.PerformanceMonitor.endMeasure('appInit');
};

// Uygulama durumuna abone olma örnekleri
BlogApp.State.subscribe('posts', posts => {
    BlogApp.UI.renderPosts(posts);
});

BlogApp.State.subscribe('currentUser', user => {
    if (user) {
        BlogApp.UI.updateUIBasedOnPermissions();
    } else {
        BlogApp.UI.showLoginForm();
    }
});

// Sayfa yüklendiğinde uygulamayı başlat
document.addEventListener('DOMContentLoaded', BlogApp.init.bind(BlogApp));
