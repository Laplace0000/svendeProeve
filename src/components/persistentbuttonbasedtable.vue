<script setup>
import { computed, defineProps, defineEmits } from "vue";

// Define props
const props = defineProps({
  type: String, // Determines whether to show low, medium, or high red flag groups
  data: Array,
  topicFilter: String,
  chosenChapter: String,
  chosenFactor: String,
  dropdownfilters: Object,
});

// Compute the title dynamically based on type
const title = computed(() => {
  if (props.type === "low") return "Doing good:";
  if (props.type === "medium") return "Warning zone:";
  if (props.type === "high") return "Something needs to be done:";
  return "";
});

// Function to filter data based on topic filter, chapter, and factor
const filteredData = computed(() => {
  return props.data.filter((item) => {
    const matchesTopic = item.topic_en === props.topicFilter;
    const matchesChapter = !props.chosenChapter || item.chapter_en === props.chosenChapter;
    const matchesFactor = !props.chosenFactor || item.factor_en === props.chosenFactor;

    // **Fixed filtering logic**: Ensure items match selected dropdown filters
    let includeItem = true;
    Object.keys(props.dropdownfilters).forEach((filterKey) => {
      const selectedValues = props.dropdownfilters[filterKey].map(val => val.backgroundvar);
      if (selectedValues.length && !selectedValues.includes(item[filterKey])) {
        includeItem = false;
      }
    });

    return matchesTopic && matchesChapter && matchesFactor && includeItem;
  });
});

// Compute grouped data using filteredData, grouped by `backgroundvar2`
const groupedData = computed(() => {
  const grouped = {};
  filteredData.value.forEach((item) => {
    const key = item.backgroundvar2;
    if (!grouped[key]) {
      grouped[key] = { count: 0, redFlagCount: 0 };
    }
    grouped[key].count += 1;
    if (parseInt(item.red_flags) === 1) {
      grouped[key].redFlagCount += 1;
    }
  });

  // **Fix division by zero issue**
  Object.keys(grouped).forEach((key) => {
    grouped[key].redFlagPercentage = grouped[key].count
      ? (grouped[key].redFlagCount / grouped[key].count) * 100
      : 0;
  });

  return grouped;
});

// Function to determine which category the item falls into
const categorizedData = computed(() => {
  return Object.entries(groupedData.value)
    .filter(([_, item]) => {
      const percentage = item.redFlagPercentage;
      if (props.type === "low") return percentage < 16;
      if (props.type === "medium") return percentage >= 15 && percentage <= 26;
      if (props.type === "high") return percentage > 25;
      return false;
    })
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});
});

// Emit event on button click
const emit = defineEmits(["buttonClicked"]);

const notifyParent = (key, percentage) => {
  emit("buttonClicked", { category: key, percentage, type: props.type });
};
</script>

<template>
  <div>
    <!-- Table Headers -->
    <div class="header-container">
      <div class="header-item">{{ title }}</div>
      <div class="header-item"></div>
    </div>

    <!-- Data Rows -->
    <div v-for="(item, key) in categorizedData" :key="key" class="item-container">
      <p>{{ key }}</p>
      <button
        :class="{
          'red-flag-low': props.type === 'low',
          'red-flag-medium': props.type === 'medium',
          'red-flag-high': props.type === 'high'
        }"
        @click="notifyParent(key, item.redFlagPercentage)"
      >
        {{ item.redFlagPercentage.toFixed(2) }}%
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Header row styling */
.header-container {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  padding: 10px;
  border-bottom: 2px solid #000;
}

.header-item {
  flex: 1;
  text-align: center;
}

/* Data row styling */
.item-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

button {
  padding: 8px 12px; /* Increased padding for better readability */
  font-size: 14px; /* Improved font size */
  border: none;
  cursor: pointer;
  border-radius: 4px;
  text-align: center;
}

/* Styling for different red flag categories */
.red-flag-low {
  background-color: green;
  color: white;
}

.red-flag-medium {
  background-color: orange;
  color: white;
}

.red-flag-high {
  background-color: red;
  color: white;
}
</style>
