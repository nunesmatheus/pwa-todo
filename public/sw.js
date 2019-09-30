self.addEventListener('fetch', (e) => {
  if(e.request.url.indexOf('/todos') != -1) {
    e.respondWith(new Response('[{"title":"Teste"}]'))
  }
})
