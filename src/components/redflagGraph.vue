<script setup>
import { computed, defineProps, toRefs } from "vue";
import Chart from "primevue/chart";

// Define props
const props = defineProps({
  type: String, // Determines whether to show low, medium, or high red flag groups
  data: Array,
  topicFilter: String,
  chosenChapter: String,
  chosenFactor: String,
  companyChoice: String,
  dropdownfilters: Object,
  overallfiltering: Object, // The reactive object containing filtering criteria
});

// Convert overallfiltering into reactive refs
const overallFilters = toRefs(props.overallfiltering);

// Compute the title dynamically based on type
const title = computed(() => {
  if (props.type === "low") return "Doing good:";
  if (props.type === "medium") return "Warning zone:";
  if (props.type === "high") return "Something needs to be done:";
  return "";
});

// Function to filter data based on topic filter, chapter, factor, dropdown filters, and overall filtering
const filteredData = computed(() => {
  return props.data.filter((item) => {
    const matchesTopic = item.topic_en === props.topicFilter;
    const matchesChapter = !props.chosenChapter || item.chapter_en === props.chosenChapter;
    const matchesFactor = !props.chosenFactor || item.factor_en === props.chosenFactor;

    let includeItem = true;

    // Apply dropdown filters
    Object.keys(props.dropdownfilters).forEach((filterKey) => {
      const selectedValues = props.dropdownfilters[filterKey].map(val => val.backgroundvar);
      if (selectedValues.length && !selectedValues.includes(item[filterKey])) {
        includeItem = false;
      }
    });

    // Apply overall filtering criteria
    Object.keys(overallFilters).forEach((key) => {
      const filterValue = overallFilters[key].value;
      if (filterValue && typeof filterValue === "string" && item[key] !== undefined && item[key] !== filterValue) {
        includeItem = false;
      }
    });



    return matchesTopic && matchesChapter && matchesFactor && includeItem;
  });
});

// Compute grouped data using filteredData, grouped by `question_de`
const groupedData = computed(() => {
  const grouped = {};
  filteredData.value.forEach((item) => {
    const key = item.question_de;
    if (!grouped[key]) {
      grouped[key] = { counts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, total: 0 };
    }
    grouped[key].counts[item.answer] += 1;
    grouped[key].total += 1;
  });
  return grouped;
});

// Compute data formatted for a stacked horizontal bar chart
const chartData = computed(() => {
  const labels = Object.keys(groupedData.value);
  const datasets = [1, 2, 3, 4, 5].map((rating, index) => {
    return {
      label: rating.toString(),
      backgroundColor: ["#b71c1c", "#e65100", "#ffeb3b", "#8bc34a", "#2e7d32"][index],
      data: labels.map(key => groupedData.value[key].total > 0 
        ? (groupedData.value[key].counts[rating] / groupedData.value[key].total) * 100 
        : 0),
    };
  });
  return { labels, datasets };
});

// Chart options
const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: "y", // Horizontal bar chart
  plugins: {
    legend: {
      display: true,
      position: "top",
    },
  },
  scales: {
    x: {
      stacked: true,
      beginAtZero: true,
      max: 100,
      ticks: {
        callback: value => `${value}%`,
        color: "#ffffff",
      },
    },
    y: {
      stacked: true,
      ticks: {
        color: "#ffffff",
      },
    },
  },
}));
</script>

<template>
  <div>
    <h3>{{ title }}</h3>
    <Chart type="bar" :data="chartData" :options="chartOptions" style="height: 600px; width: 100%" />
  </div>
</template>

<style scoped>
h3 {
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: #ffffff;
}
</style>
