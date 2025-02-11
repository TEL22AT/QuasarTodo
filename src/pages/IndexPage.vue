<template>
  <q-page>
    <q-input v-model="newTodo">
      <template v-slot:append>
        <q-btn flat round icon="add" @click="addTodo" />
      </template>
    </q-input>
    <q-list bordered separator>
      <q-item v-for="(todo, index) in todos" :key="todo">
        <q-item-section avatar>
          <q-checkbox v-model="todo.done" />
        </q-item-section>
        <q-item-section :class="todo.done ? 'text-strike' : ''">
          {{ todo.text }} - {{ todo.done }}
        </q-item-section>
        <q-item-section side>
          <q-btn flat round icon="delete" @click="todosStore.deleteTodo(index)" />
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useTodosStore } from 'src/stores/todosStore'
const newTodo = ref('')

const todosStore = useTodosStore()

const todos = todosStore.todos

function addTodo() {
  todosStore.addTodo(newTodo.value)
  // console.log('Todos:', todos.value)
  // console.log('Adding todo:', newTodo.value)
}
</script>
