<script setup>
import MultiSelect from 'primevue/multiselect';
import { ref, inject, computed } from "vue";

// Inject data
const injectedData = inject('eudemosData'); 
const objects = ref(injectedData.eudemosData);
const selectedBackgroundvar = ref();

// Define props
const props = defineProps({
  backgroundvar: {
    type: String,
    default: 'backgroundvar1', 
  },
  title: {
    type: String,
    default: 'variable', 
  },
});

// Compute unique values for backgroundvar dynamically
const uniqueBackgroundVarOptions = computed(() => {
    const backgroundVarValues = objects.value.map(item => ({ backgroundvar: item[props.backgroundvar] }));
    return [...new Map(backgroundVarValues.map(item => [item.backgroundvar, item])).values()];
});

</script>

<template>
    <div class="card flex justify-center">
        <MultiSelect v-model="selectedBackgroundvar" :options="uniqueBackgroundVarOptions" optionLabel="backgroundvar" filter :placeholder="title"  class="w-full md:w-80" />
    </div>
</template>
