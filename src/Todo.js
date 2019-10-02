import React, { Component } from 'react';
import { openDB } from 'idb';
import DeleteIcon from '@material-ui/icons/Delete';

const styles = {
  todo: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: '20px 14px',
    backgroundColor: '#1d1d1d',
    borderBottom: '1px solid #242424',
    color: 'white',
    transition: 'height 0.1s ease-out',
    transitionProperty: 'height, padding',
    overflow: 'hidden'
  }
}

class Todo extends Component {

  constructor(props) {
    super(props)
    this.state = { hide: false }
  }

  render() {
    console.log(`hide: ${this.state.hide}`)
    const height = this.state.hide ? 0 : 'auto'
    const style = {...styles.todo, height: height}
    if(this.state.hide) style.padding = 0
    return(
      <div className="todo" style={style}>
        <span>{this.props.title}</span>
        <span style={{fontWeight: 'bold'}}
          onClick={this.remove.bind(this)}><DeleteIcon /></span>
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
}

export default Todo;
