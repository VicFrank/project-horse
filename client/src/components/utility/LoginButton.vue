<template>
  <a href="/api/auth/steam" class="sign-in-button">
    <img
      src="/images/site/steam_icon.png"
      class="steam-icon mr-1"
      alt="Steam Login Button"
    />
    Sign In
  </a>
</template>

<script>
export default {};
</script>

<style scoped>
.steam-icon {
  height: 1rem;
  width: 1rem;
}

.sign-in-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
  color: var(--secondary-color);
  border: 1px solid var(--secondary-color);
  text-transform: uppercase;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
}

.sign-in-button:hover {
  transform: translateY(-1px);
  filter: brightness(1.2);
}
</style>
