import React, { Component } from 'react';
import Todo from './Todo';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';

const SortableItem = SortableElement(({todo, blockDrag}) => <Todo id={todo.id} title={todo.title} blockDrag={blockDrag} />);

const SortableList = SortableContainer(({items, blockDrag}) => {
  return (
    <div className="todos" style={styles.todos_wrapper}>
      <a href="javascript:top.frames.location.reload();">atualizar</a>
      {items.map((todo, index) => (
        <SortableItem key={`item-${todo.id}`} index={index} todo={todo} blockDrag={blockDrag} />
      ))}
    </div>
  )
});

class TodoList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      new_todo_title: '',
      show_new_form: false,
      block_drag: false
    }
  }

  render() {
    return(
      <SortableList
        updateBeforeSortStart={(data, event) => { this.setState({ block_drag: true }); this.shakeTodo(data, event) }}
        blockDrag={this.state.block_drag}
        lockAxis='y'
        pressThreshold={20}
        pressDelay={200}
        items={this.props.todos}
        onSortEnd={this.onSortEnd.bind(this)} />
    )
  }

  shakeTodo({node, index, collection, isKeySorting}, event) {
    const todo = node.querySelector('.todo')
    todo.classList.add('shake')
    setTimeout(() => { todo.classList.remove('shake') }, 430)
  }

  onSortEnd({oldIndex, newIndex}) {
    this.setState({ block_drag: false })
    this.props.onSortEnd({oldIndex, newIndex})
  }
}

const styles ={
  todos_wrapper: {
    overflowX: 'hidden',
    boxSizing: 'border-box'
  }
}

export default TodoList;
