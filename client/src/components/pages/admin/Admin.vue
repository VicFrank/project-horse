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
            <b-tab title-link-class="tab" title="Gods" lazy>
              <GodsAdmin />
            </b-tab>
            <b-tab title-link-class="tab" title="Abilities" lazy>
              <AbilitiesAdmin />
            </b-tab>
            <b-tab title-link-class="tab" title="Codes" lazy>
              <RedemptionCodes />
            </b-tab>
            <b-tab title-link-class="tab" title="Announcements" lazy>
              <AnnouncementsAdmin />
            </b-tab>
            <b-tab title-link-class="tab" title="Cosmetics" lazy>
              <CosmeticsAdmin />
            </b-tab>
          </b-tabs>
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
import PlayersAdmin from "./components/PlayersAdmin";
import GodsAdmin from "./components/GodsAdmin";
import RedemptionCodes from "./components/RedemptionCodes";
import AnnouncementsAdmin from "./components/AnnouncementsAdmin";
import CosmeticsAdmin from "./components/CosmeticsAdmin";
import AbilitiesAdmin from "./components/AbilitiesAdmin";
export default {
  components: {
    PlayersAdmin,
    GodsAdmin,
    RedemptionCodes,
    AnnouncementsAdmin,
    CosmeticsAdmin,
    AbilitiesAdmin,
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
