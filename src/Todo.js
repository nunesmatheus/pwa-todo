import React, { Component } from 'react';
import { openDB } from 'idb';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import * as idbu from './IDBUtilities';
import { connect } from 'react-redux';
import Icon from '@mdi/react'
import { mdiCloseCircle, mdiCheckCircle } from '@mdi/js'
import { closest } from './utils';

class Todo extends Component {

  constructor(props) {
    super(props)
    this.state = {
      hide: false,
      editing: false,
      title: props.title,
      showing_actions: false,
      active: false,
      currentX: null,
      currentY: null,
      xOffset: 0,
      yOffset: 0,
      initialX: null,
      initialY: null
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
      <div className="todo" style={style} onClick={this.toggleActions.bind(this)}
        ref={(ref) => this.todo = ref}
      >
        <span style={title_style}>{this.props.title}</span>

        <form onSubmit={this.handleEdit.bind(this)} style={{flexGrow: 1}}>
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
                onClick={(event) => { this.executeAction(this.handleEdit.bind(this), event) }}
                style={{fill: 'white', height: '1.5rem', flexShrink: 0}} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  componentDidMount() {
    this.container = document.querySelector(".todos");
    this.container.addEventListener("touchstart", this.dragStart.bind(this), false);
    this.container.addEventListener("touchend", this.dragEnd.bind(this), false);
    this.container.addEventListener("touchmove", this.drag.bind(this), false);

    this.container.addEventListener("mousedown", this.dragStart.bind(this), false);
    this.container.addEventListener("mouseup", this.dragEnd.bind(this), false);
    this.container.addEventListener("mousemove", this.drag.bind(this), false);
  }


  componentDidUpdate(prevProps, prevState) {
    if(this.state.editing)
      this.titleInput.style.height = `${this.titleInput.scrollHeight}px`
  }

  executeAction(action, event) {
    if(!this.state.showing_actions) return
    action(event)
  }

  toggleActions(event) {
    const action_click = !!closest(event.target, '.actions-wrapper')
    if(event.target.tagName == 'TEXTAREA') return
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
    this.setState({ editing: false, showing_actions: false })
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

  dragStart(e) {
    if (e.type === "touchstart") {
      this.setState({
        initialX: e.touches[0].clientX - this.state.xOffset,
        initialY: e.touches[0].clientY - this.state.yOffset
      })
    } else {
      this.setState({
        initialX: e.clientX - this.state.xOffset,
        initialY: e.clientY - this.state.yOffset
      })
    }

    if (e.target == this.todo || closest(e.target, '.todo')) {
        this.state.active = true;
      }
    }

    dragEnd(e) {
      this.setState({
        initialX: this.state.currentX,
        initialY: this.state.currentY
      })

      this.setState({ active: false })
    }

    drag(e) {
      if (this.state.active) {

        e.preventDefault();

        if (e.type === "touchmove") {
          this.setState({
            currentX: e.touches[0].clientX - this.state.initialX,
            currentY: e.touches[0].clientY - this.state.initialY
          })
        } else {
          this.setState({
            currentX: e.clientX - this.state.initialX,
            currentY: e.clientY - this.state.initialY
          })
        }

        this.setState({
          xOffset: this.state.currentX,
          yOffset: this.state.currentY
        })

        this.setTranslate(this.state.currentX, this.state.currentY, this.todo);
      }
    }

    setTranslate(xPos, yPos, el) {
      // el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
      el.style.transform = "translateX(" + xPos/3 + "px)";
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
    height: 18,
    width: '100%'
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
