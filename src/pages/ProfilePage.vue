<template>
  <h1>User Profile</h1>
  <q-card class="q-pa-md q-mx-auto" style="max-width: 350px">
    <!-- Profile Picture -->
    <q-img :src="user.picture" style="height: 300px; border-radius: 8px" fit="cover" />

    <!-- User Info -->
    <q-card-section class="text-center">
      <div class="text-h6">{{ user.name }}</div>
      <div class="text-subtitle2 text-grey">{{ user.email }}</div>
    </q-card-section>
  </q-card>
  <h2>Movie Table</h2>
  {{ movieList[0] }}
  <br /><br />
  <!-- id: {{ movieList[0]._id }} <br />title: {{ movieList[0].title }} <br />director:
  {{ movieList[0].director }} <br />
  userId: {{ movieList[0].userId }} -->

  <q-btn @click="deleteMovie()">Delete</q-btn>
  <q-btn>Modify Movie Entry</q-btn>
  <div class="q-pa-md" v-if="isAuthenticated">
    <q-table
      flat
      bordered
      title="Treats"
      :rows="movieList"
      :columns="columns"
      row-key="_id"
      selection="multiple"
      v-model:selected="selected"
    />

    <div class="q-mt-md">Selected: {{ JSON.stringify(selected) }}</div>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useAuth0 } from '@auth0/auth0-vue'

const { isAuthenticated, user } = useAuth0()

const $q = useQuasar()

const movieList = ref([])
const selected = ref([])
const columns = [
  {
    name: 'title',
    required: true,
    label: 'Movie Title',
    align: 'left',
    field: (row) => row.title,
    format: (val) => `${val}`,
    sortable: true,
  },
  { name: 'director', align: 'center', label: 'Director', field: 'director', sortable: true },
  { name: 'year', label: 'Year', field: 'year', sortable: true },
  { name: 'userId', label: 'User ID', field: 'userId' },
]

const fetchMovies = async () => {
  try {
    const response = await fetch('/api/movies')
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const data = await response.json()
    console.log(data)
    movieList.value = data
  } catch (error) {
    console.error('Error fetching movies:', error)
  }
}

const deleteMovie = async () => {
  if (selected.value.length === 0) {
    return
  }
  for (const movie of selected.value) {
    try {
      const response = await fetch(`/api/movies/${movie._id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      await fetchMovies()
      $q.notify({
        color: 'positive',
        position: 'bottom',
        message: 'Movie deleted',
      })
    } catch (error) {
      $q.notify({
        color: 'negative',
        position: 'bottom',
        message: 'Error deleting movie',
      })
      console.error('Error deleting movie:', error)
    }
  }
}
onMounted(async () => {
  await fetchMovies()
})
</script>
