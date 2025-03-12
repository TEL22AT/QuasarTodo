<template>
  <div class="q-px-lg">
    <h1>Welcome to movie blog</h1>
    {{ movie.title }} - {{ movie.vote_average }}
  </div>
  <q-rating v-model="rating" @click="addRating" />
</template>

<script setup>
import { ref } from 'vue'
import { onMounted } from 'vue'
const movie = {
  id: 234,
  title: 'The Shawshank Redemption',
  vote_average: 9.3,
}
const favoriteMovie = ref()
const fetchMovies = async () => {
  try {
    const response = await fetch('/api/movies')
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const data = await response.json()
    console.log(data)
    favoriteMovie.value = data.find((movie) => movie._id === movie.id)
  } catch (error) {
    console.error('Error fetching movies:', error)
  }
}
onMounted(async () => {
  fetchMovies()
})

const rating = ref(0)

async function addRating() {
  console.log('Add rating')
  console.log(rating)
  try {
    const response = await fetch('/api/movies/' + favoriteMovie.value._id, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ImdbRate: rating.value }),
    })
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
  } catch (error) {
    console.error('Error fetching movies:', error)
  }
}
</script>

<style scoped></style>
