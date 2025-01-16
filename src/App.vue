<script>
import makeSimpleTable from "../src/components/makeSimpleTable.vue";
import Buttonsimple from "../src/components/Buttonsimple.vue";
import { ref, inject } from "vue";
export default {
  components: {
    makeSimpleTable,
    Buttonsimple,
  },
  setup() {
    // Reactive background options
    const backgroundOptions = ref([
      { name: "backgroundvar1" },
      { name: "backgroundvar2" },
    ]);

    // Reactive model for selected choice
    const collumnChoice = ref("backgroundvar1");

    // Reactive topic filter (if needed elsewhere, otherwise keep as const)
    const topicFilter = ref("Health factors");


    console.log(topicFilter);

    // Return reactive properties to the template
    return {
      collumnChoice,
      topicFilter,
    };
  },
};
</script>

<template>
  <div class="card flex flex-wrap justify-center gap-4">
    <div class="flex items-center gap-2">
      <Checkbox
        inputId="#1 Health factors"
        name="eudemos"
        value="Health factors"
      />
      <label for="#1 Health factors"> Health Factors </label>
    </div>
    <div class="flex items-center gap-2">
      <Checkbox
        inputId="ingredient2"
        name="pizza"
        value="Mushroom"
      />
      <label for="ingredient2"> Mushroom </label>
    </div>
  </div>

  <div class="card">
    <h1 style="font-size: 2rem; color: #007bff; text-align: center; margin-bottom: 20px;">
      User-Data - local source
    </h1>
    <Buttonsimple :filterName="'Health factors'" @click="topicFilter.value = 'Health factors'" />
    <Buttonsimple :filterName="'Important overload factors'" @click="topicFilter.value = 'Important overload factors'" />
    <Buttonsimple :filterName="'Work causes'" @click="topicFilter.value = 'Work causes'" />
    <Buttonsimple :filterName="'Relationship causes'" @click="topicFilter.value = 'Relationship causes'" />
    <Buttonsimple :filterName="'Cultural causes'" @click="topicFilter.value = 'Cultural causes'" />
    <Buttonsimple :filterName="'Occupational Health'" @click="topicFilter.value = 'Occupational Health'" />

  </div>

  <div>
    <CascadeSelect
      v-model="collumnChoice"
      optionGroupLabel="name"
    />
    <p>Selected: {{ collumnChoice }}</p>
  </div>
  <div class="card">
    <h1 style="font-size: 2rem; color: #007bff; text-align: center; margin-bottom: 20px;">
      User-Data - local source
    </h1>
    <makeSimpleTable :topicFilterInput="topicFilter.value" :collumnInput="collumnChoice" />
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
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
