const { query } = require("./index");

module.exports = {
  async getAnnouncements() {
    try {
      const { rows } = await query(`SELECT * FROM announcements`);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  async updateAnnouncements(announcemnts) {
    try {
      for (const announcement of announcemnts) {
        const { language, text, link } = announcement;
        await query(
          `UPDATE announcements SET (text, link) = ($2, $3) WHERE language = $1`,
          [language, text, link]
        );
      }
      return await this.getAnnouncements();
    } catch (error) {
      throw error;
    }
  },

  async initializeAnnouncements() {
    const languages = ["english", "russian", "schinese"];
    try {
      for (const language of languages) {
        await query(
          `INSERT INTO announcements (language, text) VALUES ($1, $2)`,
          [language, ""]
        );
      }
    } catch (error) {
      throw error;
    }
  },
};
