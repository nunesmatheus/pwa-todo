import React, { Component } from 'react';
import Todo from './Todo';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import iNoBounce from 'inobounce';

const SortableItem = SortableElement(({todo, removeTodoById}) => <Todo id={todo.id} title={todo.title} removeTodoById={removeTodoById} />);

const SortableList = SortableContainer(({items, removeTodoById}) => {
  return (
    <div className="todos" style={styles.todos_wrapper}>
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
        lockAxis='y'
        pressThreshold={20}
        pressDelay={200}
        items={this.props.todos}
        removeTodoById={this.props.removeTodoById}
        onSortEnd={this.props.onSortEnd} />
    )
  }
}

const styles ={
  todos_wrapper: {
    overflowY: 'scroll',
    height: '100vh',
    backgroundColor: '#242424',
    paddingBottom: 90
  }
}

export default TodoList;
