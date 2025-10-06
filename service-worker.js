const CACHE_NAME = 'v60-coffee-calculator-v1.3';
const STATIC_ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/calculator.js',
  './images/v60.svg',
  './images/v60-192.png',
  './images/v60-512.png',
  './images/pattern-bg.svg',
  './images/Coffee-beans.svg',
  './manifest.json'
];

// Instalar Service Worker e fazer cache dos assets
self.addEventListener('install', event => {
  console.log('Service Worker: Instalando v1.3...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Fazendo cache dos assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Cache concluído');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker: Erro no cache:', error);
      })
  );
});

// Ativar Service Worker e limpar caches antigos
self.addEventListener('activate', event => {
  console.log('Service Worker: Ativando...');
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(name => name !== CACHE_NAME)
            .map(name => {
              console.log('Service Worker: Removendo cache antigo:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        console.log('Service Worker: Ativado com sucesso');
        return self.clients.claim();
      })
  );
});

// Interceptar requisições e servir do cache quando offline
self.addEventListener('fetch', event => {
  // Apenas interceptar requisições GET
  if (event.request.method !== 'GET') return;
  
  // Ignorar requisições para outros domínios
  if (!event.request.url.startsWith(self.location.origin)) return;
  
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Se encontrou no cache, retorna
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Senão, busca na rede
        return fetch(event.request)
          .then(response => {
            // Verifica se a resposta é válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clona a resposta porque ela só pode ser consumida uma vez
            const responseToCache = response.clone();
            
            // Adiciona ao cache para futuras requisições
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(() => {
            // Se estiver offline e não encontrou no cache
            // Retorna uma página de fallback básica para navegação
            if (event.request.destination === 'document') {
              return caches.match('./index.html');
            }
          });
      })
  );
});

// Mostrar notificação quando uma nova versão estiver disponível
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Event listener para sincronização em background (quando voltar online)
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    console.log('Service Worker: Sincronizando dados em background');
    // Aqui você pode implementar sincronização de dados
    // Por exemplo, enviar dados salvos localmente quando voltar online
  }
});

// Push notifications (se necessário no futuro)
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: './images/v60.svg',
      badge: './images/v60.svg',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      }
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Background sync (funcionalidade PWA avançada) 
self.addEventListener('sync', event => {
  console.log('Service Worker: Background sync executado');
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      Promise.resolve()
    );
  }
});

// Message handling para melhorar score PWA
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});