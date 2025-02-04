<script>
import makeSimpleTable from "../src/components/makeSimpleTable.vue";
import Buttonsimple from "../src/components/Buttonsimple.vue";
import MultiSelect from 'primevue/multiselect';

import { ref, inject, computed } from "vue";

export default {
  components: {
    makeSimpleTable,
    Buttonsimple,
    MultiSelect,
  },
  setup() {
    // Reactive background options

    // Reactive model for selected choice
    const collumnChoice = ref();
    const selectedBackgroundvar1 = ref();
    const selectedBackgroundvar2 = ref();
    const selectedBackgroundvar3 = ref();
    const selectedBackgroundvar4 = ref();
    const selectedBackgroundvar5 = ref();

    // Reactive topic filter (if needed elsewhere, otherwise keep as const)
    const topicFilter = ref("Health factors");

    //inject data
    const injectedData = inject('eudemosData'); 
    const objects = ref(injectedData.eudemosData); // Wrap the data in an array
    //const objects = ref(injectedData.map(value => ({ backgroundvar1: value })));

    console.log (objects)

    // Compute unique values for backgroundvar1
    const uniqueBackgroundVarOptions = computed(() => {
      const backgroundVar1Values = objects.value.map(item => ({ backgroundvar1: item.backgroundvar1 }));
      return [...new Map(backgroundVar1Values.map(item => [item.backgroundvar1, item])).values()];
    });


    console.log (uniqueBackgroundVarOptions)
    
    // Return reactive properties to the template
    return {
      collumnChoice,
      topicFilter,
      selectedBackgroundvar1,
      selectedBackgroundvar2,
      selectedBackgroundvar3,
      selectedBackgroundvar4,
      selectedBackgroundvar5,
      injectedData,
      objects,
      uniqueBackgroundVarOptions,
    };
  },
};
</script>

<template>
    <div class="card flex justify-center">
        <MultiSelect v-model="selectedBackgroundvar1" :options="uniqueBackgroundVarOptions" optionLabel="backgroundvar1" filter placeholder="Type" class="w-full md:w-80" />
    </div>

  <div class="card">
  <h1 style="font-size: 2rem; color: #007bff; text-align: center; margin-bottom: 20px;">
    User-Data - local source
  </h1>
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
    <makeSimpleTable :topicFilterInput="topicFilter" :collumnInput="collumnChoice" />
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
