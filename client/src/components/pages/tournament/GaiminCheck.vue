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
          v-model="file"
          @input="onFileChange"
          placeholder="Choose a file or drop it here..."
          drop-placeholder="Drop file here..."
          style="max-width: 400px"
        ></b-form-file>

        <div
          class="mt-3 mx-auto"
          v-if="results.length > 0"
          style="max-width: 600px"
        >
          <b-table
            striped
            hover
            :items="results"
            :fields="['steamID', 'username', 'connected']"
          >
            <template #cell(steamID)="data">
              <a
                :href="'https://steamcommunity.com/profiles/' + data.value"
                target="_blank"
              >
                {{ data.value }}
              </a>
            </template>
            <template #cell(username)="data">
              <template v-if="data.item.notFound">
                <b-badge variant="danger">Not Found</b-badge>
              </template>
              <template v-else>
                {{ data.value }}
              </template>
            </template>
            <template #cell(connected)="data">
              <b-badge
                :variant="data.value ? 'success' : 'danger'"
                class="text-capitalize"
              >
                {{ data.value ? "connected" : "not connected" }}
              </b-badge>
            </template>
          </b-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    file: null,
    loading: false,
    results: [],
  }),

  methods: {
    onFileChange() {
      const file = this.file;
      if (!file) return;

      console.log("File changed", file);

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
            this.results = data;
          })
          .catch((err) => {
            this.loading = false;
            this.results = [];
            console.error(err);
          });
      };

      reader.readAsText(file);

      this.file = null;
    },
  },
};
</script>

<style></style>
