<script setup>
import MultiSelect from 'primevue/multiselect';
import { ref, computed, defineEmits } from "vue";

const selectedBackgroundvar = ref([]);

// Define props
const props = defineProps({
  data: {
    type: Array,
    default: [], 
  },
  backgroundvar: {
    type: String,
    default: 'backgroundvar1', 
  },
  title: {
    type: String,
    default: 'variable', 
  },
});
const converteddataprop = ref(props.data);

//console.log(JSON.stringify(converteddata));

// Emit event to parent
const emit = defineEmits(["update:selected"]);

// Compute unique values for backgroundvar dynamically
const uniqueBackgroundVarOptions = computed(() => {
    const backgroundVarValues = converteddataprop.value.map(item => ({ backgroundvar: item[props.backgroundvar] }));
    return [...new Map(backgroundVarValues.map(item => [item.backgroundvar, item])).values()];
});

// Watch for selection changes and emit event
const updateSelection = () => {
  emit("update:selected", { key: props.backgroundvar, value: selectedBackgroundvar.value });
};
</script>

<template>
    <div class="card flex justify-center">
        <MultiSelect 
            v-model="selectedBackgroundvar" 
            :options="uniqueBackgroundVarOptions" 
            optionLabel="backgroundvar" 
            filter 
            :placeholder="title"  
            class="w-full md:w-80"
            @change="updateSelection" />
    </div>
</template>
