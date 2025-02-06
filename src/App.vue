<script setup>
import { ref, watch, reactive, inject } from "vue";
import Buttonsimple from "../src/components/Buttonsimple.vue";
import dropdownUniques from "./components/dropdownUniques.vue";
import buttonbasedTable from "../src/components/buttonbasedTable.vue";
import test from "../src/components/test.vue";

// Reactive model for selected filters
const selectedFiltersDropdown = reactive({
  backgroundvar1: [],
  backgroundvar2: [],
  backgroundvar3: [],
  backgroundvar4: [],
  backgroundvar5: []
});
watch(
  selectedFiltersDropdown,
  (newVal) => {
    console.log("Filters updated:", JSON.stringify(newVal, null, 2));
  },
  { deep: true } // Ensures changes inside objects/arrays are detected
);
console.log(selectedFiltersDropdown)
const selectedfactorchapter = ref("")
const topicFilter = ref("Health factors");

// Method to log button clicks
const handleButtonClick = (event) => {
  console.log(event.category); // Logs only the button name
  selectedfactorchapter.value = event.category; // Correct assignment
};

// Reactive topic filter


// Handle updates from dropdowns
const updateSelection = ({ key, value }) => {
  selectedFiltersDropdown[key] = value;
};

// Inject data
const injectedData = inject('eudemosData'); 
const converteddata = ref(injectedData.eudemosData);
</script>


<template>
  <div class="button-container">
    <dropdownUniques backgroundvar="backgroundvar2" title="Level 1" :data= "converteddata" @update:selected="updateSelection" />
    <dropdownUniques backgroundvar="backgroundvar3" title="Level 2" :data= "converteddata" @update:selected="updateSelection" />
    <dropdownUniques backgroundvar="backgroundvar4" title="Level 3" :data= "converteddata" @update:selected="updateSelection" />
    <dropdownUniques backgroundvar="backgroundvar5" title="Level 4" :data= "converteddata" @update:selected="updateSelection" />
    <dropdownUniques backgroundvar="backgroundvar1" title="type" :data= "converteddata" @update:selected="updateSelection" />
  </div>


  <div class="card">
  <div class="button-container">
    <Buttonsimple :filterName="'Health factors'" @click="topicFilter = '#1 Health factors'" />
    <Buttonsimple :filterName="'Important overload factors'" @click="topicFilter = '#2 Important overload factors (Topic)'" />
    <Buttonsimple :filterName="'Work causes'" @click="topicFilter = '#3 Work causes'" />
    <Buttonsimple :filterName="'Relationship causes'" @click="topicFilter = '#4 Relationship causes'" />
    <Buttonsimple :filterName="'Cultural causes'" @click="topicFilter = '#5 Cultural causes'" />
    <Buttonsimple :filterName="'Occupational Health'" @click="topicFilter = '#6 Occupational Health'" />
  </div>
</div>


  <div class="card-container">
    <buttonbasedTable type="chapter_en" :data="converteddata" @buttonClicked="handleButtonClick" />
    <buttonbasedTable type="factor_en" :data="converteddata" @buttonClicked="handleButtonClick" />
  </div>
</template>

<style scoped>
/* Flexbox container for side-by-side layout */
.card-container {
  display: flex;
  gap: 20px; /* Adjusts spacing between the two tables */
  justify-content: center; /* Centers both tables horizontally */
  align-items: flex-start; /* Aligns tables at the top */
  flex-wrap: wrap; /* Allows wrapping on smaller screens */
}

/* Optional: Ensuring each button table takes equal space */
buttonbasedTable {
  flex: 1; /* Each table takes equal space */
  min-width: 300px; /* Prevents excessive shrinking */
  max-width: 600px; /* Limits maximum width */
}
</style>