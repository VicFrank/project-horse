<template>
  <div class="main-layout__content">
    <div class="content">
      <h1 class="page-title">Admin</h1>
      <div class="container">
        <b-card no-body>
          <b-tabs pills card>
            <b-tab title-link-class="tab" title="Players" active>
              <PlayersAdmin />
            </b-tab>
          </b-tabs>
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
import PlayersAdmin from "./components/PlayersAdmin";
export default {
  components: {
    PlayersAdmin,
  },
};
</script>

<style scoped>
.tab {
  color: black !important;
  font-size: 16px;
  letter-spacing: normal;
}

.tab.active {
  color: white !important;
}

.card-body {
  color: black;
}
</style>
