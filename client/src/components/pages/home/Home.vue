<template>
  <div class="text-center">
    <h1 class="page-title" v-t="'home.page_title'"></h1>
    <p>Simple, fast, and free to play.</p>
    <p>Play with friends or compete against the best players in the world.</p>

    <p>
      <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank">
        <img src="https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg" alt="" />
      </a>
    </p>

    <div class="row">
      <b-button
        class="mx-auto"
        href="#"
        target="_blank"
        variant="primary"
        v-t="'navigation.play_now'"
      ></b-button>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style>
</style>