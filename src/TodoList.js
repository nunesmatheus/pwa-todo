import React, { Component } from 'react';
import Todo from './Todo';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';

const SortableItem = SortableElement(({todo, removeTodoById}) => <Todo id={todo.id} title={todo.title} removeTodoById={removeTodoById} />);

const SortableList = SortableContainer(({items, removeTodoById}) => {
  return (
    <div className="todos" style={{overflowY: 'scroll', height: '100vh'}}>
      {items.map((todo, index) => (
        <SortableItem key={`item-${index}`} index={index} todo={todo} removeTodoById={removeTodoById} />
      ))}
    </div>
  );
});

class TodoList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      todos: [],
      new_todo_title: '',
      show_new_form: false
    }
  }

  render() {
    return(
      <SortableList
        transitionDuration={0}
        pressThreshold={20}
        pressDelay={200}
        useWindowAsScrollContainer={true}
        items={this.props.todos}
        removeTodoById={this.props.removeTodoById}
        onSortEnd={this.props.onSortEnd} />
    )
  }
}

export default TodoList;
