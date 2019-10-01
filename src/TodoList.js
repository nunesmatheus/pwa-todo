import React, { Component } from 'react';
import { openDB } from 'idb';
import Todo from './Todo';

const styles = {
  new_form_wrapper: {
    position: 'fixed',
    width: '100%',
    bottom: 0,
    padding: '16px 12px',
    backgroundColor: '#2a2a2a',
    boxSizing: 'border-box',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5
  },
  new_form: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flexGrow: 1
  },
  title_input: {
    flexGrow: 1,
    background: 'none',
    border: 'none',
    outline: 'none',
    fontSize: 18,
    color: 'white'
  },
  add_button: {
    marginTop: 10,
    fontSize: 16,
    padding: 8,
    backgroundColor: '#e53232',
    color: 'white',
    border: 'none',
    borderRadius: 5,
    fontWeight: 'bold'
  }
}

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
        <div className="todos">
          {this.state.todos.map((todo, i) => {
            return <Todo id={todo.id} title={todo.title} key={i} removeTodoById={this.removeTodoById.bind(this)} />
          })}
        </div>

        <div style={styles.new_form_wrapper}>
          <form onSubmit={this.handleSubmit.bind(this)} style={styles.new_form}>
            <input
              id="todo_title" type="text" style={styles.title_input}
              onChange={(event) => { this.setState({ new_todo_title: event.target.value }) }}
              value={this.state.new_todo_title} />
            <input type="submit" value="Adicionar" style={styles.add_button} />
          </form>
        </div>
      </main>
    )
  }

  componentDidMount() {
    const db = openDB('pwa_todo', 1, {
      upgrade(db, oldVersion, newVersion, transaction) {
        if(!db.objectStoreNames.contains('todos'))
          db.createObjectStore('todos', { keyPath: 'id', autoIncrement: true })
      }
    })

    db.then((db) => {
      if(!db.objectStoreNames.contains('todos'))
        return []
      const tx = db.transaction('todos')
      const store = tx.objectStore('todos')
      return store.getAll()
    }).then((todos) => { this.setState({ todos: todos }) } )
  }

  handleSubmit(event) {
    event.preventDefault()
    const title = this.state.new_todo_title
    this.setState({
      todos: [...this.state.todos, { title: title }],
      new_todo_title: ''
    })
    this.insertTodo({title: title})

//     fetch('http://localhost:3000/todos', {
//       headers: {
//         'Content-type': 'application/json',
//         'Accept': 'application/json'
//       },
//       method: 'POST',
//       body: JSON.stringify({ title: title })
//     })

    // TODO: Should assert that IndexedDB is available on browser
  }

  insertTodo(todo) {
    const db = openDB('pwa_todo', 1)
    return db.then((db) => {
      const tx = db.transaction('todos', 'readwrite')
      tx.store.put(todo, todo.id)
      return tx.done
    })
  }

  removeTodoById(id) {
    const new_todos = this.state.todos.filter(todo => todo.id !== id)
    this.setState({ todos: new_todos })
  }
}

export default TodoList;
