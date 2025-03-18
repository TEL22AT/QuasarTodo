<template>
  <div class="q-px-lg">
    <h1>Welcome to movie blog</h1>
  </div>

  <!-- Sterne Rating -->
  <div class="q-pa-md">
    <div class="q-gutter-y-md column">
      <div class="row justify-start">
        <q-btn @click="incrementRating" icon="add" class="q-mr-sm" />
        <q-btn @click="decrementRating" icon="remove" />
      </div>
      <!-- <div class="q-pt-s">Das Rating ist: {{ ratingModel }}</div> -->
    </div>
    <q-btn
      @click="changeOrder()"
      :label="asc ? 'Sortiere Absteigend' : 'Sortiere Aufsteigend'"
      color="primary"
    ></q-btn>
  </div>
  <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
    <div class="q-pa-lg">
      <div class="q-col-gutter-md row items-start">
        <div v-for="movie in movies" :key="movie.id" class="col-6 col-md-4 col-lg-3">
          <q-img
            :src="'https://image.tmdb.org/t/p/w200' + movie.poster_path"
            @click="() => $router.push('/movie/' + movie.id)"
            style="cursor: pointer"
          >
            <div class="absolute-bottom text-subtitle1 text-center">
              {{ movie.title }} - {{ movie.vote_average }}
            </div>
          </q-img>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const movies = ref([])
const ratingModel = ref(3)
const param = ref('popularity')
const asc = ref(false)
// &sort_by=popularity.asc
const fetchMovies = async () => {
  const response = await fetch(
    `https://api.themoviedb.org/3/discover/movie?page=1&sort_by=${param.value}.${asc.value ? 'asc' : 'desc'}`,
    {
      headers: {
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ZGE3YzViNTJhYmE3NGFlMGM5ZTllZGY1N2MwNTMyOSIsInN1YiI6IjY1OTlkMGE1ODc0MWM0MDI1ODk0MWI2YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.sQR8VoqyKp4TmWwd6XYB-jtDZ21wALDDFgUrXnyfYYk',
      },
    },
  )
  const data = await response.json()
  movies.value = data.results
  for (const movie of movies.value) {
    movie.vote_average = normalizeRating(movie.vote_average)
  }
}
onMounted(async () => {
  fetchMovies()
})

const normalizeRating = (rating) => {
  return rating / 2
}

const incrementRating = () => {
  if (ratingModel.value < 5) {
    ratingModel.value++
  }
}

const changeOrder = () => {
  asc.value = !asc.value
  fetchMovies()
}
const decrementRating = () => {
  if (ratingModel.value > 0) {
    ratingModel.value--
  }
}
</script>

<style scoped>
.full-width {
  width: 100%;
}
</style>
