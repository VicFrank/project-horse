<template>
  <div></div>
</template>

<script>
export default {
  created() {
    fetch("/api/auth/steam/success", { credentials: "include" })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          const { photos, id, isAdmin } = res.user;

          this.$store.commit({
            type: "setUser",
            steamID: id,
            picture: photos[2].value,
            isAdmin,
          });

          const returnTo = this.$route.query.return;

          if (returnTo) {
            this.$router.push(returnTo);
          } else {
            this.$router.push("/profile");
          }
        } else {
          this.$store.commit({
            type: "setNotLoggedIn",
          });
          this.$router.push("");
        }
      });
  },
};
</script>
