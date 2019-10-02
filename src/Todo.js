import React, { Component } from 'react';
import { openDB } from 'idb';

const styles = {
  todo: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12
  }
}

class Todo extends Component {

  render() {
    return(
      <div className="todo" style={styles.todo}>
        <span>{this.props.title}</span>
        <span style={{fontWeight: 'bold'}}
          onClick={this.remove.bind(this)}>Excluir</span>
      </div>
    )
  }

  remove() {
    console.log('teste')
    const removeTodoById = this.props.removeTodoById
    const db = openDB('pwa_todo', 2)
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
