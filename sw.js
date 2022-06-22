//On install - the application shell cached
self.addEventListener('install',function(event){
    event.waitUntill(
        caches.open('sw-cache').then(function(cache){
            return cache.add('index.html');
        })
    );
});

//with request network
self.addEventListener('fetch',function(event){
    event.respondWith(
        cache.match(event.request).then(function(response){
            return response || fetch(event.request);
        })
    );
});