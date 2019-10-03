import React, { Component } from 'react';
import { openDB } from 'idb';
import TodoList from './TodoList';
import arrayMove from 'array-move';
import './TodoIndex.css';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import * as idbu from './IDBUtilities';
import { connect } from 'react-redux';

class TodoIndex extends Component {
  constructor(props) {
    super(props)
    this.state = {
      new_todo_title: '',
      show_new_form: false
    }
  }

  render() {
    const form_transform = this.state.show_new_form ? '' : 'translateY(100%)'
    const form_wrapper_style = {...styles.new_form_wrapper, transform: form_transform}
    return(
      <main>
        <TodoList
          todos={this.props.todos}
          onSortEnd={this.onSortEnd.bind(this)} />

        <span
          onClick={() => {this.setState({ show_new_form: true }); this.todoTitleInput.focus()}}
          style={styles.open_form_button}
        ><AddIcon style={{fill: 'white', fontSize: 30}} /></span>

        <div style={form_wrapper_style}>
          <form onSubmit={this.handleSubmit.bind(this)} style={styles.new_form}>
            <div style={{display: 'flex'}}>
              <input
                ref={(input) => {this.todoTitleInput = input}}
                id="todo_title" type="text" style={styles.title_input}
                onChange={(event) => { this.setState({ new_todo_title: event.target.value }) }}
                value={this.state.new_todo_title} />
              <CloseIcon style={{fill: 'white', marginLeft: 10}}
                onClick={() => { this.setState({ show_new_form: false }) }} />
            </div>
            <input type="submit" value="Adicionar" style={styles.add_button} />
          </form>
        </div>
      </main>
    )
  }

  componentDidMount() {
    const db = openDB('pwa_todo', 5, {
      upgrade(db, oldVersion, newVersion, transaction) {
        if(!db.objectStoreNames.contains('todos'))
          db.createObjectStore('todos', {keyPath: 'id', autoIncrement: true})
      }
    })

    db.then((db) => {
      if(!db.objectStoreNames.contains('todos'))
        return []
      const tx = db.transaction('todos')
      const store = tx.objectStore('todos')
      return store.getAll()
    }).then((todos) => {
      todos.sort((a,b) => a.index - b.index)
      this.props.dispatch({ type: 'SET TODOS', todos: todos })
    })
  }

  handleSubmit(event) {
    event.preventDefault()
    const title = this.state.new_todo_title
    idbu.insert('todos', { title: title }).then((idb_id) => {
      this.setState({ new_todo_title: '', show_new_form: false })
      this.props.dispatch({
        type: 'SET TODOS',
        todos: [...this.props.todos, { id: idb_id, title: title }]
      })
      const todos_wrapper = document.querySelector('.todos')
      todos_wrapper.scrollTo(0, todos_wrapper.scrollHeight)
    })
  }

  onSortEnd({oldIndex, newIndex}) {
    this.props.dispatch({
      type: 'SET TODOS',
      todos: arrayMove(this.props.todos, oldIndex, newIndex)
    })

    this.props.todos.map((todo, index) => {
      todo.index = index
      return idbu.insert('todos', todo)
    })
  }
}

const styles = {
  new_form_wrapper: {
    position: 'fixed',
    width: '100%',
    bottom: '0',
    padding: '16px 12px',
    backgroundColor: '#2a2a2a',
    boxSizing: 'border-box',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    transition: 'transform 0.1s ease-out',
    willChange: 'transform'
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
  },
  open_form_button: {
    fontWeight: 'bold',
    backgroundColor: '#e53232',
    borderRadius: '50%',
    width: 50,
    height: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'fixed',
    right: 20,
    bottom: 20,
  }
}

const mapStateToProps = state => {
  return { todos: state.todos }
}

export default connect(mapStateToProps)(TodoIndex);
