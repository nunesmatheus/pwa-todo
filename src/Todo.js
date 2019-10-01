import React, { Component } from 'react';
import { openDB } from 'idb';

const styles = {
  todo: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
}

class Todo extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return(
      <div className="todo" key={`todo-${this.props.i}`} style={styles.todo}>
        <span>{this.props.title}</span>
        <span className="remove-action" onClick={this.remove.bind(this)}>Excluir</span>
      </div>
    )
  }

  remove() {
    const removeTodoById = this.props.removeTodoById
    const db = openDB('pwa_todo', 1)
    db.then((db) => {
      const tx = db.transaction('todos', 'readwrite')
      const store = tx.objectStore('todos')
      store.delete(this.props.id)
    }).then(() => {
      removeTodoById(this.props.id)
    })
  }
}

export default Todo;
