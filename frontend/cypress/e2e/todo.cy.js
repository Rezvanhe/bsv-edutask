describe('R8 To-do item GUI tests', () => {
  let uid
  let name
  let email

  before(function () {
    cy.fixture('user.json')
      .then((user) => {
        cy.request({
          method: 'POST',
          url: 'http://localhost:5000/users/create',
          form: true,
          body: user
        }).then((response) => {
          uid = response.body._id.$oid
          name = user.firstName + ' ' + user.lastName
          email = user.email
        })
      })
  })

  beforeEach(function () {
    cy.visit('http://localhost:3000')

    cy.contains('div', 'Email Address')
      .find('input[type=text]')
      .type(email)

    cy.get('form')
      .submit()

    cy.get('h1')
      .should('contain.text', 'Your tasks, ' + name)
  })

  it('R8UC1 creates a to-do item for a task', () => {
    cy.contains('button', 'Create Task').click()

    cy.contains('div', 'Title')
      .find('input')
      .type('Cypress task')

    cy.contains('div', 'Description')
      .find('textarea')
      .type('Task created with Cypress')

    cy.get('form').submit()

    cy.contains('Cypress task').click()

    cy.contains('button', 'Add To-Do').click()

    cy.contains('div', 'Title')
      .find('input')
      .type('Read documentation')

    cy.get('form').submit()

    cy.contains('Read documentation')
      .should('exist')
  })

  it('R8UC2 toggles a to-do item of a task', () => {
    cy.contains('Cypress task').click()

    cy.contains('Read documentation')
      .parent()
      .find('input[type=checkbox]')
      .check()

    cy.contains('Read documentation')
      .parent()
      .find('input[type=checkbox]')
      .should('be.checked')
  })

  it('R8UC3 deletes a to-do item of a task', () => {
    cy.contains('Cypress task').click()

    cy.contains('Read documentation')
      .parent()
      .contains('button', 'Delete')
      .click()

    cy.contains('Read documentation')
      .should('not.exist')
  })

  after(function () {
    cy.request({
      method: 'DELETE',
      url: `http://localhost:5000/users/${uid}`
    })
  })
})