<template>
  <div class="main-layout__content">
    <div class="content">
      <h1 class="page-title">Gaimin Check</h1>
      <div class="container text-center">
        <p>
          Input is expected to be a list of steam ids, with each steam id on its
          own line
        </p>
        <b-form-file
          v-model="gaiminFile"
          @input="doGaiminCheck"
          placeholder="Choose a file or drop it here..."
          drop-placeholder="Drop file here..."
          style="max-width: 400px"
        ></b-form-file>

        <div
          class="mt-3 mx-auto"
          v-if="gaiminResults.length > 0"
          style="max-width: 600px"
        >
          <b-table
            striped
            hover
            :items="gaiminResults"
            :fields="['username', 'connected']"
          >
            <template #cell(steamID)="data">
              <a
                :href="'https://steamcommunity.com/profiles/' + data.value"
                target="_blank"
              >
                {{ data.value }}
              </a>
            </template>
            <template #cell(connected)="data">
              <b-badge
                :variant="data.value ? 'success' : 'danger'"
                class="text-capitalize"
              >
                <template v-if="data.item.notFound">
                  <b-badge variant="danger">Not Found</b-badge>
                </template>
                <template v-else>
                  {{ data.value ? "connected" : "not connected" }}
                </template>
              </b-badge>
            </template>
          </b-table>
        </div>

        <p class="mt-3">Example of a valid file</p>
        <pre
          style="
            background-color: #282c34;
            color: white;
            width: 200px;
            margin: auto;
          "
          class="py-3"
        >
Morbius
SUNSfan
TANGOMANGOPANGO
Ederick</pre
        >

        <hr />
        <h2 class="page-title">MMR Check</h2>
        <p>Input is a list of usernames, with each name on its own line</p>
        <b-form-file
          v-model="usernameFile"
          @input="doMMRCheck"
          placeholder="Choose a file or drop it here..."
          drop-placeholder="Drop file here..."
          style="max-width: 400px"
        ></b-form-file>

        <div
          class="mt-3 mx-auto"
          v-if="usernameResults.length > 0"
          style="max-width: 600px"
        >
          <pre
            style="background-color: #282c34; color: white; margin: auto"
            class="py-3"
          >
<template v-for="result in usernameResults">{{result}}
</template></pre>
        </div>

        <p class="mt-3">Example of a valid file</p>
        <pre
          style="
            background-color: #282c34;
            color: white;
            width: 200px;
            margin: auto;
          "
          class="py-3"
        >
Morbius
SUNSfan
TANGOMANGOPANGO
Ederick</pre
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    gaiminFile: null,
    usernameFile: null,
    loading: false,
    gaiminResults: [],
    usernameResults: [],
  }),

  methods: {
    doGaiminCheck() {
      const file = this.gaiminFile;
      if (!file) return;

      // File is expected to be a one column .csv with no header row
      // Parse it into an array
      let steamIDs = [];
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const lines = text.split("\n");
        steamIDs = lines.map((line) => line.trim());

        // Now we have the data, we can send it to the server
        this.loading = true;
        fetch("/api/players/gaimin/check", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ steamIDs }),
        })
          .then((res) => res.json())
          .then((data) => {
            this.loading = false;
            this.gaiminResults = data;
          })
          .catch((err) => {
            this.loading = false;
            this.gaiminResults = [];
            this.$bvToast.toast("Error doing Gaimin Check", {
              title: "Error",
              variant: "danger",
              solid: true,
            });
            console.error(err);
          });
      };

      reader.readAsText(file);

      this.gaiminFile = null;
    },

    doMMRCheck() {
      const file = this.usernameFile;
      if (!file) return;

      // File is expected to be a one column .csv with no header row
      // Parse it into an array
      let usernames = [];
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const lines = text.split("\n");
        usernames = lines.map((line) => line.trim());

        // Now we have the data, we can send it to the server
        this.loading = true;
        fetch("/api/players/tournaments/checkMMRs", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ usernames }),
        })
          .then((res) => res.json())
          .then((data) => {
            this.loading = false;
            this.usernameResults = data;
          })
          .catch((err) => {
            this.loading = false;
            this.usernameResults = [];
            this.$bvToast.toast("Error doing MMR Check", {
              title: "Error",
              variant: "danger",
              solid: true,
            });
            console.error(err);
          });
      };

      reader.readAsText(file);

      this.usernameFile = null;
    },
  },
};
</script>

<style></style>
