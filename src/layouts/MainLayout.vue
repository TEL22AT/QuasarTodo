<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> Quasar App </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-img src="~/assets/mountains.jpg"> </q-img>
      <q-list>
        <q-item clickable to="/">
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section> Todo List </q-item-section>
        </q-item>
        <q-item clickable to="/help">
          <q-item-section avatar>
            <q-icon name="help" />
          </q-item-section>
          <q-item-section> Help </q-item-section>
        </q-item>
        <q-item to="/" clickable>
          <q-item-section avatar>
            <q-icon name="movie" />
          </q-item-section>
          <q-item-section>Movie Blog</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
