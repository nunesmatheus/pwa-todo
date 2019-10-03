import React from 'react';
import logo from './logo.svg';
import './App.css';
import TodoIndex from './TodoIndex';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { todoApp } from './reducers';

const store = createStore(todoApp)

function App() {
  return (
    <Provider store={store}>
      <TodoIndex />
    </Provider>
  );
}

export default App;
