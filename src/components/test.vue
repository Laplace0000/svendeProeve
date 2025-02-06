<script setup>
import { computed } from "vue";

const props = defineProps({
  converteddata: Array,
  topicFilter: String,
});

// Function to filter data based on topic filter only
const filteredData = computed(() => {
  return props.converteddata.filter((item) => {
    return item.topic_en === props.topicFilter;
  });
});

// Get table headers dynamically based on first data entry
const tableHeaders = computed(() => {
  return filteredData.value.length > 0 ? Object.keys(filteredData.value[0]) : [];
});
</script>

<template>
  <div>
    <h3>Filtered Results</h3>
    <table v-if="filteredData.length">
      <thead>
        <tr>
          <th v-for="header in tableHeaders" :key="header">
            {{ header }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in filteredData" :key="index">
          <td v-for="(value, key) in row" :key="key">
            {{ value }}
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else>No matching data found.</p>
  </div>
</template>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f4f4f4;
}
</style>
