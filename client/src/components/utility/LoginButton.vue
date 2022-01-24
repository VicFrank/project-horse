<template>
  <a href="/api/auth/steam">
    <img
      src="./steam_login.png"
      class="steam-button"
      alt="Steam Login Button"
    />
  </a>
</template>

<script>
export default {};
</script>

<style scoped>
.steam-button {
  border: 0;
  background: transparent;
  transition: all 0.15s ease;
}

.steam-button:hover {
  transform: translateY(-1px);
}
</style>
