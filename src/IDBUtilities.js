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
