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
        lockAxis='y'
        pressThreshold={20}
        pressDelay={200}
        items={this.props.todos}
        onSortEnd={this.props.onSortEnd} />
    )
  }
}

const styles ={
  todos_wrapper: {
    overflowY: 'scroll',
    height: '100vh',
    backgroundColor: '#242424',
    paddingBottom: 100,
    boxSizing: 'border-box'
  }
}

export default TodoList;
