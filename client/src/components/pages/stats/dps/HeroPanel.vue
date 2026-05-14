<template>
  <div class="hero-panel">
    <div class="panel-header d-flex align-items-center">
      <span class="panel-title flex-grow-1">
        {{ title }}
        <img
          v-if="primaryAttrIcon"
          :src="primaryAttrIcon"
          class="attr-icon ml-1"
          :title="heroStats && heroStats.primaryAttr"
        />
      </span>
      <button
        class="bonus-trigger"
        title="Configure ability bonuses"
        @click="showBonuses = true"
      >
        ✦ Bonuses
      </button>
    </div>

    <!-- Hero portrait + selects -->
    <div class="hero-top-row mb-2">
      <img
        v-if="heroImageSrc"
        :src="heroImageSrc"
        class="hero-portrait"
        :alt="selectedHeroName"
        @error="portraitError = true"
      />
      <div class="hero-selects">
        <div class="hero-select-row">
          <div class="hero-field">
            <label class="panel-label">Hero</label>
            <b-form-select
              :value="value.heroId"
              :options="heroOptions"
              @change="update('heroId', $event)"
              size="sm"
            />
          </div>
          <div class="level-field">
            <label class="panel-label">Level</label>
            <b-form-input
              type="number"
              :value="value.level"
              min="1"
              max="30"
              size="sm"
              class="level-input"
              @input="
                update(
                  'level',
                  Math.max(1, Math.min(30, parseInt($event) || 1)),
                )
              "
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Item slots -->
    <label class="panel-label mb-1">Items</label>
    <div class="item-slots">
      <div
        v-for="(slot, idx) in value.items"
        :key="
          idx + '_' + (slot || 'empty') + '_' + (isActive(slot) ? 'on' : 'off')
        "
        class="item-slot"
      >
        <div
          class="slot-icon-wrap"
          v-b-tooltip.html.right="
            slot
              ? {
                  title: slotTooltip(slot, isActive(slot)),
                  boundary: 'viewport',
                }
              : false
          "
          @click="openSlotPicker(idx)"
        >
          <img
            v-if="slot && itemImgMap[slot]"
            :src="itemImgMap[slot]"
            :title="itemNameMap[slot]"
            class="slot-icon"
          />
          <span v-else class="slot-empty">+</span>
          <button
            v-if="slot"
            class="slot-clear"
            title="Remove item"
            @click.stop="clearSlot(idx)"
          >
            ×
          </button>
        </div>
        <div class="slot-name" :title="slot ? itemNameMap[slot] : ''">
          {{ slot ? itemNameMap[slot] : "" }}
        </div>
        <!-- Active item toggle (Armlet / Mask of Madness) -->
        <button
          v-if="slot === 'armlet' || slot === 'mask_of_madness'"
          class="armlet-toggle"
          :class="{ 'armlet-on': isActive(slot) }"
          @click.stop="toggleActive(slot)"
        >
          {{ isActive(slot) ? "⚡ ON" : "Active" }}
        </button>
      </div>
    </div>

    <!-- Stat summary -->
    <div v-if="heroStats" class="stat-summary mt-2">
      <span class="stat-badge" title="Attack Damage">
        <span class="stat-label">DMG</span>
        <span class="stat-value">{{ fmt1(heroStats.totalDamage) }}</span>
      </span>
      <span class="stat-badge" title="Attack Speed">
        <span class="stat-label">AS</span>
        <span class="stat-value">{{ fmt0(heroStats.ias) }}</span>
      </span>
      <span class="stat-badge" title="Seconds between attacks">
        <span class="stat-label">ATK CD</span>
        <span class="stat-value"
          >{{ fmt2(heroStats.aps > 0 ? 1 / heroStats.aps : 0) }}s</span
        >
      </span>
      <span class="stat-badge" title="Armor">
        <span class="stat-label">ARMOR</span>
        <span class="stat-value">{{ fmt1(heroStats.effectiveArmor) }}</span>
      </span>
      <span class="stat-badge" title="Health">
        <span class="stat-label">HP</span>
        <span class="stat-value">{{ fmt0(heroStats.hp) }}</span>
      </span>
      <span
        class="stat-badge"
        title="Physical Effective HP (evasion, block not fully factored)"
      >
        <span class="stat-label">EHP{{ heroStats.hasBlock ? "*" : "" }}</span>
        <span class="stat-value">{{ fmt0(heroStats.ehpPhys) }}</span>
      </span>
      <span class="stat-badge" title="Health Regeneration">
        <span class="stat-label">HP5</span>
        <span class="stat-value">{{ fmt1(heroStats.healthRegen) }}</span>
      </span>
      <span v-if="heroStats.lifesteal" title="Lifesteal" class="stat-badge">
        <span class="stat-label">LS</span>
        <span class="stat-value">{{ heroStats.lifesteal }}%</span>
      </span>
    </div>

    <!-- Active bonus summaries -->
    <div
      v-if="bonusSummary.length"
      class="bonus-summary"
      @click="showBonuses = true"
    >
      <div class="bonus-summary-label">Bonuses:</div>
      <div class="bonus-summary-tags">
        <span
          v-for="b in bonusSummary"
          :key="b.key"
          class="bonus-tag"
          :title="b.key"
        >
          {{ b.label }}
        </span>
      </div>
    </div>

    <!-- Bonus Config Modal -->
    <b-modal
      v-model="showBonuses"
      title="Ability Bonuses"
      size="md"
      hide-footer
      header-bg-variant="dark"
      body-bg-variant="dark"
      header-text-variant="light"
    >
      <div class="bonus-body">
        <div class="bonus-group">
          <div class="bonus-group-title">Attributes</div>
          <div class="bonus-group-grid">
            <div
              v-for="field in attrFields"
              :key="field.key"
              class="bonus-item"
            >
              <span class="bonus-item-label">{{ field.label }}</span>
              <input
                :value="bonusVal(field.key)"
                type="number"
                step="any"
                class="bonus-item-input"
                @input="
                  setBonus(field.key, parseFloat($event.target.value) || 0)
                "
              />
            </div>
          </div>
        </div>
        <div class="bonus-group">
          <div class="bonus-group-title">Combat</div>
          <div class="bonus-group-grid">
            <div
              v-for="field in combatFields"
              :key="field.key"
              class="bonus-item"
            >
              <span class="bonus-item-label">{{ field.label }}</span>
              <input
                :value="bonusVal(field.key)"
                type="number"
                step="any"
                class="bonus-item-input"
                @input="
                  setBonus(field.key, parseFloat($event.target.value) || 0)
                "
              />
            </div>
          </div>
        </div>
        <div class="bonus-group">
          <div class="bonus-group-title">Procs</div>
          <div class="bonus-group-grid">
            <div
              v-for="field in procFields"
              :key="field.key"
              class="bonus-item"
            >
              <span class="bonus-item-label">{{ field.label }}</span>
              <input
                :value="bonusVal(field.key)"
                type="number"
                step="any"
                class="bonus-item-input"
                @input="
                  setBonus(field.key, parseFloat($event.target.value) || 0)
                "
              />
            </div>
          </div>
        </div>
      </div>
      <div class="bonus-footer">
        <button class="bonus-clear" @click="clearBonuses">Clear All</button>
      </div>
    </b-modal>

    <!-- Item Picker Modal -->
    <b-modal
      v-model="showPicker"
      title="Select Item"
      size="xl"
      hide-footer
      header-bg-variant="dark"
      body-bg-variant="dark"
      header-text-variant="light"
    >
      <b-form-input
        v-model="pickerSearch"
        placeholder="Search items…"
        autofocus
        size="sm"
        class="picker-search mb-3"
      />
      <div class="item-picker-grid">
        <div
          v-for="item in pickerItems"
          :key="item.key"
          class="picker-item"
          :title="item.dname + ' (' + item.cost + 'g)'"
          @click="selectItem(item.key)"
        >
          <img :src="item.img" class="picker-img" />
          <div class="picker-name">{{ item.dname }}</div>
          <div class="picker-cost">{{ item.cost }}g</div>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import itemData from "../../../../data/items.json";
import { getAllHeroes, getHeroStats } from "../../../../services/heroStats.js";
import { resolveItemStats, calcEhp } from "../../../../services/dpsCalc.js";
import {
  SPECIAL_UNITS,
  SPECIAL_UNITS_MAP,
} from "../../../../services/units.js";

function getAttrVal(item, key) {
  const a = (item.attrib || []).find((a) => a.key === key);
  return a ? parseFloat(a.value) : null;
}

// Pre-build item list once (excluding recipes and items without a name/cost)
const ALL_ITEMS = Object.entries(itemData)
  .filter(
    ([key, item]) =>
      item.dname &&
      item.cost > 0 &&
      !key.startsWith("recipe_") &&
      !key.includes("recipe"),
  )
  .map(([key, item]) => ({
    key,
    dname: item.dname,
    cost: item.cost,
    img: item.img ? `https://cdn.cloudflare.steamstatic.com${item.img}` : null,
  }))
  .sort((a, b) => a.dname.localeCompare(b.dname));

export default {
  name: "HeroPanel",

  props: {
    title: { type: String, default: "Hero" },
    value: {
      type: Object,
      default: () => ({
        heroId: "npc_dota_hero_antimage",
        level: 1,
        items: [null, null, null, null, null, null],
        activeItems: [],
      }),
    },
  },

  data() {
    return {
      allHeroes: [],
      showPicker: false,
      pickerSlot: null,
      pickerSearch: "",
      portraitError: false,
      showBonuses: false,
    };
  },

  computed: {
    attrFields() {
      return [
        { key: "bonus_damage", label: "Damage" },
        { key: "bonus_attack_speed", label: "Attack Spd" },
        { key: "bonus_strength", label: "Strength" },
        { key: "bonus_agility", label: "Agility" },
        { key: "bonus_intellect", label: "Intellect" },
        { key: "bonus_all_stats", label: "All Stats" },
      ];
    },
    combatFields() {
      return [
        { key: "bonus_armor", label: "Armor" },
        { key: "bonus_health", label: "Health" },
        { key: "bonus_health_regen", label: "HP Regen" },
        { key: "bonus_evasion", label: "Evasion" },
      ];
    },
    procFields() {
      return [
        { key: "crit_chance", label: "Crit Chance %" },
        { key: "crit_multiplier", label: "Crit Dmg %" },
        { key: "bonus_chance", label: "Proc Chance %" },
        { key: "bonus_chance_damage", label: "Proc Damage" },
        { key: "feedback_mana_burn", label: "Mana Burn" },
        { key: "damage_per_burn", label: "Dmg per Burn" },
      ];
    },

    bonusSummary() {
      const b = this.value.bonuses;
      if (!b || !Object.keys(b).length) return [];
      const labels = {
        bonus_damage: "DMG",
        bonus_attack_speed: "AS",
        bonus_strength: "STR",
        bonus_agility: "AGI",
        bonus_intellect: "INT",
        bonus_all_stats: "All Stats",
        bonus_armor: "Armor",
        bonus_health: "HP",
        bonus_health_regen: "HP Regen",
        bonus_evasion: "Evasion",
        crit_chance: "Crit",
        crit_multiplier: "Crit×",
        bonus_chance: "Proc",
        bonus_chance_damage: "Proc Dmg",
        feedback_mana_burn: "Mana Burn",
        damage_per_burn: "Dmg/Burn",
      };
      return Object.entries(b)
        .filter(([, v]) => v && parseFloat(v) !== 0)
        .map(([key, val]) => ({
          key,
          label: `${labels[key] || key}: ${val}`,
        }));
    },

    heroOptions() {
      return [
        {
          label: "Creeps & Towers",
          options: SPECIAL_UNITS.map((u) => ({ value: u.id, text: u.dname })),
        },
        {
          label: "Heroes",
          options: this.allHeroes.map((h) => ({ value: h.id, text: h.dname })),
        },
      ];
    },

    primaryAttrIcon() {
      const attr = this.heroStats?.primaryAttr;
      const map = {
        strength: "/images/attributes/DOTA_ATTRIBUTE_STRENGTH.webp",
        agility: "/images/attributes/DOTA_ATTRIBUTE_AGILITY.webp",
        intellect: "/images/attributes/DOTA_ATTRIBUTE_INTELLECT.webp",
        universal: "/images/attributes/DOTA_ATTRIBUTE_ALL.webp",
      };
      return map[attr] || null;
    },

    selectedHeroName() {
      const special = SPECIAL_UNITS_MAP[this.value.heroId];
      if (special) return special.dname;
      const h = this.allHeroes.find((h) => h.id === this.value.heroId);
      return h ? h.dname : "";
    },

    heroImageSrc() {
      if (!this.value.heroId || this.portraitError) return null;
      if (SPECIAL_UNITS_MAP[this.value.heroId]) return null;
      const slug = this.value.heroId.replace("npc_dota_hero_", "");
      return `/images/heroes/${slug}.png`;
    },

    itemImgMap() {
      const map = {};
      for (const item of ALL_ITEMS) {
        if (item.img) map[item.key] = item.img;
      }
      return map;
    },

    itemNameMap() {
      const map = {};
      for (const item of ALL_ITEMS) {
        map[item.key] = item.dname;
      }
      return map;
    },

    pickerItems() {
      if (!this.pickerSearch) return ALL_ITEMS;
      const q = this.pickerSearch.toLowerCase();
      return ALL_ITEMS.filter((item) => item.dname.toLowerCase().includes(q));
    },

    heroStats() {
      const base = SPECIAL_UNITS_MAP[this.value.heroId]
        ? { ...SPECIAL_UNITS_MAP[this.value.heroId] }
        : getHeroStats(this.value.heroId, this.value.level);
      if (!base) return null;
      const items = resolveItemStats(
        this.value.items,
        base.primaryAttr,
        this.value.activeItems || [],
      );
      const rawIAS = base.baseIAS + items.bonusIAS;
      const aps = Math.max(0.2 / base.bat, rawIAS / (100 * base.bat));
      const totalHP =
        base.maxHP + (items.rawStr || 0) * 22 + (items.bonusHealth || 0);
      const ehp = calcEhp(base, items);
      return {
        totalDamage: base.avgBaseDamage + items.bonusDamage,
        aps,
        ias: rawIAS,
        effectiveArmor: base.effectiveArmor + items.bonusArmor,
        hp: totalHP,
        ehpPhys: ehp.ehpPhys,
        ehpMag: ehp.ehpMag,
        hasBlock: !!items.damageBlock,
        lifesteal: items.lifesteal || 0,
        healthRegen: base.totalStr * 0.1 + (items.healthRegen || 0),
        primaryAttr: base.primaryAttr,
        isMelee: base.isMelee,
      };
    },
  },

  mounted() {
    this.allHeroes = getAllHeroes();
  },

  methods: {
    slotTooltip(itemKey, active = false) {
      const item = itemData[itemKey];
      if (!item) return "";
      const primaryAttr = this.heroStats?.primaryAttr || "agility";
      const isMelee = this.heroStats?.isMelee !== false;
      const f1 = (v) => Number(v).toFixed(1);
      const g = (k) => getAttrVal(item, k);

      const lines = [
        `<div style='font-size:0.8rem;line-height:1.7;min-width:150px;text-align:left;padding:0 6px'>`,
        `<div style='display:flex;justify-content:space-between;align-items:baseline;font-size:0.88rem'>` +
          `<b>${item.dname}${
            active ? " <span style='color:#f59e0b'>(Active)</span>" : ""
          }</b>` +
          `<span style='color:#daa520'>${item.cost}g</span>` +
          `</div><br>`,
      ];

      // Active bonuses for Armlet
      if (active && itemKey === "armlet") {
        const unholyDmg = g("unholy_bonus_damage");
        const unholyStr = g("unholy_bonus_strength");
        const unholyArmor = g("unholy_bonus_armor");
        if (unholyDmg)
          lines.push(
            `<span style='color:#f59e0b'>Active ATK DMG</span> <b>+${unholyDmg}</b><br>`,
          );
        if (unholyStr)
          lines.push(
            `<span style='color:#f59e0b'>Active STR</span> <b>+${unholyStr}</b><br>`,
          );
        if (unholyArmor)
          lines.push(
            `<span style='color:#f59e0b'>Active Armor</span> <b>+${unholyArmor}</b><br>`,
          );
      }

      // Active bonuses for Mask of Madness
      if (active && itemKey === "mask_of_madness") {
        const berserkIAS = g("berserk_bonus_attack_speed");
        const berserkArmor = g("berserk_armor_reduction");
        if (berserkIAS)
          lines.push(
            `<span style='color:#f59e0b'>Active ATK SPEED</span> <b>+${berserkIAS}</b><br>`,
          );
        if (berserkArmor)
          lines.push(
            `<span style='color:#f59e0b'>Active Armor</span> <b>-${berserkArmor}</b><br>`,
          );
      }

      // Flat damage (direct + attr-scaled)
      let dmg = g("bonus_damage") || 0;
      const str = g("bonus_strength") || g("bonus_all_stats") || 0;
      const agi = g("bonus_agility") || g("bonus_all_stats") || 0;
      const intl = g("bonus_intellect") || g("bonus_all_stats") || 0;
      const scale = primaryAttr === "universal" ? 0.7 : 1.0;
      if (primaryAttr === "strength") dmg += str * scale;
      else if (primaryAttr === "agility") dmg += agi * scale;
      else if (primaryAttr === "intellect") dmg += intl * scale;
      else {
        dmg += (str + agi + intl) * scale;
      } // universal
      const ias = (g("bonus_attack_speed") || 0) + (agi || 0);
      const armor = (g("bonus_armor") || 0) + (agi || 0) / 6;
      const bonusHp =
        (g("bonus_health") || g("bonus_hp") || 0) + (str || 0) * 22;

      if (dmg)
        lines.push(
          `<span style='color:#9ca3af'>ATK DMG</span> <b>+${f1(dmg)}</b><br>`,
        );
      if (ias)
        lines.push(
          `<span style='color:#9ca3af'>ATK SPEED</span> <b>+${Math.round(
            ias,
          )}</b><br>`,
        );
      if (armor)
        lines.push(
          `<span style='color:#9ca3af'>ARMOR</span> <b style='color:#f59e0b'>+${f1(
            armor,
          )}</b><br>`,
        );
      if (bonusHp)
        lines.push(
          `<span style='color:#9ca3af'>HP</span> <b style='color:#4ade80'>+${Math.round(
            bonusHp,
          )}</b><br>`,
        );

      // Crit
      const critChance = g("crit_chance");
      const critMult = g("crit_multiplier");
      if (critChance)
        lines.push(
          `<span style='color:#fde68a'>Crit</span> ${critChance}% × ${
            critMult || 200
          }%<br>`,
        );

      // Chain
      const chainChance = g("chain_chance");
      const chainDmg = g("chain_damage");
      if (chainChance)
        lines.push(
          `<span style='color:#67e8f9'>Chain</span> ${chainChance}% × <b>${chainDmg}</b> dmg<br>`,
        );

      // MKB
      const mkbChance = g("bonus_chance");
      const mkbDmg = g("bonus_chance_damage");
      if (mkbChance)
        lines.push(
          `<span style='color:#c084fc'>MKB proc</span> ${mkbChance}% × <b>${mkbDmg}</b> dmg<br>`,
        );

      // Bash
      const bashChanceM = g("bash_chance_melee");
      const bashChanceR = g("bash_chance_ranged");
      const bashDmg = g("bonus_chance_damage");
      if (bashChanceM != null) {
        const bc = isMelee ? bashChanceM : bashChanceR ?? bashChanceM;
        lines.push(
          `<span style='color:#c084fc'>Bash</span> ${bc}% × <b>${bashDmg}</b> dmg<br>`,
        );
      }

      // Mana burn
      const manaBurn = g("feedback_mana_burn");
      const dmgPerBurn = g("damage_per_burn") ?? 1;
      if (manaBurn)
        lines.push(
          `<span style='color:#2dd4bf'>Mana burn</span> <b>${f1(
            manaBurn * dmgPerBurn,
          )}</b>/hit<br>`,
        );

      lines.push(`</div>`);
      return lines.join("");
    },

    isActive(itemKey) {
      return (this.value.activeItems || []).includes(itemKey);
    },

    toggleActive(itemKey) {
      const current = this.value.activeItems || [];
      const next = current.includes(itemKey)
        ? current.filter((k) => k !== itemKey)
        : [...current, itemKey];
      this.$emit("input", { ...this.value, activeItems: next });
    },

    update(field, val) {
      if (field === "heroId") this.portraitError = false;
      this.$emit("input", { ...this.value, [field]: val });
    },

    updateItem(idx, val) {
      const items = [...this.value.items];
      items[idx] = val || null;
      // Remove from activeItems any key no longer present in any slot
      const stillEquipped = new Set(items.filter(Boolean));
      const active = (this.value.activeItems || []).filter((k) =>
        stillEquipped.has(k),
      );
      this.$emit("input", { ...this.value, items, activeItems: active });
    },

    clearSlot(idx) {
      this.updateItem(idx, null);
    },

    openSlotPicker(idx) {
      this.pickerSlot = idx;
      this.pickerSearch = "";
      this.showPicker = true;
    },

    selectItem(key) {
      if (this.pickerSlot !== null) {
        this.updateItem(this.pickerSlot, key);
      }
      this.showPicker = false;
    },

    bonusVal(key) {
      return this.value.bonuses?.[key] || 0;
    },

    setBonus(key, val) {
      const bonuses = { ...(this.value.bonuses || {}), [key]: val || 0 };
      this.$emit("input", { ...this.value, bonuses });
    },

    clearBonuses() {
      this.$emit("input", { ...this.value, bonuses: {} });
    },

    fmt0(v) {
      return v != null ? Math.round(v) : "—";
    },
    fmt1(v) {
      return v != null ? Number(v).toFixed(1) : "—";
    },
    fmt2(v) {
      return v != null ? Number(v).toFixed(2) : "—";
    },
  },
};
</script>

<style scoped>
.hero-panel {
  background: #1a1640;
  border: 1px solid #403652;
  border-radius: 6px;
  padding: 12px;
  min-width: 280px;
}

.panel-header {
  margin-bottom: 10px;
}

.panel-title {
  color: #a78bfa;
  font-weight: bold;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  display: inline-flex;
  align-items: center;
}

.attr-icon {
  width: 16px;
  height: 16px;
  object-fit: contain;
  vertical-align: middle;
  opacity: 0.9;
}

.panel-label {
  color: #9ca3af;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 2px;
  display: block;
}

/* Hero portrait + selects side by side */
.hero-top-row {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.hero-portrait {
  width: 128px;
  height: 72px;
  object-fit: contain;
  border-radius: 4px;
  border: 1px solid #403652;
  flex-shrink: 0;
}

.hero-selects {
  flex: 1;
  min-width: 0;
}

.hero-select-row {
  display: flex;
  gap: 8px;
}

.hero-field {
  flex: 1;
  min-width: 0;
}

.level-field {
  min-width: 80px;
}

/* Level input — match select styling from styles.css */
.level-input {
  background: var(--primary-color-light, #2b1e49) !important;
  border-color: #403652 !important;
  color: #fff !important;
}
.level-input:focus {
  background: var(--primary-color-light, #2b1e49) !important;
  border-color: #7c3aed !important;
  box-shadow: 0 0 0 2px rgba(167, 139, 250, 0.25) !important;
}

/* Hero select — match the dark theme consistently */
.hero-field select,
.hero-field .custom-select {
  background-color: var(--primary-color-light, #2b1e49) !important;
  border-color: #403652 !important;
  color: #e5e7eb !important;
  font-size: 0.8rem;
}
.hero-field select:focus,
.hero-field .custom-select:focus {
  border-color: #7c3aed !important;
  box-shadow: 0 0 0 2px rgba(167, 139, 250, 0.25) !important;
}
/* Style the dropdown arrow for better visibility */
.hero-field .custom-select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3e%3cpath fill='%23a78bfa' d='M0 0l5 6 5-6z'/%3e%3c/svg%3e") !important;
}

/* Item slots — 3-col grid, 7th slot gets amber border */
.item-slots {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}

.item-slot {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.slot-icon-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 88 / 64;
  background: #13102e;
  border: 1px solid #403652;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  transition: border-color 0.15s;
}
.slot-icon-wrap:hover {
  border-color: #7c3aed;
}

.slot-icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.slot-empty {
  color: #403652;
  font-size: 1.2rem;
  line-height: 1;
}

/* Clear (×) button revealed on hover */
.slot-clear {
  position: absolute;
  top: 1px;
  right: 2px;
  background: rgba(0, 0, 0, 0.75);
  border: none;
  color: #f87171;
  font-size: 0.8rem;
  line-height: 1;
  padding: 0 3px 1px;
  border-radius: 2px;
  cursor: pointer;
  display: none;
  z-index: 1;
}
.slot-icon-wrap:hover .slot-clear {
  display: block;
}

.slot-name {
  color: #9ca3af;
  font-size: 0.55rem;
  text-align: center;
  line-height: 1.2;
  height: 1.6em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Armlet active toggle button */
.armlet-toggle {
  width: 100%;
  margin-top: 1px;
  padding: 1px 0;
  font-size: 0.55rem;
  text-align: center;
  background: #1a1640;
  border: 1px solid #92400e;
  border-radius: 2px;
  color: #92400e;
  cursor: pointer;
  transition: background 0.12s, color 0.12s;
}
.armlet-toggle.armlet-on {
  background: #78350f;
  border-color: #f59e0b;
  color: #fde68a;
}

/* Stat summary */
.stat-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.stat-badge {
  background: #13102e;
  border: 1px solid #403652;
  border-radius: 4px;
  padding: 3px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 44px;
}

.stat-label {
  color: #6b7280;
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-value {
  color: #e5e7eb;
  font-size: 0.85rem;
  font-weight: bold;
  font-family: monospace;
}

/* Item picker modal body */
.picker-search {
  background: #13102e !important;
  border-color: #403652 !important;
  color: #e5e7eb !important;
}

.item-picker-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 8px;
  max-height: 60vh;
  overflow-y: auto;
}

.picker-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 6px 4px;
  background: #1a1640;
  border: 1px solid #403652;
  border-radius: 4px;
  cursor: pointer;
  transition: border-color 0.12s, background 0.12s;
}
.picker-item:hover {
  border-color: #a78bfa;
  background: #2a2060;
}

.picker-img {
  width: 88px;
  height: 64px;
  object-fit: cover;
  border-radius: 2px;
}

.picker-name {
  color: #e5e7eb;
  font-size: 0.6rem;
  text-align: center;
  line-height: 1.2;
  word-break: break-word;
}

.picker-cost {
  color: #daa520;
  font-size: 0.58rem;
  font-family: monospace;
}

/* Bonus config modal */
.bonus-trigger {
  font-size: 0.6rem;
  padding: 2px 10px;
  border: 1px solid #403652;
  border-radius: 3px;
  background: transparent;
  color: #9ca3af;
  cursor: pointer;
  letter-spacing: 0.03em;
  line-height: 1.5;
  transition: border-color 0.12s, color 0.12s;
}
.bonus-trigger:hover {
  border-color: #7c3aed;
  color: #c084fc;
}

.bonus-body {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.bonus-group-title {
  color: #a78bfa;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 6px;
  padding-bottom: 4px;
  border-bottom: 1px solid #2d2a4a;
}
.bonus-group-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5px;
}
.bonus-item {
  display: flex;
  align-items: center;
  gap: 4px;
}
.bonus-item-label {
  color: #9ca3af;
  font-size: 0.7rem;
  white-space: nowrap;
  min-width: 58px;
}
.bonus-item-input {
  width: 100%;
  min-width: 40px;
  padding: 3px 6px;
  background: #13102e;
  border: 1px solid #403652;
  border-radius: 3px;
  color: #e5e7eb;
  font-size: 0.75rem;
  text-align: right;
  outline: none;
  transition: border-color 0.12s;
}
.bonus-item-input:focus {
  border-color: #7c3aed;
  box-shadow: 0 0 0 2px rgba(167, 139, 250, 0.2);
}
.bonus-item-input::-webkit-inner-spin-button,
.bonus-item-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.bonus-item-input[type="number"] {
  -moz-appearance: textfield;
  appearance: textfield;
}
.bonus-footer {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}
.bonus-clear {
  padding: 3px 14px;
  font-size: 0.65rem;
  background: transparent;
  border: 1px solid #403652;
  border-radius: 3px;
  color: #9ca3af;
  cursor: pointer;
  transition: border-color 0.12s, color 0.12s;
}
.bonus-clear:hover {
  border-color: #ef4444;
  color: #ef4444;
}

/* Active bonus summary */
.bonus-summary {
  display: flex;
  align-items: flex-start;
  gap: 4px;
  margin-top: 8px;
  cursor: pointer;
  padding: 4px 6px;
  border: 1px solid transparent;
  border-radius: 3px;
  transition: border-color 0.12s;
}
.bonus-summary:hover {
  border-color: #403652;
}
.bonus-summary-label {
  color: #6b7280;
  font-size: 0.6rem;
  white-space: nowrap;
  line-height: 1.6;
  margin-top: 1px;
}
.bonus-summary-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
}
.bonus-tag {
  background: #2d1b69;
  color: #c084fc;
  font-size: 0.6rem;
  padding: 1px 5px;
  border-radius: 3px;
  white-space: nowrap;
  line-height: 1.4;
}
</style>
