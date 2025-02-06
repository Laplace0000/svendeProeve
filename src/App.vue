<script>
import makeSimpleTable from "../src/components/makeSimpleTable.vue";
import Buttonsimple from "../src/components/Buttonsimple.vue";
import MultiSelect from 'primevue/multiselect';
import dropdownUniques from "./components/dropdownUniques.vue";
import buttonbasedTable from "../src/components/buttonbasedTable.vue";
import { ref, reactive, inject } from "vue";


export default {
  components: {
    makeSimpleTable,
    Buttonsimple,
    MultiSelect,
    dropdownUniques,
    buttonbasedTable,
  },
  setup() {
    // Reactive model for selected filters
    const selectedFiltersDropdown = reactive({
      backgroundvar1: [],
      backgroundvar2: [],
      backgroundvar3: [],
      backgroundvar4: [],
      backgroundvar5: []
    });

    // Reactive topic filter
    const topicFilter = ref("Health factors");

    // Handle updates from dropdowns
    const updateSelection = ({ key, value }) => {
      selectedFiltersDropdown[key] = value;
    };

    const injectedData = inject('eudemosData'); 
    const converteddata = ref(injectedData.eudemosData);

    return {
      selectedFiltersDropdown,
      topicFilter,
      updateSelection,
      converteddata,
    };
  },
};
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
    <Buttonsimple :filterName="'Health factors'" @click="topicFilter = 'Health factors'" />
    <Buttonsimple :filterName="'Important overload factors'" @click="topicFilter = 'Important overload factors'" />
    <Buttonsimple :filterName="'Work causes'" @click="topicFilter = 'Work causes'" />
    <Buttonsimple :filterName="'Relationship causes'" @click="topicFilter = 'Relationship causes'" />
    <Buttonsimple :filterName="'Cultural causes'" @click="topicFilter = 'Cultural causes'" />
    <Buttonsimple :filterName="'Occupational Health'" @click="topicFilter = 'Occupational Health'" />
  </div>
</div>



  <div class="card">
    <h1 style="font-size: 2rem; color: #007bff; text-align: center; margin-bottom: 20px;">
      User-Data - local source
    </h1>
    <makeSimpleTable :topicFilterInput="topicFilter" :collumnInput="collumnChoice" :selectedDropdown="selectedFiltersDropdown" :data="converteddata" />
  </div>

  <div class="card">
    <buttonbasedTable :data="converteddata" />
  </div>
</template>

<style scoped>

header {
  line-height: 1.5;
}
.button-container {
  display: flex;
  gap: 10px; /* Adjust spacing between buttons */
  justify-content: center; /* Center the buttons horizontally */
  flex-wrap: wrap; /* Wrap buttons to the next line if there's not enough space */
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
