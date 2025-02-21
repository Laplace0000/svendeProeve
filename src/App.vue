<script setup>
import { ref, watch, reactive, inject } from "vue";
import Buttonsimple from "../src/components/Buttonsimple.vue";
import dropdownUniques from "./components/dropdownUniques.vue";
import buttonbasedTable from "../src/components/buttonbasedTable.vue";
import persistentbuttonbasedtable from "./components/persistentbuttonbasedtable.vue";
import redflagGraph from "./components/redflagGraph.vue";

// Reactive model for selected filters
const selectedFiltersDropdown = reactive({
  backgroundvar1: [],
  backgroundvar2: [],
  backgroundvar3: [],
  backgroundvar4: [],
  backgroundvar5: []
});
console.log(selectedFiltersDropdown);

const selectedfactor = ref("");
const selectedchapter = ref("");
const topicFilter = ref("#1 Health factors");
const companyChoice = ref("");

const OverallComparisonLevel1 = ref("");
const OverallComparisonLevel2 = ref("");
const OverallComparisonLevel3 = ref("");
const OverallComparisonLevel4 = ref("");
const OverallComparisonType = ref("");
const OverallComparisonFactor = ref("");

watch(selectedFiltersDropdown, (newVal) => {
  console.log("Filters updated:", JSON.stringify(newVal, null, 2));
}, { deep: true });

watch(topicFilter, (newVal) => {
  console.log("topicFilter updated:", newVal);
});

// Method to log button clicks
const handleButtonClickchapter = (event) => {
  console.log('Button clicked (chapter):', event.category);
  if (selectedchapter.value === event.category) {
    selectedchapter.value = ""; // Clear selection
  } else {
    selectedchapter.value = event.category; // Update selection
  }
};

const handleButtonClickfactor = (event) => {
  console.log('Button clicked (factor):', event.category);
  if (selectedfactor.value === event.category) {
    selectedfactor.value = ""; // Clear selection
  } else {
    selectedfactor.value = event.category; // Update selection
  }
};

const handleClickCompany = (event) => {
  console.log('Button clicked (factor):', event.category);
  if (companyChoice.value === event.category) {
    companyChoice.value = ""; // Clear selection
  } else {
    companyChoice.value = event.category; // Update selection
  }
};


const handleOverallComparisonUpdate = (level, value) => {
  console.log(`Updating ${level}: ${value} (Previous: ${eval(level).value})`);
  if (eval(level).value === value) {
    eval(level).value = "";
  } else {
    eval(level).value = value;
  }
};


const handlefactorchapterReset = (filter) => {
  console.log('Button clicked (factorandchapter reset):');
  topicFilter.value = filter;  // Directly update topicFilter without "this"
  selectedfactor.value = "";   // Clear selection
  selectedchapter.value = "";  // Clear selection
};

// Handle updates from dropdowns
const updateSelection = ({ key, value }) => {
  selectedFiltersDropdown[key] = value;
};



const handleOverallComparisonReset = () => {
  OverallComparisonLevel1.value = "";
  OverallComparisonLevel2.value = "";
  OverallComparisonLevel3.value = "";
  OverallComparisonLevel4.value = "";
  OverallComparisonType.value = "";
  OverallComparisonFactor.value = "";
  console.log("Filters Reset:");
};

const handletest = () => {
  console.log("Debugging Overall Comparison Values:");
  console.log("Level 1:", OverallComparisonLevel1.value);
  console.log("Level 2:", OverallComparisonLevel2.value);
  console.log("Level 3:", OverallComparisonLevel3.value);
  console.log("Level 4:", OverallComparisonLevel4.value);
  console.log("Type:", OverallComparisonType.value);
  console.log("Factor:", OverallComparisonFactor.value);
};



// Injected data
const injectedData = inject('eudemosData'); 
const converteddata = ref(injectedData.eudemosData);
</script>

<template>
  <div class="button-container">
    <dropdownUniques backgroundvar="backgroundvar2" title="Level 1" :data="converteddata" @update:selected="updateSelection" />
    <dropdownUniques backgroundvar="backgroundvar3" title="Level 2" :data="converteddata" @update:selected="updateSelection" />
    <dropdownUniques backgroundvar="backgroundvar4" title="Level 3" :data="converteddata" @update:selected="updateSelection" />
    <dropdownUniques backgroundvar="backgroundvar5" title="Level 4" :data="converteddata" @update:selected="updateSelection" />
    <dropdownUniques backgroundvar="backgroundvar1" title="type" :data="converteddata" @update:selected="updateSelection" />
  </div>

  <div class="card">
    <div class="button-container">
      <Buttonsimple :filterName="'Health factors'" @click="handlefactorchapterReset('#1 Health factors')" />
      <Buttonsimple :filterName="'Important overload factors'" @click="handlefactorchapterReset('#2 Important overload factors (Topic)')" />
      <Buttonsimple :filterName="'Work causes'" @click="handlefactorchapterReset('#3 Work causes')" />
      <Buttonsimple :filterName="'Relationship causes'" @click="handlefactorchapterReset('#4 Relationship causes')" />
      <Buttonsimple :filterName="'Cultural causes'" @click="handlefactorchapterReset('#5 Cultural causes')" />
      <Buttonsimple :filterName="'Occupational Health'" @click="handlefactorchapterReset('#6 Occupational Health')" />
    </div>
  </div>

  <div class="card-container">
    <buttonbasedTable type="chapter_en" :data="converteddata" :topicFilter="topicFilter" :chosenChapter="selectedchapter" :chosenFactor="selectedfactor" :dropdownfilters="selectedFiltersDropdown" @buttonClicked="handleButtonClickchapter" />
    <buttonbasedTable type="factor_en" :data="converteddata" :topicFilter="topicFilter" :chosenChapter="selectedchapter" :chosenFactor="selectedfactor" :dropdownfilters="selectedFiltersDropdown" @buttonClicked="handleButtonClickfactor" />
  </div>
  <div class="card-container">
    <persistentbuttonbasedtable 
      type="low" 
      :data="converteddata" 
      :topicFilter="topicFilter" 
      :chosenChapter="selectedchapter" 
      :chosenFactor="selectedfactor" 
      :companyChoice="companyChoice"
      :dropdownfilters="selectedFiltersDropdown" 
      @buttonClicked="handleClickCompany"
    />

    <persistentbuttonbasedtable 
      type="medium" 
      :data="converteddata" 
      :topicFilter="topicFilter" 
      :chosenChapter="selectedchapter" 
      :chosenFactor="selectedfactor" 
      :companyChoice="companyChoice"
      :dropdownfilters="selectedFiltersDropdown" 
      @buttonClicked="handleClickCompany"
    />

    <persistentbuttonbasedtable 
      type="high" 
      :data="converteddata" 
      :topicFilter="topicFilter" 
      :chosenChapter="selectedchapter" 
      :chosenFactor="selectedfactor" 
      :companyChoice="companyChoice"
      :dropdownfilters="selectedFiltersDropdown" 
      @buttonClicked="handleClickCompany"
    />
  </div>

  <div class="card">
    <b> Overall comparison</b>
    <div class="button-container">

      <Buttonsimple 
      filterName="Level 1"
      @click="handleOverallComparisonUpdate('OverallComparisonLevel1', 'backgroundvar2')"
      />
      <Buttonsimple  
        filterName="Level 2"
        @click="handleOverallComparisonUpdate('OverallComparisonLevel2', 'backgroundvar3')"
      />
      <Buttonsimple  
        filterName="Level 3"
        @click="handleOverallComparisonUpdate('OverallComparisonLevel3', 'backgroundvar4')"
      />
      <Buttonsimple  
        filterName="Level 4"
        @click="handleOverallComparisonUpdate('OverallComparisonLevel4', 'backgroundvar5')"
      />
      <Buttonsimple  
        filterName="Type"
        @click="handleOverallComparisonUpdate('OverallComparisonType', 'backgroundvar1')"
      />
      <Buttonsimple  
        filterName="Factor"
        @click="handleOverallComparisonUpdate('OverallComparisonFactor', 'factortext_en')"
      />

      <Buttonsimple 
        :filterName="'Reset'" 
        @click="handleOverallComparisonReset()"   
      />
      <Buttonsimple 
        :filterName="'Test'" 
        @click="handletest()"   
      />
    </div>

  </div>

  <div class="card-container">
    <redflagGraph type="chapter_en" :data="converteddata" :topicFilter="topicFilter" :chosenChapter="selectedchapter" :chosenFactor="selectedfactor" :dropdownfilters="selectedFiltersDropdown" />
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
