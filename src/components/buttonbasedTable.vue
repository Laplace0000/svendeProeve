<script setup>
import { computed, defineProps } from "vue";

// Define props
const props = defineProps({
  data: Array,
  type: String,
});

// Compute the selected category based on type prop
const selectedOption = computed(() => (props.type === "factor" ? "factor_en" : "chapter_en"));

// Computed property to group data and calculate the percentage of red flags
const groupedData = computed(() => {
  const grouped = {};

  props.data.forEach((item) => {
    const key = item[selectedOption.value]; // Group by factor_en or chapter_en

    if (!grouped[key]) {
      grouped[key] = { count: 0, redFlagCount: 0 };
    }

    grouped[key].count += 1; // Total items in this group
    if (parseInt(item.red_flags) === 1) {
      grouped[key].redFlagCount += 1; // Count occurrences of red_flag = 1
    }
  });

  // Calculate percentage of red flags
  Object.keys(grouped).forEach((key) => {
    grouped[key].redFlagPercentage = (grouped[key].redFlagCount / grouped[key].count) * 100;
  });

  return grouped;
});
</script>

<template>
  <div>
    <div v-for="(item, key) in groupedData" :key="key" class="item-container">
      <!-- Display Unique Category Name -->
      <p>{{ key }}</p>

      <!-- Button that displays the percentage of red flags and turns red if > 0% -->
      <button :class="{ 'red-flag': item.redFlagPercentage > 0 }">
        {{ item.redFlagPercentage.toFixed(2) }}% Red Flags
      </button>
    </div>
  </div>
</template>

<style scoped>
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
}

.red-flag {
  background-color: red;
  color: white;
}
</style>
