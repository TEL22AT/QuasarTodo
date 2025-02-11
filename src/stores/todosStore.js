import { defineStore } from 'pinia'

export const useTodosStore = defineStore('todos', {
  state: () => ({
    todos: [],
  }),

  getters: {
    doubleCount: (state) => state.counter * 2,
  },

  actions: {
    addTodo(text) {
      this.todos.push({ text, done: false })
    },
    deleteTodo(index) {
      this.todos.splice(index, 1)
    },
    toggleTodo(index) {
      this.todos[index].done = !this.todos[index].done
    },
  },
  persist: true,
})
