import { deleteDB } from 'idb';

context('Create todo', () => {
  afterEach(() => {
    deleteDB('pwa_todo')
  })

  // https://on.cypress.io/interacting-with-elements

  it('when there are none', () => {
    cy.visit('http://localhost:3000')
    cy.wait(100)
    cy.get('.todos').contains('Nova TODO').should('not.be.visible')
    cy.get('#new-todo-btn').click()
    cy.get('#todo_title').type('Nova TODO')
    cy.contains('Adicionar').click()
    cy.get('.todos').contains('Nova TODO').should('be.visible')
  })

  it('when there are some', () => {
    cy.visit('http://localhost:3000')
    cy.wait(100)

    let promises = []
    promises.push(
      cy.insert('todos', { title: 'Primeira TODO', index: 0 }))
    promises.push(
      cy.insert('todos', { title: 'Segunda TODO', index: 0 }))
    promises.push(
      cy.insert('todos', { title: 'Terceira TODO', index: 0 }))

    Promise.all(promises).then(() => {
      cy.visit('http://localhost:3000')
    })

    cy.get('.todos').contains('Nova TODO').should('not.be.visible')
    cy.get('#new-todo-btn').click()
    cy.get('#todo_title').type('Nova TODO')
    cy.contains('Adicionar').click()
    cy.get('.todos').contains('Nova TODO').should('be.visible')
    cy.get('.drag-container:nth-of-type(1) .todo span').should('have.text', 'Primeira TODO')
    cy.get('.drag-container:nth-of-type(2) .todo span').should('have.text', 'Segunda TODO')
    cy.get('.drag-container:nth-of-type(3) .todo span').should('have.text', 'Terceira TODO')
    cy.get('.drag-container:nth-of-type(4) .todo span').should('have.text', 'Nova TODO')
  })
})
