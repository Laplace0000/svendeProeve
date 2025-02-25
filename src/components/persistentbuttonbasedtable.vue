<script setup>
import { computed, defineProps, defineEmits, toRefs } from "vue";

// Define props
const props = defineProps({
  type: String, // Determines whether to show low, medium, or high red flag groups
  data: Array,
  topicFilter: String,
  chosenChapter: String,
  chosenFactor: String,
  companyChoice: String,
  dropdownfilters: Object,
  overallfiltering: Object, // New filtering variable
});

// Convert overallfiltering into reactive refs
const overallFilters = toRefs(props.overallfiltering);

// Compute the title dynamically based on type
const title = computed(() => {
  if (props.type === "low") return "Doing good:";
  if (props.type === "medium") return "Warning zone:";
  if (props.type === "high") return "Something needs to be done:";
  return "";
});

// **Merge columns based on selected filters in overallfiltering**
const mergedData = computed(() => {
  return props.data.map(item => {
    let mergedKey = item.backgroundvar2; // Default title column
    
    Object.keys(overallFilters).forEach((key) => {
      if (overallFilters[key].value) {
        mergedKey += ` | ${item[overallFilters[key].value] || ''}`;
      }
    });
    
    return { ...item, mergedKey };
  });
});

// **Filter data based on selected criteria**
const filteredData = computed(() => {
  return mergedData.value.filter((item) => {
    const matchesTopic = item.topic_en === props.topicFilter;
    const matchesChapter = !props.chosenChapter || item.chapter_en === props.chosenChapter;
    const matchesFactor = !props.chosenFactor || item.factor_en === props.chosenFactor;

    let includeItem = true;
    
    // Apply dropdown filters
    Object.keys(props.dropdownfilters).forEach((filterKey) => {
      const selectedValues = props.dropdownfilters[filterKey].map(val => val.backgroundvar);
      if (selectedValues.length && !selectedValues.includes(item[filterKey])) {
        includeItem = false;
      }
    });

    return matchesTopic && matchesChapter && matchesFactor && includeItem;
  });
});

// **Group data using mergedKey**
const groupedData = computed(() => {
  const grouped = {};
  filteredData.value.forEach((item) => {
    const key = item.mergedKey;
    if (!grouped[key]) {
      grouped[key] = { count: 0, redFlagCount: 0 };
    }
    grouped[key].count += 1;
    if (parseInt(item.red_flags) === 1) {
      grouped[key].redFlagCount += 1;
    }
  });

  // **Prevent division by zero**
  Object.keys(grouped).forEach((key) => {
    grouped[key].redFlagPercentage = grouped[key].count
      ? (grouped[key].redFlagCount / grouped[key].count) * 100
      : 0;
  });

  return grouped;
});

// **Filter & categorize data based on red flag percentages**
const categorizedData = computed(() => {
  let result = Object.entries(groupedData.value)
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

  // **If `companyChoice` is set and not in result, show no data**
  if (props.companyChoice && !result[props.companyChoice]) {
    return {};
  }

  return result;
});

// Emit event on button click
const emit = defineEmits(["buttonClicked"]);

const notifyParent = (key, percentage) => {
  emit("buttonClicked", { category: key, percentage, type: props.type });
};
</script>

<template>
  <div>
    <!-- Table Headers (Always Visible) -->
    <div class="header-container">
      <div class="header-item">{{ title }}</div>
      <div class="header-item"></div>
    </div>

    <!-- Table Body (Only Show Rows if companyChoice Exists in Data) -->
    <div v-if="Object.keys(categorizedData).length > 0">
      <div v-for="(item, key) in categorizedData" :key="key" class="item-container">
        <p :class="{ 'bold-text': key === companyChoice }">{{ key }}</p>
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
    <div v-else class="empty-message">
      No data available based on the selected filters.
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
  padding: 8px 12px;
  font-size: 14px;
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

/* Bold text styling */
.bold-text {
  font-weight: bold;
}

/* Empty message styling */
.empty-message {
  text-align: center;
  padding: 10px;
  font-style: italic;
  color: #888;
}
</style>
