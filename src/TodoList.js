import React, { Component } from 'react';

class TodoList extends Component {
  constructor(props) {
    super(props)
    this.state = { todos: [] }
  }

  render() {
    return(
      <div className="todos">
        {this.state.todos.map((todo) => {
          return(
            <div className="todo">
              <span>{todo.title}</span>
            </div>
          )
        })}
      </div>
    )
  }

  componentDidMount() {
    window.fetch('/todos')
      .then((response) => {
        return response.json()
      })
      .then((todos) => {
        this.setState({ todos: todos })
      })
  }
}

export default TodoList;
