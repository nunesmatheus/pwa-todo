import React, { Component } from 'react';
import { openDB } from 'idb';

class TodoList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      todos: [],
      new_todo_title: ''
    }
  }

  render() {
    return(
      <main>
        <div className="new-todo-wrapper">
          <form id="new-todo" onSubmit={this.handleSubmit.bind(this)}>
            <label htmlFor="todo_title">Título</label>
            <input
              id="todo_title" type="text"
              onChange={(event) => { this.setState({ new_todo_title: event.target.value }) }}
              value={this.state.new_todo_title} />
            <input type="submit" value="Criar TODO" />
          </form>
        </div>

        <div className="todos">
          {this.state.todos.map((todo, i) => {
            return(
              <div className="todo" key={`todo-${i}`}>
                <span>{todo.title}</span>
              </div>
            )
          })}
        </div>
      </main>
    )
  }

  componentDidMount() {
    this.getTodos().
      then((todos) => { this.setState({ todos: todos }) })
  }

  handleSubmit(event) {
    event.preventDefault()
    const title = this.state.new_todo_title
    this.setState({
      todos: [...this.state.todos, { title: title }],
      new_todo_title: ''
    })

    fetch('http://localhost:3000/todos', {
      headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({ title: title })
    })
      .then((response) => {
        return response.json()
      })
      .then((response) => {
        this.insertTodo({id: response.id, title: title})
      })

    // TODO: Should assert that IndexedDB is available on browser
  }

  async insertTodo(todo) {
    const db = await openDB('pwa_todo', 1)
    await db.add('todos', todo);
  }

  async getTodos() {
    const db = await openDB('pwa_todo', 1)
    return await db.getAll('todos')
  }
}

export default TodoList;
