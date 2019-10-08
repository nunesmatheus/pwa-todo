import { deleteDB } from 'idb';

context('Delete TODO', () => {
  afterEach(() => {
    deleteDB('pwa_todo')
  })

  it('-', () => {
    deleteDB('pwa_todo')
    cy.visit('http://localhost:3000')
    cy.wait(200)

    const todo_text = 'Primeira TODO'
    const promise = cy.insert(
      'todos', { title: todo_text, index: 0 })

    promise.then(() => { cy.visit('http://localhost:3000') })

    cy.contains(todo_text).should('be.visible')
    cy.get('.todo')
      .trigger('mousedown', { which: 1 })
      .trigger('mousemove', { clientX: 100, clientY: 40 })
      .trigger('mouseup', {force: true})

    cy.contains(todo_text).should('not.be.visible')
  })
})
