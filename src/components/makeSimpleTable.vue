<script setup>
import { DataTable, Column } from 'primevue';
import { FilterMatchMode } from '@primevue/core/api';
import { ref, inject } from 'vue'; 

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
  watch: {
    topicFilterInput(newVal) {
      console.log("Topic Filter updated:", newVal);
      this.reloadTable();
    },
    collumnInput(newVal) {
      console.log("Column Input updated:", newVal);
      this.reloadTable();
    },
  },
  methods: {
    reloadTable() {
      // Add logic to refresh or reload table data
      console.log("Table reloaded with new props");
    },
  },
});

// Access props 
console.log(props.collumnInput); 
console.log(props.topicFilterInput); 


// Variables
const selectedObjects = ref([]);
const dataTable = ref([]);
const object = ref({});
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  topic_en: { value: props.topicFilterInput, matchMode: FilterMatchMode.CONTAINS },
});

const columns = ref([
  { field: 'id', header: 'ID' },
  { field: props.collumnInput, header: 'Backgroundvar' }, // Add a dynamic column based on collumnInput
  { field: 'topic_en', header: 'Topic' }
]);
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
