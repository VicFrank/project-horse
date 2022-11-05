<template>
  <div>
    <h1 class="page-title" v-t="'tournaments.page_title'"></h1>
    <div class="container text-center">
      <div class="my-stats">
        <table class="table">
          <tbody>
            <tr>
              <td class="tb-head text-left">
                {{ $t("tournaments.tournament") }}
              </td>
              <td class="tb-head text-left">{{ $t("tournaments.date") }}</td>
              <td class="tb-head text-left">{{ $t("tournaments.results") }}</td>
            </tr>
            <tr>
              <td class="text-left">Streamer Launch Tournament</td>
              <td class="text-left">September 21, 2022</td>
              <td class="text-left"></td>
            </tr>
            <tr>
              <td class="text-left">Season 1 Tournament</td>
              <td class="text-left">September 28, 2022</td>
              <td class="text-left">
                <b-button
                  href="https://www.communitygaming.io/tournament/ability-arena-1"
                  target="_blank"
                  variant="primary"
                  v-t="'tournaments.sign_up'"
                ></b-button>
              </td>
            </tr>
            <tr>
              <td class="text-left">Season 2 Tournament</td>
              <td class="text-left">Nov 5, 2022</td>
              <td class="text-left">
                <b-button
                  href="https://www.communitygaming.io/tournament/ability-arena-2"
                  target="_blank"
                  variant="primary"
                  v-t="'tournaments.sign_up'"
                ></b-button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template> 

<script>
export default {};
</script>

<style>
</style>