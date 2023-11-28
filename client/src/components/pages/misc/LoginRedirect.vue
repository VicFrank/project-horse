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
          const { photos, id, isAdmin, displayName, userType } = res.user;

          this.$store.commit({
            type: "SET_USER",
            steamID: id,
            username: displayName,
            picture: photos[2].value,
            isAdmin,
            userType,
          });

          const returnTo = this.$route.query.return;

          if (returnTo) {
            this.$router.push(returnTo);
          } else {
            // For some reason, this gets called twice, and the second time throws an error
            this.$router.push("/profile").catch(() => true);
          }
        } else {
          this.$store.commit({
            type: "LOG_OUT",
          });
          this.$router.push("");
        }
      });
  },
};
</script>
