import { openDB } from 'idb';

const database_version = 5

export function insert(object_store, object) {
  // TODO: Should assert that IndexedDB is available on browser
  const db = openDB('pwa_todo', database_version)
  return db.then((db) => {
    const tx = db.transaction(object_store, 'readwrite')
    return tx.store.put(object)
  })
}

export function getAll(object_store) {
  // TODO: Should assert that IndexedDB is available on browser

  const db = openDB('pwa_todo', 5, {
    upgrade(db, oldVersion, newVersion, transaction) {
      if(!db.objectStoreNames.contains('todos'))
        db.createObjectStore('todos', {keyPath: 'id', autoIncrement: true})
    }
  })

  return db.then((db) => {
    if(!db.objectStoreNames.contains('todos'))
      return []
    const tx = db.transaction('todos')
    const store = tx.objectStore('todos')
    return store.getAll()
  })
}
