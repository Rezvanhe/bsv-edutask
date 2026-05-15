describe('R8 To-do item GUI tests', () => {
  let uid
  let name
  let email
  let taskTitle
  let taskDescription
  let taskUrl
  let todoText

  before(function () {
    cy.fixture('user.json').then((user) => {
      cy.request({
        method: 'POST',
        url: 'http://localhost:5000/users/create',
        form: true,
        body: user
      }).then((response) => {
        uid = response.body._id.$oid
        name = user.firstName + ' ' + user.lastName
        email = user.email

        cy.fixture('task.json').then((task) => {
          taskTitle = task.title
          taskDescription = task.description
          taskUrl = task.url
          todoText = task.todos

          cy.request({
            method: 'POST',
            url: 'http://localhost:5000/tasks/create',
            form: true,
            body: {
              title: taskTitle,
              description: taskDescription,
              url: taskUrl,
              userid: uid,
              todos: todoText
            }
          })
        })
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

  it('R8UC1 creates a to-do item of a task', () => {
    cy.contains(taskTitle)
      .click()

    cy.contains(todoText)
      .should('exist')
  })

  it('R8UC2 toggles a to-do item of a task', () => {
    cy.contains(taskTitle)
      .click()

    cy.contains(todoText)
      .parents('li.todo-item')
      .find('span.checker')
      .click()

    cy.contains(todoText)
      .parents('li.todo-item')
      .find('span.checker')
      .should('have.class', 'checked')
  })

  it('R8UC3 deletes a to-do item of a task', () => {
    cy.contains(taskTitle)
      .click()

    cy.contains(todoText)
      .parents('li.todo-item')
      .find('span.remover')
      .click()

    cy.contains(todoText)
      .should('not.exist')
  })

  after(function () {
    cy.request({
      method: 'DELETE',
      url: `http://localhost:5000/users/${uid}`
    })
  })
})