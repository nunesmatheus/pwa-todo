import React, { Component } from 'react';
import { openDB } from 'idb';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import * as idbu from './IDBUtilities';
import { connect } from 'react-redux';

class Todo extends Component {

  constructor(props) {
    super(props)
    this.state = {
      hide: false,
      editing: false,
      title: props.title
    }
  }

  render() {
    const height = this.state.hide ? 0 : 'auto'
    const style = {...styles.todo, height: height}
    if(this.state.hide) style.padding = 0
    let input_style, title_style
    if(this.state.editing) {
      title_style = { display: 'none' }
      input_style = {}
    } else {
      title_style = {}
      input_style = { display: 'none' }
    }

    return(
      <div className="todo" style={style}>
        <span style={title_style}>{this.props.title}</span>

        <form onSubmit={this.handleEdit.bind(this)}>
          <input
            ref={(input) => {this.titleInput = input}}
            type="text" style={{...styles.input, ...input_style}}
            onChange={(event) => { this.setState({ title: event.target.value }) }}
            value={this.state.title} />
          <input type="submit" value="Editar" style={{display: 'none'}} />
        </form>

        <div style={{flexShrink: 0, marginLeft: 10}}>
          <EditIcon onClick={() => {
              this.setState({ editing: !this.state.editing },
                () => { this.titleInput.focus() }) }}
            style={{marginRight: 10}}
          />
          <DeleteIcon onClick={this.remove.bind(this)}/>
        </div>
      </div>
    )
  }

  remove() {
    const db = openDB('pwa_todo', 5)
    db.then((db) => {
      const tx = db.transaction('todos', 'readwrite')
      const store = tx.objectStore('todos')
      store.delete(this.props.id)
    }).then(() => {
      this.setState({ hide: true })
    })
  }

  handleEdit(event) {
    event.preventDefault()
    const updated_todo = { id: this.props.id, title: this.state.title }
    idbu.insert('todos', updated_todo)
    this.setState({ editing: false })
    this.updateTodo(updated_todo)
  }

  updateTodo(updated_todo) {
    const todos = this.props.todos.map((todo) => {
      if(todo.id !== updated_todo.id) return todo
      todo.title = updated_todo.title
      return todo
    })
    this.props.dispatch({ type: 'SET TODOS', todos: todos })
  }
}

const styles = {
  todo: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 14px',
    backgroundColor: '#1d1d1d',
    borderBottom: '1px solid #242424',
    color: 'white',
    transition: 'height 0.1s ease-out',
    transitionProperty: 'height, padding',
    overflow: 'hidden'
  },
  input: {
    fontSize: 16,
    background: 'none',
    border: 'none',
    color: 'white'
  }
}

const mapStateToProps = state => {
  console.log('todos are')
  console.log(state.todos)
  return { todos: state.todos }
}

export default connect(mapStateToProps)(Todo);
