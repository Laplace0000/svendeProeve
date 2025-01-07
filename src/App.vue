<script>
import makeSimpleTable from "../src/components/makeSimpleTable.vue";
import { inject } from 'vue'; 
export default {
  components: {
    makeSimpleTable,


  },

};

</script>

<template>

  <div class="card">
    <h1 style="font-size: 2rem; color: #007bff; text-align: center; margin-bottom: 20px;">  User-Data - local source</h1>
    <makeSimpleTable/>
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
