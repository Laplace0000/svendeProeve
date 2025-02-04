<script setup>
import { DataTable, Column } from 'primevue';
import { FilterMatchMode } from '@primevue/core/api';
import { ref, inject, watch } from 'vue';

// Inject reactive user data
const injectedData = inject('eudemosData'); 
const objects = ref(injectedData.eudemosData);

const props = defineProps({
  collumnInput: {
    type: String,
    default: 'backgroundvar1', 
  },
  topicFilterInput: {
    type: String,
    default: 'Health factors',
  },
});

// Variables
const selectedObjects = ref([]);
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  topic_en: { value: props.topicFilterInput, matchMode: FilterMatchMode.CONTAINS },
});

const columns = ref([
  { field: 'id', header: 'ID' },
  { field: props.collumnInput, header: 'Backgroundvar' },
  { field: 'topic_en', header: 'Topic' },
  { field: 'red_flags', header: 'Red Flags' },
]);

// Watch for changes to filters and update the filters
watch(() => props.topicFilterInput, (newValue) => {
  filters.value.topic_en.value = newValue;
}, { immediate: true }); // Trigger immediately to handle the initial value
</script>


<template>         
  <div>
    <div class="card">
      <DataTable
        ref="dataTable"
        :value="objects"
        :filters="filters"
        :globalFilterFields="columns.map(col => col.field)"
        v-model:selection="selectedObjects"
        selectionMode="multiple" 
        stripedRows
        sortMode="multiple"
        removableSort
        paginator
        :rows="5"
        :totalRecords="120"
        tableStyle="min-width: 50rem"
      >
        <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
        <Column v-for="col in columns" :key="col.field" :field="col.field" :header="col.header" sortable></Column>
      </DataTable>
    </div>
  </div>
</template>
