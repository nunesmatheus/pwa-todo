import React, { Component } from 'react';
import Todo from './Todo';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';

const SortableItem = SortableElement(({todo}) => <Todo id={todo.id} title={todo.title} />);

const SortableList = SortableContainer(({items}) => {
  return (
    <div className="todos" style={styles.todos_wrapper}>
      {items.map((todo, index) => (
        <SortableItem key={`item-${index}`} index={index} todo={todo} />
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
        updateBeforeSortStart={this.shakeTodo.bind(this)}
        lockAxis='y'
        pressThreshold={20}
        pressDelay={200}
        items={this.props.todos}
        onSortEnd={this.props.onSortEnd} />
    )
  }

  shakeTodo({node, index, collection, isKeySorting}, event) {
    node.classList.add('shake')
    setTimeout(() => {
      node.classList.remove('shake')
    }, 430)
  }
}

const styles ={
  todos_wrapper: {
    boxSizing: 'border-box'
  }
}

export default TodoList;
