<template>
  <div style="max-width: 1200px">
    <h1 class="page-title" v-t="'changelog.page_title'"></h1>
    <div class="pl-3 change-log">
      <h2>Update 4.0b 1/7/2023</h2>

      <h3>General</h3>

      <ul>
        <li>
          Created a "Limited Time" box in the Store that will rotate
          periodically
        </li>
        <li>Fixed Battlepass getting cut off for higher resolutions</li>
        <li>Made chests past level 80 more clear with info hover</li>
        <li>
          Opening Battlepass will now default to your current level instead of
          level 1
        </li>
        <li>Gaining XP and Gold should be more responsive now</li>
      </ul>

      <h3>Gods</h3>
      <ul>
        <li>
          Faceless Void added visual and sound FX for when the March of Time
          triggers
        </li>
        <li>Jmuy fixes for moving spells resetting cooldown</li>
        <li>Prellex creep magic resistance lowered from 75 to 60%</li>
        <li>Prellex creep damage from 25/50/75/100/125 to 15/30/45/60/75</li>
        <li>Prellex creep gets an increase of 3 base damage every round</li>
        <li>Prellex Potato creep's death throe aoe increased to global</li>
        <li>Prellex Tomato creep's death throe aoe increased to global</li>
        <li>
          Techies fixed abilities not dealing damage when the hero spawning them
          dies right before
        </li>
      </ul>
      <h3>Spells</h3>
      <ul>
        <li>Chakra Magic re-enabled</li>
        <li>
          Chakra Magic fixed interaction with spells going to 0 cooldown casting
          many times
        </li>
        <li>
          Corrosive Haze Gaben fixed to not target allies sometimes in the AOE
        </li>
        <li>Earth Shock slow duration from 4 to 3</li>
        <li>Epicenter fixed to not be dispellable</li>
        <li>
          Essence Flux bug fixed that allowed it to proc on abilities like
          Impetus and Pulse Nova.
        </li>
        <li>
          We put in a potential fix to units standing around awkwardly when the
          enemy they were targetting becomes untargetable (affects Tricks of the
          Trade, Shadow Dance, and Depth Shroud)
        </li>
      </ul>
      <div v-for="change of changes" :key="change.timestamp">
        <h3 v-if="change.title">{{ change.title }}</h3>
        <h4>
          {{ $t("changelog.update") }}:
          {{ getTime(change.timestamp * 1000) }}
        </h4>
        <ul>
          <li v-for="line of change.lines" :key="line">{{ line }}</li>
        </ul>
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
          let description = change.change_description;
          const tags = ["[b]", "[/b]", "[*]", "[/list]"];

          for (let tag of tags) {
            description = description.replace(tag, "");
          }

          // parse underlines
          let underlineStart = description.indexOf("[u]");
          let underlineEnd = description.indexOf("[/u]");
          let title;

          if (underlineStart >= 0 && underlineEnd >= 0) {
            title = description.substring(underlineStart + 3, underlineEnd);
          }

          let lines = description.split(/\r?\n/);

          if (title) lines.shift();

          lines = lines
            .map((line) => {
              //filter out all tags
              for (let tag of tags) {
                line = line.replace(tag, "");
              }
              if (line.charAt(0) === "*") {
                return line.substring(2);
              }
              return line;
            })
            .filter((line) => line != "");

          return {
            ...change,
            title,
            lines,
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