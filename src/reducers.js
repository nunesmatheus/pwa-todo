const initialState = { todos: [] }
export function todoApp(state = initialState, action) {
  switch (action.type) {
    case 'SET TODOS':
      return Object.assign({}, state, { todos: action.todos })
    default:
      return state
  }
}
