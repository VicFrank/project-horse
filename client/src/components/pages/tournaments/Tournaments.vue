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
                  v-t="'tournaments.results'"
                ></b-button>
              </td>
            </tr>
            <tr>
              <td class="text-left">Season 2 Tournament</td>
              <td class="text-left">Nov 19-20, 2022</td>
              <td class="text-left">
                <b-button
                  href="https://www.communitygaming.io/tournament/ability-arena-2"
                  target="_blank"
                  variant="primary"
                  v-t="'tournaments.results'"
                ></b-button>
              </td>
            </tr>
            <tr>
              <td class="text-left">Season 3 Tournament</td>
              <td class="text-left">Dec 17-18, 2022</td>
              <td class="text-left">
                <b-button
                  href="https://battlefy.com/double-edge-studios/ability-arena-3/63916e89b1a0235b899acc5b/info?infoTab=details"
                  target="_blank"
                  variant="primary"
                  v-t="'tournaments.results'"
                ></b-button>
              </td>
            </tr>
            <tr>
              <td class="text-left">Season 4 Tournament</td>
              <td class="text-left">Jan 22, 2023</td>
              <td class="text-left">
                <b-button
                  href="https://battlefy.com/double-edge-studios/ability-arena-4/63c33b1efaa0b303780d8399/info?infoTab=details"
                  target="_blank"
                  variant="primary"
                  v-t="'tournaments.results'"
                ></b-button>
              </td>
            </tr>
            <tr>
              <td class="text-left">Season 5 Tournament</td>
              <td class="text-left">Mar 18, 2023</td>
              <td class="text-left">
                <b-button
                  href="https://battlefy.com/double-edge-studios/ability-arena-5/640b73e43e0bbd1f08e1572a/info?infoTab=details"
                  target="_blank"
                  variant="primary"
                  v-t="'tournaments.results'"
                ></b-button>
              </td>
            </tr>
            <tr>
              <td class="text-left">Gaimin Tournament 1</td>
              <td class="text-left">April 13, 2024</td>
              <td class="text-left">
                <b-button
                  href="https://battlefy.com/double-edge-games/ability-arena-x-gaimin-1st-1000-monthly-tournament/6615cc26baff35146c22c020/info?infoTab=details"
                  target="_blank"
                  variant="primary"
                  v-t="'tournaments.results'"
                ></b-button>
              </td>
            </tr>
            <tr>
              <td class="text-left">Gaimin Tournament 2</td>
              <td class="text-left">May 18, 2024</td>
              <td class="text-left">
                <b-button
                  href="https://battlefy.com/double-edge-games/ability-arena-x-gaimin-monthly-tournament-2/663737493a2aa70bc97aeb23/info"
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

<style></style>
