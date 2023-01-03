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

  async getActiveAnnouncements() {
    try {
      const announcements = await this.getAnnouncements();
      const currentDay = new Date().getDay();

      const overrideAnnouncements = announcements.filter(
        (announcement) =>
          announcement.day_of_week === currentDay && !announcement.is_default
      );
      const defaultAnnouncements = announcements.filter(
        (announcement) =>
          announcement.is_default &&
          !overrideAnnouncements.some(
            (overrideAnnouncement) =>
              overrideAnnouncement.language === announcement.language
          )
      );
      const activeAnnouncements = [
        ...overrideAnnouncements,
        ...defaultAnnouncements,
      ];

      return activeAnnouncements;
    } catch (error) {
      throw error;
    }
  },

  async getAnnouncement(announcementID) {
    try {
      const { rows } = await query(
        `SELECT * FROM announcements WHERE announcement_id = $1`,
        [announcementID]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  async updateAnnouncements(announcemnts) {
    try {
      for (const announcement of announcemnts) {
        const { announcement_id, text, link, day_of_week, language } =
          announcement;
        if (announcement_id == null) {
          await this.createAnnouncement(text, link, language, day_of_week);
          continue;
        } else {
          await query(
            `UPDATE announcements SET (text, link, day_of_week, language, updated_at) = ($2, $3, $4, $5, NOW())
            WHERE announcement_id = $1`,
            [announcement_id, text, link, day_of_week, language]
          );
        }
      }
      return await this.getAnnouncements();
    } catch (error) {
      throw error;
    }
  },

  async createAnnouncement(text, link, language, day_of_week) {
    try {
      const currentAnnouncements = await this.getAnnouncements();

      // check if an announcement for this day already exists
      const announcementExists = currentAnnouncements.some(
        (announcement) =>
          announcement.day_of_week === day_of_week &&
          announcement.language === language
      );
      if (announcementExists)
        throw new Error("Announcement already exists for this day");

      const { rows } = await query(
        `INSERT INTO announcements (text, link, language, day_of_week, updated_at)
        VALUES ($1, $2, $3, $4, NOW())
        RETURNING *`,
        [text, link, language, day_of_week]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  async deleteAnnouncement(announcement_id) {
    try {
      const announcement = await this.getAnnouncement(announcement_id);
      if (!announcement) throw new Error("Announcement not found");
      if (announcement.is_default)
        throw new Error("Cannot delete default announcement");

      const { rows } = await query(
        `DELETE FROM announcements WHERE announcement_id = $1 RETURNING *`,
        [announcement_id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  },
};
