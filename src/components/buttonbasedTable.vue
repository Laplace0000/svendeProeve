<script setup>
import { computed, defineProps, defineEmits } from "vue";

// Define props
const props = defineProps({
  type: String,
  data: Array,
  topicFilter: String,
  chosenChapter: String,
  chosenFactor: String,
  dropdownfilters: Object,
});

// Function to filter data based on topic filter, chosenChapter, and chosenFactor
const filteredData = computed(() => {
  console.log('Filtering data with:', props.topicFilter, props.dropdownfilters);

  return props.data.filter((item) => {
    // Check if item matches topic, chapter, and factor filters
    const matchesTopic = item.topic_en === props.topicFilter;
    const matchesChapter = !props.chosenChapter || item.chapter_en === props.chosenChapter;
    const matchesFactor = !props.chosenFactor || item.factor_en === props.chosenFactor;

    // Exclude items based on selected dropdown filters
    let excludeItem = false;

    // Loop through each filter in the dropdown filters
    Object.keys(props.dropdownfilters).forEach((filterKey) => {
      const selectedValues = props.dropdownfilters[filterKey]; // Array of selected filter objects

      if (selectedValues.length > 0) {
        // Extract all backgroundvar values from selected filter objects
        const selectedBackgroundVars = selectedValues.map(val => val.backgroundvar);

        // Exclude item if its field value exists in the selected values array
        if (selectedBackgroundVars.includes(item[filterKey])) {
          excludeItem = true;
        }
      }
    });

    // Return true if the item matches filters and is not excluded
    return matchesTopic && matchesChapter && matchesFactor && !excludeItem;
  });
});

// Define emits
const emit = defineEmits(["buttonClicked"]);

// Compute grouped data using filteredData
const selectedOption = computed(() => props.type);

const groupedData = computed(() => {
  const grouped = {};

  filteredData.value.forEach((item) => {
    const key = item[selectedOption.value]; 
    if (!grouped[key]) {
      grouped[key] = { count: 0, redFlagCount: 0 };
    }

    grouped[key].count += 1;

    // Ensure red_flags is parsed correctly (handles numbers & strings)
    if (parseInt(item.red_flags) === 1 || item.red_flags === "1") {
      grouped[key].redFlagCount += 1;
    }
  });

  // Calculate red flag percentages
  Object.keys(grouped).forEach((key) => {
    grouped[key].redFlagPercentage = (grouped[key].redFlagCount / grouped[key].count) * 100;
  });

  return grouped;
});

// Format the type for readability (e.g., "factor_en" → "Factor En")
const formattedType = computed(() => {
  return props.type.replace("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());
});

// Notify the parent when a button is clicked
const notifyParent = (key, percentage) => {
  console.log('Emitting button clicked:', key, percentage);
  emit("buttonClicked", { category: key, percentage, type: props.type });
};
</script>

<template>
  <div>
    <!-- Table Headers -->
    <div class="header-container">
      <div class="header-item">{{ formattedType }}</div> <!-- Dynamic type name -->
      <div class="header-item">Red Flags</div> <!-- Fixed label for red flags -->
    </div>

    <!-- Data Rows -->
    <div v-for="(item, key) in groupedData" :key="key" class="item-container">
      <p>{{ key }}</p>
      <button 
        :class="{ 'red-flag': item.redFlagPercentage > 0 }"
        @click="notifyParent(key, item.redFlagPercentage)"
        :aria-label="`${key} has ${item.redFlagPercentage.toFixed(2)}% red flags`"
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
  flex: 1; /* Ensures equal spacing for headers */
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
  padding: 5px 10px;
  border: none;
  cursor: pointer;
  background-color: #ccc;
  color: black;
  border-radius: 4px;
  text-align: center;
  transition: background-color 0.2s ease-in-out;
}

button:hover {
  background-color: #bbb;
}

.red-flag {
  background-color: red;
  color: white;
}
</style>
