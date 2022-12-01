<template>
  <div style="max-width: 1200px">
    <h1 class="page-title" v-t="'changelog.page_title'"></h1>
    <div class="pl-3 change-log">
      <div v-for="change of changes" :key="change.timestamp">
        <h3>
          {{ $t("changelog.update") }}:
          {{ getTime(change.timestamp * 1000) }}
        </h3>
        <div v-html="change.contents" class="change-block"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    error: "",
    changes: [],
  }),

  created() {
    fetch("/api/steam/changelog")
      .then((res) => res.json())
      .then((res) => {
        let changes = res.changes;

        changes = changes.map((change) => {
          let description = change.change_description.split("\n").map(line => {
            // I'm only doing specific sites to maybe lower the chance of xss (shrug)

            // [URL]'s
            line = line.replaceAll(/\[url=(https:\/\/abilityarena\.com\S*)\](.*?)\[\/url]/dg, (matched, urlCapture, linkTextCapture) => `<a href="${urlCapture}">${linkTextCapture}</a>`)
            // links, make sure they don't start with " so we don't re-link things that are already <a href="link"
            line = line.replaceAll(/[^"](https:\/\/abilityarena\.com[\w/=?&]*)/g, (matched, urlCapture) => `${matched.charAt(0)}<a href="${urlCapture}">${urlCapture}</a>`)
            // Things that are **like this**
            line = line.replaceAll(/\*\*(.*?)\*\*/g, (_, boldMe) => `<h4>${boldMe}</h4>`)
            // TODO [img] tags I guess

            return line;
          }
          )
          description.push('<hr style="border: 2px solid var(--primary-color-dark);">')
          return {
            timestamp: change.timestamp,
            contents: description.join('<br>')
          };
        });

        this.changes = changes;
      })
      .catch((err) => console.error(err));
  },

  methods: {
    getTime(timestamp) {
      return new Date(timestamp).toLocaleDateString("en-us");
    },
  },
};
</script>

<style scoped>
pre {
  color: #808080;
}

p {
  color: #808080;
  font-size: 18px;
  line-height: 1.4;
}

li {
  line-height: 1.4;
}

ul {
  padding-bottom: 10px;
}

</style>