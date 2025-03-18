<template>
  <div v-if="movie">
    <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
      <div class="row">
        <div class="col-md-4 flex-center" :span="10" :style="{ padding: '24px' }">
          <div>
            <img class="img" :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" />
          </div>
        </div>
      </div>
      <div class="col-md-8 flex-center" :span="12" :style="{ 'padding-left': '24px' }">
        <div>
          <h1>{{ movie.title }}</h1>
          <h2>ID: {{ $route.params.id }}</h2>
          <p>{{ movie.overview }}</p>
          <p class="text-subtitle2">Runtime: {{ movie.runtime }} minutes</p>
          <p class="text-subtitle2">Release date: {{ movie.release_date }}</p>
          <p>Spoken languages: {{ spokenLanguages }}</p>
          <p>Production companies: {{ productionCompanies }}</p>
          <p>Production countries: {{ productionCountries }}</p>
        </div>
      </div>
      <q-btn label="Add to Favorites" @click="addToFavorites(movie)" icon="add" />
      <q-rating v-model="rating" @click="addRating" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'
import { useQuasar } from 'quasar'

const { isAuthenticated, idTokenClaims } = useAuth0()

const $q = useQuasar()
const route = useRoute()
const movie = ref(null)
const spokenLanguages = ref('')
const productionCompanies = ref('')
const productionCountries = ref('')
const jwt = ref('')

onMounted(async () => {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${route.params.id}`, {
      headers: {
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ZGE3YzViNTJhYmE3NGFlMGM5ZTllZGY1N2MwNTMyOSIsInN1YiI6IjY1OTlkMGE1ODc0MWM0MDI1ODk0MWI2YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.sQR8VoqyKp4TmWwd6XYB-jtDZ21wALDDFgUrXnyfYYk',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    movie.value = await response.json()
  } catch (error) {
    console.error('Failed to fetch movie:', error)
  }
  if (movie.value) {
    if (movie.value.spoken_languages) {
      spokenLanguages.value = movie.value.spoken_languages
        .map((lang) => lang.english_name)
        .join(', ')
    }
    if (movie.value.production_companies) {
      productionCompanies.value = movie.value.production_companies
        .map((company) => company.name)
        .join(', ')
    }
    if (movie.value.production_countries) {
      productionCountries.value = movie.value.production_countries
        .map((country) => country.name)
        .join(', ')
    }
  }
})

const rating = ref(0)

async function addToFavorites(movie) {
  try {
    const response = await fetch('/api/movies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt.value}`,
      },
      body: JSON.stringify({
        title: movie.title,
        director: movie.director,
        year: movie.release_date.split('-')[0],
        movieId: movie.id,
        ImdbRate: movie.vote_average,
        personalRating: 0,
      }),
    })
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    $q.notify({
      color: 'positive',
      position: 'bottom',
      message: 'Movie added to favorites',
    })
  } catch (error) {
    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: 'Error adding movie to favorites',
    })
    console.error('Error fetching movies:', error)
  }
}
async function addRating() {
  console.log('Add rating')
  console.log(rating)
  try {
    const response = await fetch('/api/movies/' + movie.value.id, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt.value}`,
      },
      body: JSON.stringify({ personalRating: rating.value }),
    })
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
  } catch (error) {
    console.error('Error fetching movies:', error)
  }
}

onMounted(async () => {
  if (isAuthenticated.value) {
    jwt.value = idTokenClaims.value.__raw
  }
})
watch(isAuthenticated.value, (newVal) => {
  if (newVal) {
    jwt.value = idTokenClaims.value.__raw
  }
})
</script>

<style scoped></style>
