import React, { Component } from 'react';
import { openDB } from 'idb';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import * as idbu from './IDBUtilities';
import { connect } from 'react-redux';
import Icon from '@mdi/react'
import { mdiCloseCircle, mdiCheckCircle } from '@mdi/js'
import autosize from 'autosize';
import { closest } from './utils';

class Todo extends Component {

  constructor(props) {
    super(props)
    this.state = {
      hide: false,
      editing: false,
      title: props.title,
      showing_actions: false
    }
  }

  render() {
    const height = this.state.hide ? 0 : 'auto'
    const style = {...styles.todo, height: height}
    if(this.state.hide) style.padding = '0 14px'
    let input_style, title_style
    if(this.state.editing) {
      title_style = { display: 'none' }
      input_style = {}
    } else {
      title_style = { flexGrow: 1 }
      input_style = { display: 'none' }
    }

    let actions_style = styles.actions_inner_wrapper
    if(this.state.editing)
      actions_style = {...actions_style, transform: 'translateY(-25px)'}
    if(this.state.showing_actions)
      actions_style = {...actions_style, opacity: 1}

    return(
      <div className="todo" style={style} onClick={this.toggleActions.bind(this)}>
        <span style={title_style}>{this.props.title}</span>

        <form onSubmit={this.handleEdit.bind(this)}>
          <textarea
            ref={(input) => {this.titleInput = input}}
            type="text" style={{...styles.input, ...input_style, padding: 0, resize: 'none'}}
            onChange={(event) => { this.setState({ title: event.target.value }) }}
            value={this.state.title} />
          <input type="submit" value="Editar" style={{display: 'none'}} />
        </form>

        <div style={styles.actions_wrapper} className="actions-wrapper">
          <div style={actions_style}>
            <div style={{display: 'flex'}}>
              <EditIcon onClick={() => { this.executeAction(this.enableEdit.bind(this)) }}
                style={{marginRight: 10}}
              />
              <DeleteIcon onClick={() => { this.executeAction(this.remove.bind(this)) }} />
            </div>
            <div style={{display: 'flex'}}>
              <Icon path={mdiCloseCircle} size={1}
                onClick={() => { this.executeAction(this.cancelEdit.bind(this)) }}
                style={{fill: 'white', height: '1.5rem', flexShrink: 0, marginRight: 10}} />
              <Icon path={mdiCheckCircle} size={1}
                onClick={() => { this.executeAction(this.handleEdit.bind(this)) }}
                style={{fill: 'white', height: '1.5rem', flexShrink: 0}} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.state.editing)
      this.titleInput.style.height = `${this.titleInput.scrollHeight}px`
  }

  executeAction(action) {
    if(!this.state.showing_actions) return
    action()
  }

  toggleActions(event) {
    const action_click = !!closest(event.target, '.actions-wrapper')
    if(action_click && this.state.showing_actions) return
    this.setState({ showing_actions: !this.state.showing_actions })
  }

  enableEdit() {
    this.setState({
      editing: !this.state.editing
    }, () => {
      this.titleInput.focus()
      this.titleInput.setSelectionRange(this.titleInput.value.length,
        this.titleInput.value.length)
    })
  }

  cancelEdit() {
    this.setState({
      editing: false, title: this.props.title
    })
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
    willChange: 'height, padding',
    overflow: 'hidden'
  },
  input: {
    fontSize: 16,
    background: 'none',
    border: 'none',
    color: 'white',
    height: 18
  },
  actions_wrapper: {
    flexShrink: 0,
    marginLeft: 10,
    height: 25,
    overflow: 'hidden'
  },
  actions_inner_wrapper: {
    display: 'flex',
    flexWrap: 'nowrap',
    transition: 'transform 0.1s ease-out',
    flexDirection: 'column',
    transitionProperty: 'transform, opacity',
    willChange: 'transform, opacity',
    opacity: 0
  },
  icon: {
    width: '1em',
    height: '1em',
    display: 'inline-block',
    fontSize: '1.5rem',
    transition: 'fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    willChange: 'fill',
    flexShrink: '0',
    userSelect: 'none'
  }
}

const mapStateToProps = state => {
  return { todos: state.todos }
}

export default connect(mapStateToProps)(Todo);
