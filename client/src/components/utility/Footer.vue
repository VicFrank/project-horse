<template>
  <footer class="d-flex justify-content-end align-items-center">
    <div class="d-none d-md-flex">
      <!-- <a
        href="https://www.youtube.com/user/DotaCinema"
        target="_blank"
        class="fa fa-youtube mr-3"
      ></a> -->
      <a
        href="https://www.twitch.tv/sunsfantv"
        target="_blank"
        alt="Twitch"
        class="fa fa-twitch mr-3"
      ></a>
      <a
        href="https://www.twitch.tv/420jenkins"
        target="_blank"
        alt="Twitch, but Jenkins"
        class="fa fa-twitch mr-3"
      ></a>
      <a
        href="https://discord.gg/NRDjuTPNvS"
        target="_blank"
        alt="Discord"
        class="fab fa-discord mr-3"
      ></a>
      <a
        href="https://www.reddit.com/r/abilityarena/"
        target="_blank"
        alt="Reddit"
        class="fa fa-reddit mr-3"
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
  color: var(--primary-color);
}

.fa {
  color: var(--primary-color);
}
</style>
