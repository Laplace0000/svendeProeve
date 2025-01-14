<script>
import makeSimpleTable from "../src/components/makeSimpleTable.vue";
import Buttonsimple from "../src/components/Buttonsimple.vue";
import { ref, inject } from 'vue'; 
export default {

  components: {
    makeSimpleTable,
    Buttonsimple,
  },
};
const backgroundOptions = ref([
  { name: 'backgroundvar1'},
  { name: 'backgroundvar2'}
]);

// Model for selected choice
const collumnChoice = 'backgroundvar1';


</script>

<template>

  <div class="card flex flex-wrap justify-center gap-4">
    <div class="flex items-center gap-2">
        <Checkbox v-model="Health_factors" inputId="#1 Health factors" name="eudemos" value="Health factors" />
        <label for="#1 Health factors"> Health Factors </label>
    </div>
    <div class="flex items-center gap-2">
        <Checkbox v-model="Bvar" inputId="ingredient2" name="pizza" value="Mushroom" />
        <label for="ingredient2"> Mushroom </label>
    </div>
  </div>

  <div class="card">
    <h1 style="font-size: 2rem; color: #007bff; text-align: center; margin-bottom: 20px;">  User-Data - local source</h1>
    <Buttonsimple :filterName="'healthFactors'" />
    <Buttonsimple :filterName="'other'" />
  </div>
  
  <div>
    <CascadeSelect
      v-model="collumnChoice"
      :options="backgroundOptions"
      optionGroupLabel="name"
    />
    <p>Selected: {{ collumnChoice }}</p>
  </div>
  <div class="card">
    <h1 style="font-size: 2rem; color: #007bff; text-align: center; margin-bottom: 20px;">  User-Data - local source</h1>
    <makeSimpleTable :collumnInput="collumnChoice" />

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
