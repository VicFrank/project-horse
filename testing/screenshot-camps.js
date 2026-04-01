/**
 * screenshot-camps.js
 *
 * Takes screenshots of the Camp Stats page:
 *   - screenshots/camp-stats/00-overall.png      — full table (all rows collapsed)
 *   - screenshots/camp-stats/01-<name>.png … 32  — matchup details for each camp
 *
 * Requires the Vue dev server to be running on http://localhost:8080
 * Run: node testing/screenshot-camps.js
 */

const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

const BASE_URL = "http://localhost:8080";
const OUT_DIR = path.join(__dirname, "screenshots", "camp-stats");

// Fake Vuex persisted state so the router lets us through the admin guard
const fakeVuexState = {
  auth: {
    userSteamID: "76561198000000000",
    username: "Admin",
    profilePictureLink: "",
    isAdmin: true,
    hasPlus: false,
    plus_expiration: null,
    coins: 0,
    mmr: null,
    ladderMMR: null,
    achievementsToClaim: 0,
    questsToClaim: 0,
    unopenedChests: 0,
    unclaimedBPRewards: 0,
    battlePass: { level: null, progress: null, required: null, upgraded: null },
  },
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();

    // Wide enough for the 650px-min matchup table, tall enough for a clean viewport
    await page.setViewport({ width: 1000, height: 900 });

    // 1. Inject fake admin state BEFORE any page scripts run so Vuex reads it on init
    await page.evaluateOnNewDocument((state) => {
      localStorage.setItem("vuex", JSON.stringify(state));
    }, fakeVuexState);

    // 2. Navigate directly to the camp stats page
    await page.goto(`${BASE_URL}/stats/camps`, {
      waitUntil: "networkidle2",
      timeout: 20000,
    });

    const landedUrl = page.url();
    console.log(`Landed at: ${landedUrl}`);
    if (!landedUrl.includes("/stats/camps")) {
      throw new Error(
        `Redirected away from /stats/camps → ${landedUrl}\n` +
          "Check that the fake Vuex state is being read correctly.",
      );
    }

    // Wait for the table to render
    await page.waitForSelector(".camp-table", { timeout: 15000 });

    // Extra pause to let camp images finish loading
    await sleep(1500);

    // ── Screenshot 0: overall table (all rows collapsed) ──────────────────────
    const container = await page.$(".stats-container");
    if (!container) throw new Error("Could not find .stats-container");

    await container.screenshot({ path: path.join(OUT_DIR, "00-overall.png") });
    console.log("✓ 00-overall.png");

    // ── Screenshots 1-32: one per expanded camp row ───────────────────────────
    // All rows start as .clickable-row. After expanding one we collapse it
    // before moving on, so re-querying always returns the full 32 rows.
    const initialRows = await page.$$("tbody tr.clickable-row");
    const rowCount = initialRows.length;
    console.log(`Found ${rowCount} camp rows\n`);

    for (let i = 0; i < rowCount; i++) {
      // Re-query on every iteration because previous collapse may have
      // refreshed row element references in the DOM.
      const rows = await page.$$("tbody tr.clickable-row");
      const row = rows[i];

      // Read camp name for the filename
      const campName = await row.$eval(".camp-name", (el) =>
        el.textContent.trim(),
      );
      const slug = campName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      const filename = `${String(i + 1).padStart(2, "0")}-${slug}.png`;

      // Expand the row
      await row.click();
      await sleep(400);

      // Capture just the matchup-details panel
      const details = await page.$(".matchup-details");
      if (details) {
        await details.screenshot({ path: path.join(OUT_DIR, filename) });
        console.log(`✓ ${filename}  (${campName})`);
      } else {
        console.warn(
          `  ⚠ No matchup-details found for row ${i + 1} (${campName})`,
        );
      }

      // Collapse the row before moving on (row handle still valid after class change)
      await row.click();
      await sleep(350);
    }

    console.log(`\nDone! ${rowCount + 1} screenshots saved to:\n  ${OUT_DIR}`);
  } finally {
    await browser.close();
  }
})().catch((err) => {
  console.error("Screenshot script failed:", err.message);
  process.exit(1);
});
