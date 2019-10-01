self.importScripts('idb.js')

self.addEventListener('fetch', (e) => {
  if(e.request.method == 'GET' && e.request.url.indexOf('/todos') != -1) {
    let newResponse = caches.open('pwa-todo').then((cache) => {
      return cache.match(e.request).then((response) => {
        if(response) return response
        return fetch(e.request).then((fetchedResponse) => {
          cache.put(e.request, fetchedResponse.clone())
          return fetchedResponse
        })
      })
    })

    e.respondWith(newResponse)
  }
})

self.addEventListener('activate', (e) => {
  e.waitUntil(createDb())
})

createDb = () => {
  idb.openDB('pwa_todo', 1, {
    upgrade(db, oldVersion, newVersion, transaction) {
      if(!db.objectStoreNames.contains('todos'))
        db.createObjectStore('todos')
    }
  })
}
