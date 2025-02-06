<script setup>
import { computed, defineProps, defineEmits } from "vue";

// Define props
const props = defineProps({
  data: Array,
  type: String,
});

// Define emits
const emit = defineEmits(["buttonClicked"]);

// Compute grouped data
const selectedOption = computed(() => props.type);

const groupedData = computed(() => {
  const grouped = {};
  props.data.forEach((item) => {
    const key = item[selectedOption.value]; 
    if (!grouped[key]) {
      grouped[key] = { count: 0, redFlagCount: 0 };
    }
    grouped[key].count += 1;
    if (parseInt(item.red_flags) === 1) {
      grouped[key].redFlagCount += 1;
    }
  });
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
  }
  
  .red-flag {
    background-color: red;
    color: white;
  }
  </style>