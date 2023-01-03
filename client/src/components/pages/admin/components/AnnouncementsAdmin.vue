<template>
  <div>
    <b-button v-b-toggle.collapse-1 variant="secondary" class="mt-3">
      Formatting Tips
    </b-button>
    <b-collapse id="collapse-1" class="mt-2 mb-2">
      <b-alert show variant="info" class="mt-3">
        <b>Formatting Tips:</b>
        <ul>
          <li>
            <b>Links:</b> Use the <code>&lt;a&gt;</code> tag to create links.
            <code
              >&lt;a href="https://abilityarena.com"&gt;Ability
              Arena&lt;/a&gt;</code
            >
            will create a link to this site. Images will not be styled.
          </li>
          <li>
            <b>Images:</b> Use the <code>&lt;img&gt;</code> tag to create
            images. For example,<br />
            <code
              >&lt;img
              src="https://abilityarena.com/images/site/ability_arena_logo_nav.png"&gt;</code
            >
            will create an image of our logo.
          </li>
          <li>
            <b>Line Breaks:</b> Use the <code>&lt;br&gt;</code> tag to create
            line breaks. For example,
            <code>&lt;h1&gt;Hello&lt;br&gt;World&lt;/h1&gt;</code>
            will create a heading with "Hello" on one line and "World" on the
            next.
          </li>
          <li>
            <b>Headings:</b> Use the <code>&lt;h1&gt;</code> through
            <code>&lt;h6&gt;</code> tags to create headings. For example,
            <code>&lt;h1&gt;Hello&lt;/h1&gt;</code> will create a large heading
            with "Hello".
          </li>
          <li>
            <b>Paragraphs:</b> Use the <code>&lt;p&gt;</code> tag to create
            paragraphs. For example, <code>&lt;p&gt;Hello&lt;/p&gt;</code> will
            create a paragraph with "Hello".
          </li>
          <li>
            <b>Lists:</b> Use the <code>&lt;ul&gt;</code> and
            <code>&lt;ol&gt;</code> tags to create unordered and ordered lists.
            For example,
            <code>&lt;ul&gt;&lt;li&gt;Hello&lt;/li&gt;&lt;/ul&gt;</code> will
            create an unordered list with "Hello" as the only item.
          </li>
          <li>
            <b>Text Styles:</b> Use the <code>&lt;b&gt;</code>,
            <code>&lt;i&gt;</code>, and <code>&lt;u&gt;</code> tags to create
            bold, italic, and underlined text. For example,
            <code>&lt;b&gt;Hello&lt;/b&gt;</code> will create bold text with
            "Hello".
          </li>
          <li>
            <b>Text Color:</b> Use the
            <code>style="color: #FF0000"</code> attribute to change the color of
            text. For example, &lt;span style="color: #FF0000"&gt;<code
              style="color: #ff0000"
              >Red</code
            >&lt;/span&gt; will create red text.
          </li>
          <li>
            <b>Text Size:</b> Use the
            <code>style="font-size: 20px"</code> attribute to change the size of
            text. For example, &lt;span style="font-size: 20px"&gt;<code
              style="font-size: 20px"
              >Big</code
            >&lt;/span&gt; will create big text.
          </li>
        </ul>
      </b-alert>
    </b-collapse>

    <h2>Default Announcements</h2>
    <div
      v-for="announcement in defaultAnnouncements"
      :key="announcement.announcement_id"
    >
      <b-form-group
        id="input-group-2"
        :label="announcement.language"
        label-for="input-2"
        class="mt-3"
      >
        <b-form-input
          type="text"
          v-model="announcement.text"
          placeholder="Enter the announcement"
        ></b-form-input>
        <b-form-input
          type="text"
          v-model="announcement.link"
          placeholder="Enter the image link (optional) must be 180x350"
          class="mt-1"
        ></b-form-input>
        <div
          v-if="announcement.text"
          class="p-3 mt-3"
          style="width: 350px; background-color: #292a37; color: #b5b5b7"
        >
          <div
            class="text-center"
            style="
              color: #a47ef8;
              text-shadow: black 1px 2px 2px 2;
              font-size: 20px;
              margin-bottom: 20px;
            "
          >
            ANNOUNCEMENT
          </div>
          <div v-html="announcement.text" class="mt-3"></div>
          <img
            v-if="announcement.link"
            :src="announcement.link"
            style="background-color: #292a37"
          />
        </div>
      </b-form-group>
    </div>

    <h2>Scheduled Announcements</h2>
    <div>
      These announcements are scheduled to go out on specific days of the week.
      They override the default announcment on that day.
    </div>

    <div>
      <b-button
        variant="primary"
        class="mt-3"
        @click="addScheduledAnnouncement"
      >
        Add Scheduled Announcement
      </b-button>
    </div>
    <div
      v-for="(announcement, index) in scheduledAnnouncements"
      :key="announcement.announcement_id"
    >
      <b-form-group id="input-group-2" label-for="input-2" class="mt-3">
        <!-- delete button -->
        <b-button
          variant="danger"
          class="float-right"
          @click="deleteScheduledAnnouncement(index)"
        >
          Delete
        </b-button>
        <b-form-select
          v-model="announcement.day_of_week"
          :options="days"
          class="mt-1"
          required
        ></b-form-select>
        <b-form-select
          v-model="announcement.language"
          :options="languages"
          class="mt-1"
          required
        ></b-form-select>
        <b-form-input
          type="text"
          v-model="announcement.text"
          placeholder="Enter the announcement"
        ></b-form-input>
        <b-form-input
          type="text"
          v-model="announcement.link"
          placeholder="Enter the image link (optional) must be 180x350"
          class="mt-1"
        ></b-form-input>
        <div
          v-if="announcement.text"
          class="p-3 mt-3"
          style="width: 350px; background-color: #292a37; color: #b5b5b7"
        >
          <div
            class="text-center"
            style="
              color: #a47ef8;
              text-shadow: black 1px 2px 2px 2;
              font-size: 20px;
              margin-bottom: 20px;
            "
          >
            ANNOUNCEMENT
          </div>
          <div v-html="announcement.text" class="mt-3"></div>
          <img
            v-if="announcement.link"
            :src="announcement.link"
            style="background-color: #292a37"
          />
        </div>
      </b-form-group>
    </div>

    <b-button
      variant="primary"
      class="mt-3"
      @click="saveAnnouncements"
      :disabled="loading"
    >
      Save
    </b-button>
  </div>
</template>

<script>
export default {
  data: () => ({
    defaultAnnouncements: [],
    scheduledAnnouncements: [],
    loading: true,
    days: [
      { value: 0, text: "Sunday" },
      { value: 1, text: "Monday" },
      { value: 2, text: "Tuesday" },
      { value: 3, text: "Wednesday" },
      { value: 4, text: "Thursday" },
      { value: 5, text: "Friday" },
      { value: 6, text: "Saturday" },
    ],
    languages: [
      { value: "english", text: "English" },
      { value: "russian", text: "Russian" },
      { value: "schinese", text: "Chinese" },
    ],
  }),

  created() {
    this.getAnnouncements();
  },

  methods: {
    validateScheduledAnnouncement(announcement) {
      if (!announcement.day_of_week) {
        return false;
      }
      if (!announcement.language) {
        return false;
      }
      if (!announcement.text) {
        return false;
      }
      return true;
    },
    getValidationErrors() {
      for (const announcement of this.scheduledAnnouncements) {
        if (!this.validateScheduledAnnouncement(announcement)) {
          return "Please fill out all fields for scheduled announcements";
        }
      }
      // check for duplicate days with the same language
      const days = {};
      for (const announcement of this.scheduledAnnouncements) {
        if (!days[announcement.day_of_week]) {
          days[announcement.day_of_week] = {};
        }
        if (days[announcement.day_of_week][announcement.language]) {
          return "You cannot have two announcements on the same day with the same language";
        }
        days[announcement.day_of_week][announcement.language] = true;
      }
      return null;
    },
    getAnnouncements() {
      this.loading = true;
      fetch("/api/announcements/all")
        .then((res) => res.json())
        .then((announcements) => {
          this.defaultAnnouncements = announcements.filter(
            (announcement) => announcement.is_default
          );
          this.scheduledAnnouncements = announcements.filter(
            (announcement) => !announcement.is_default
          );
          this.loading = false;
        })
        .catch((err) => console.log(err));
    },
    saveAnnouncements() {
      const validationError = this.getValidationErrors();
      if (validationError) {
        this.$bvToast.toast(validationError, {
          title: "Error",
          variant: "danger",
          solid: true,
        });
        return;
      }
      this.loading = true;
      const announcements = this.defaultAnnouncements.concat(
        this.scheduledAnnouncements
      );
      fetch("/api/announcements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(announcements),
      })
        .then((res) => res.json())
        .then((announcements) => {
          this.defaultAnnouncements = announcements.filter(
            (announcement) => announcement.is_default
          );
          this.scheduledAnnouncements = announcements.filter(
            (announcement) => !announcement.is_default
          );
          this.loading = false;

          this.$bvToast.toast("Announcements saved!", {
            title: "Success",
            variant: "success",
            solid: true,
          });
        })
        .catch((err) => console.log(err));
    },
    addScheduledAnnouncement() {
      this.scheduledAnnouncements.push({
        announcement_id: null,
        language: "english",
        text: "",
        link: "",
        day_of_week: 0,
        is_default: false,
      });
    },
    deleteScheduledAnnouncement(index) {
      const announcement = this.scheduledAnnouncements[index];
      const announcementID = announcement.announcement_id;
      if (announcementID) {
        fetch(`/api/announcements/${announcementID}`, {
          method: "DELETE",
        });
      }
      this.scheduledAnnouncements.splice(index, 1);
    },
  },
};
</script>

<style scoped>
</style>