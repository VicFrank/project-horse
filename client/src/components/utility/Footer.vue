<template>
  <footer class="d-flex justify-content-end align-items-center">
    <div class="d-none d-md-flex">
      <a
        href="https://www.youtube.com/user/DotaCinema"
        target="_blank"
        class="fa fa-youtube mr-3"
      ></a>
      <a
        href="https://www.twitch.tv/sunsfantv"
        target="_blank"
        class="fa fa-twitch mr-3"
      ></a>
      <a
        href="http://discord.gg/sunsfan"
        target="_blank"
        class="fab fa-discord mr-3"
      ></a>
      <a
        href="https://www.reddit.com/r/DotaCinema/"
        target="_blank"
        class="fa fa-reddit mr-3"
      ></a>
      <a
        href="https://twitter.com/DotaCinema"
        target="_blank"
        class="fa fa-twitter mr-3"
      ></a>
      <a
        href="https://www.facebook.com/DotaCinema/"
        target="_blank"
        class="fa fa-facebook mr-3"
      ></a>
    </div>
    {{ $t("credits.copyright") }}
    <router-link to="/credits" class="float-right ml-3 mr-5">{{
      $t("credits.our_team")
    }}</router-link>
  </footer>
</template>

<script>
export default {};
</script>

<style scoped>
footer {
  bottom: 0;

  width: 100%;
  height: 40px;

  background-color: rgb(26, 35, 43);
  color: #cecece;
}

a {
  color: #0b86c4;
}

.fa {
  color: #0b86c4;
}
</style>
