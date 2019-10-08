import { deleteDB } from 'idb';

context('Delete TODO', () => {
  afterEach(() => {
    window.indexedDB.deleteDatabase('pwa_todo')
    cy.wait(300)
  })

  it('-', () => {
    cy.visit('http://localhost:3000')
    cy.wait(300)
    cy.insert('todos', { title: 'Primeira TODO', index: 0 })
      .then(() => { cy.visit('http://localhost:3000') })

    cy.contains('Primeira TODO').should('be.visible')
    cy.get('.todo')
      .trigger('mousedown', { which: 1 })
      .trigger('mousemove', { clientX: 100, clientY: 40 })
      .trigger('mouseup', {force: true})

    cy.contains('Primeira TODO').should('not.be.visible')
  })
})
