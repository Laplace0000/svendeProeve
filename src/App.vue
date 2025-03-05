<template>
  <!-- PARENT TEMPLATE ONLY -->
  <div>
    <!-- 1) Buttons to reset factor/chapter/topic -->
    <div class="card">
      <div class="button-container">
        <Buttonsimple :filterName="'Health factors'" @click="handlefactorchapterReset('#1 Health factors')" />
        <Buttonsimple :filterName="'Important overload factors'" @click="handlefactorchapterReset('#2 Important overload factors (Topic)')" />
        <Buttonsimple :filterName="'Work causes'" @click="handlefactorchapterReset('#3 Work causes')" />
        <Buttonsimple :filterName="'Relationship causes'" @click="handlefactorchapterReset('#4 Relationship causes')" />
        <Buttonsimple :filterName="'Cultural causes'" @click="handlefactorchapterReset('#5 Cultural causes')" />
        <Buttonsimple :filterName="'Occupational Health'" @click="handlefactorchapterReset('#6 Occupational Health')" />
      </div>

      <!-- 2) Row of multi-select dropdowns -->
      <div class="button-container">
        <DropdownUniques 
          backgroundvar="backgroundvar2" 
          title="Level 1" 
          :data="converteddata" 
          @update:selected="updateSelection" 
        />
        <DropdownUniques 
          backgroundvar="backgroundvar3" 
          title="Level 2" 
          :data="converteddata" 
          @update:selected="updateSelection" 
        />
        <DropdownUniques 
          backgroundvar="backgroundvar4" 
          title="Level 3" 
          :data="converteddata" 
          @update:selected="updateSelection" 
        />
        <DropdownUniques 
          backgroundvar="backgroundvar5" 
          title="Level 4" 
          :data="converteddata" 
          @update:selected="updateSelection" 
        />
        <DropdownUniques 
          backgroundvar="backgroundvar1" 
          title="type" 
          :data="converteddata" 
          @update:selected="updateSelection" 
        />
      </div>
    </div>

    <!-- 3) Two tables side by side -->
    <div class="card-container">
      <ButtonbasedTable
        type="chapter_en"
        :data="converteddata"
        :topicFilter="topicFilter"
        :chosenChapter="selectedchapter"
        :chosenFactor="selectedfactor"
        :dropdownfilters="selectedFiltersDropdown"
        @buttonClicked="handleButtonClickchapter"
      />
      <ButtonbasedTable
        type="factor_en"
        :data="converteddata"
        :topicFilter="topicFilter"
        :chosenChapter="selectedchapter"
        :chosenFactor="selectedfactor"
        :dropdownfilters="selectedFiltersDropdown"
        @buttonClicked="handleButtonClickfactor"
      />
    </div>

    <!-- 4) Overall comparison -->
    <div class="card">
      <b> Overall comparison</b>
      <div class="button-container">
        <Buttonsimple 
          filterName="Level 1"
          @click="handleOverallComparisonUpdate('OverallComparisonLevel1', 'backgroundvar2')"
        />
        <Buttonsimple  
          filterName="Level 2"
          @click="handleOverallComparisonUpdate('OverallComparisonLevel2', 'backgroundvar3')"
        />
        <Buttonsimple  
          filterName="Level 3"
          @click="handleOverallComparisonUpdate('OverallComparisonLevel3', 'backgroundvar4')"
        />
        <Buttonsimple  
          filterName="Level 4"
          @click="handleOverallComparisonUpdate('OverallComparisonLevel4', 'backgroundvar5')"
        />
        <Buttonsimple  
          filterName="Type"
          @click="handleOverallComparisonUpdate('OverallComparisonType', 'backgroundvar1')"
        />
        <Buttonsimple  
          filterName="Factor"
          @click="handleOverallComparisonUpdate('OverallComparisonFactor', 'factortext_en')"
        />
        <Buttonsimple 
          :filterName="'Reset'" 
          @click="handleOverallComparisonReset()"   
        />
      </div>

      <div class="card-container">
        <Persistentbuttonbasedtable
          type="low"
          :data="converteddata"
          :topicFilter="topicFilter"
          :chosenChapter="selectedchapter"
          :chosenFactor="selectedfactor"
          :companyChoice="companyChoice"
          :dropdownfilters="selectedFiltersDropdown"
          :overallfiltering="OverallComparisonPacket"
          @buttonClicked="handleClickCompany"
        />
        <Persistentbuttonbasedtable
          type="medium"
          :data="converteddata"
          :topicFilter="topicFilter"
          :chosenChapter="selectedchapter"
          :chosenFactor="selectedfactor"
          :companyChoice="companyChoice"
          :dropdownfilters="selectedFiltersDropdown"
          :overallfiltering="OverallComparisonPacket"
          @buttonClicked="handleClickCompany"
        />
        <Persistentbuttonbasedtable
          type="high"
          :data="converteddata"
          :topicFilter="topicFilter"
          :chosenChapter="selectedchapter"
          :chosenFactor="selectedfactor"
          :companyChoice="companyChoice"
          :dropdownfilters="selectedFiltersDropdown"
          :overallfiltering="OverallComparisonPacket"
          @buttonClicked="handleClickCompany"
        />
      </div>
    </div>

    <!-- 5) Graph -->
    <div class="card-container_2">
      <RedflagGraph
        type="chapter_en"
        :data="converteddata"
        :topicFilter="topicFilter"
        :chosenChapter="selectedchapter"
        :chosenFactor="selectedfactor"
        :dropdownfilters="selectedFiltersDropdown"
        :overallfiltering="OverallComparisonPacket"
      />
    </div>
  </div>
</template>

<script>
/**
 * Single-file component with NO runtime template compilation in child components.
 * Instead, each child uses a render() / h() function. That way, we don't need
 * "vue/dist/vue.esm-bundler.js" or inlined `template: "..."`
 */
import { defineComponent, ref, watch, reactive, inject, computed, toRefs, h } from "vue";
import MultiSelect from 'primevue/multiselect';
import Chart from "primevue/chart";

/* ------------------------------------------------------------------
   CHILD #1: Buttonsimple (MyButton)
   Converted to a render function, no template property.
------------------------------------------------------------------ */
const Buttonsimple = defineComponent({
  name: "MyButton",
  props: {
    buttonClass: { type: String, default: "btn-primary" },
    filterName: { type: String, default: "missing input" },
  },
  emits: ["click"],
  setup(props, { emit }) {
    const handleClick = (event) => {
      emit("click", event);
      console.log(props.filterName);
    };
    // Return a render function using `h`
    return () =>
      h(
        "button",
        {
          class: props.buttonClass,
          onClick: handleClick,
        },
        props.filterName
      );
  },
});

/* ------------------------------------------------------------------
   CHILD #2: DropdownUniques
   Also uses a render function referencing primevue MultiSelect
------------------------------------------------------------------ */
const dropdownUniques = defineComponent({
  name: "MultiSelectDropdown",
  components: { MultiSelect },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    backgroundvar: {
      type: String,
      default: "backgroundvar1",
    },
    title: {
      type: String,
      default: "variable",
    },
  },
  emits: ["update:selected"],
  setup(props, { emit }) {
    const selectedBackgroundvar = ref([]);
    const converteddataprop = ref(props.data);

    const uniqueBackgroundVarOptions = computed(() => {
      const backgroundVarValues = converteddataprop.value.map(item => ({
        backgroundvar: item[props.backgroundvar],
      }));
      // De-duplicate
      return [
        ...new Map(backgroundVarValues.map(v => [v.backgroundvar, v])).values(),
      ];
    });

    const updateSelection = () => {
      emit("update:selected", { key: props.backgroundvar, value: selectedBackgroundvar.value });
    };

    // Return a render function
    return () =>
      h("div", { class: "card flex justify-center" }, [
        h(MultiSelect, {
          modelValue: selectedBackgroundvar.value,
          "onUpdate:modelValue": (val) => (selectedBackgroundvar.value = val),
          options: uniqueBackgroundVarOptions.value,
          optionLabel: "backgroundvar",
          filter: true,
          placeholder: props.title,
          class: "w-full md:w-80",
          onChange: updateSelection,
        }),
      ]);
  },
});

/* ------------------------------------------------------------------
   CHILD #3: buttonbasedTable (FilteredTable)
   Manually create a render function for the table-like structure.
------------------------------------------------------------------ */
const buttonbasedTable = defineComponent({
  name: "FilteredTable",
  props: {
    type: String,
    data: Array,
    topicFilter: String,
    chosenChapter: String,
    chosenFactor: String,
    dropdownfilters: Object,
  },
  emits: ["buttonClicked"],
  setup(props, { emit }) {
    // Filter logic
    const filteredData = computed(() => {
      return props.data.filter(item => {
        const matchesTopic = item.topic_en === props.topicFilter;
        const matchesChapter = !props.chosenChapter || item.chapter_en === props.chosenChapter;
        const matchesFactor = !props.chosenFactor || item.factor_en === props.chosenFactor;

        let excludeItem = false;
        Object.keys(props.dropdownfilters).forEach(filterKey => {
          const selectedVals = props.dropdownfilters[filterKey];
          if (selectedVals.length > 0) {
            const selectedNames = selectedVals.map(v => v.backgroundvar);
            if (selectedNames.includes(item[filterKey])) {
              excludeItem = true;
            }
          }
        });
        return matchesTopic && matchesChapter && matchesFactor && !excludeItem;
      });
    });

    // Group by `props.type` (like "chapter_en", "factor_en", etc.)
    const groupedData = computed(() => {
      const grouped = {};
      filteredData.value.forEach(item => {
        const key = item[props.type];
        if (!grouped[key]) {
          grouped[key] = { count: 0, redFlagCount: 0 };
        }
        grouped[key].count += 1;
        if (parseInt(item.red_flags) === 1) {
          grouped[key].redFlagCount += 1;
        }
      });
      // Calculate percentages
      Object.keys(grouped).forEach(k => {
        grouped[k].redFlagPercentage =
          (grouped[k].redFlagCount / grouped[k].count) * 100;
      });
      return grouped;
    });

    // Nicely formatted label for the 'type'
    const formattedType = computed(() => {
      return props.type.replace("_", " ").replace(/\b\w/g, char => char.toUpperCase());
    });

    const notifyParent = (key, percentage) => {
      emit("buttonClicked", { category: key, percentage, type: props.type });
    };

    // Return a render function
    return () => {
      // Build the header
      const header = h("div", { class: "header-container" }, [
        h("div", { class: "header-item" }, formattedType.value),
        h("div", { class: "header-item" }, "Red Flags"),
      ]);

      // Build the rows
      const rows = Object.entries(groupedData.value).map(([key, item]) => {
        return h("div", { key, class: "item-container" }, [
          h("p", key),
          h(
            "button",
            {
              class: { "red-flag": item.redFlagPercentage > 0 },
              onClick: () => notifyParent(key, item.redFlagPercentage),
              ariaLabel: `${key} has ${item.redFlagPercentage.toFixed(2)}% red flags`,
            },
            item.redFlagPercentage.toFixed(2) + "%"
          ),
        ]);
      });

      return h("div", null, [header, ...rows]);
    };
  },
});

/* ------------------------------------------------------------------
   CHILD #4: persistentbuttonbasedtable (CategorizedTable)
------------------------------------------------------------------ */
const persistentbuttonbasedtable = defineComponent({
  name: "CategorizedTable",
  props: {
    type: String,
    data: Array,
    topicFilter: String,
    chosenChapter: String,
    chosenFactor: String,
    companyChoice: String,
    dropdownfilters: Object,
    overallfiltering: Object,
  },
  emits: ["buttonClicked"],
  setup(props, { emit }) {
    // Convert overallfiltering to refs for reactivity
    const overallFilters = toRefs(props.overallfiltering);

    // Title depends on 'low', 'medium', 'high'
    const title = computed(() => {
      if (props.type === "low") return "Doing good:";
      if (props.type === "medium") return "Warning zone:";
      if (props.type === "high") return "Something needs to be done:";
      return "";
    });

    // Merge multiple columns for grouping
    const mergedData = computed(() => {
      return props.data.map(item => {
        let mergedKey = item.backgroundvar2 ?? "";
        Object.keys(overallFilters).forEach(k => {
          const col = overallFilters[k].value; // e.g. "backgroundvar3"
          if (col) {
            mergedKey += ` | ${item[col] ?? ""}`;
          }
        });
        return { ...item, mergedKey };
      });
    });

    // Filter data
    const filteredData = computed(() => {
      return mergedData.value.filter(item => {
        const matchesTopic = item.topic_en === props.topicFilter;
        const matchesChapter = !props.chosenChapter || item.chapter_en === props.chosenChapter;
        const matchesFactor = !props.chosenFactor || item.factor_en === props.chosenFactor;

        let includeItem = true;
        Object.keys(props.dropdownfilters).forEach(filterKey => {
          const selectedVals = props.dropdownfilters[filterKey].map(v => v.backgroundvar);
          if (selectedVals.length && !selectedVals.includes(item[filterKey])) {
            includeItem = false;
          }
        });
        return matchesTopic && matchesChapter && matchesFactor && includeItem;
      });
    });

    // Group by mergedKey
    const groupedData = computed(() => {
      const grouped = {};
      filteredData.value.forEach(item => {
        const k = item.mergedKey;
        if (!grouped[k]) {
          grouped[k] = { count: 0, redFlagCount: 0 };
        }
        grouped[k].count++;
        if (parseInt(item.red_flags) === 1) {
          grouped[k].redFlagCount++;
        }
      });
      Object.keys(grouped).forEach(k => {
        grouped[k].redFlagPercentage =
          grouped[k].count > 0
            ? (grouped[k].redFlagCount / grouped[k].count) * 100
            : 0;
      });
      return grouped;
    });

    // Filter down to 'low', 'medium', or 'high'
    const categorizedData = computed(() => {
      const entries = Object.entries(groupedData.value);
      let result = entries.filter(([_, val]) => {
        const pct = val.redFlagPercentage;
        if (props.type === "low") return pct < 16;
        if (props.type === "medium") return pct >= 15 && pct <= 26;
        if (props.type === "high") return pct > 25;
        return false;
      })
      .reduce((acc, [k, v]) => {
        acc[k] = v;
        return acc;
      }, {});

      // If companyChoice is set but not found, return empty
      if (props.companyChoice && !result[props.companyChoice]) {
        return {};
      }
      return result;
    });

    const notifyParent = (key, percentage) => {
      emit("buttonClicked", { category: key, percentage, type: props.type });
    };

    // Render function
    return () => {
      // Header
      const header = h("div", { class: "header-container" }, [
        h("div", { class: "header-item" }, title.value),
        h("div", { class: "header-item" }, ""),
      ]);

      // Rows
      const keys = Object.keys(categorizedData.value);
      if (!keys.length) {
        // Empty message if no data
        return h("div", null, [
          header,
          h("div", { class: "empty-message" }, "No data available based on the selected filters.")
        ]);
      }

      const rows = keys.map(key => {
        const item = categorizedData.value[key];
        return h("div", { key, class: "item-container" }, [
          h("p", {
            class: { "bold-text": key === props.companyChoice }
          }, key),
          h("button", {
            class: {
              "red-flag-low": props.type === "low",
              "red-flag-medium": props.type === "medium",
              "red-flag-high": props.type === "high",
            },
            onClick: () => notifyParent(key, item.redFlagPercentage),
          }, item.redFlagPercentage.toFixed(2) + "%")
        ]);
      });

      return h("div", null, [header, ...rows]);
    };
  },
});

/* ------------------------------------------------------------------
   CHILD #5: redflagGraph (ChartComponent)
------------------------------------------------------------------ */
const redflagGraph = defineComponent({
  name: "ChartComponent",
  components: { Chart },
  props: {
    type: String,
    data: Array,
    topicFilter: String,
    chosenChapter: String,
    chosenFactor: String,
    companyChoice: String,
    dropdownfilters: Object,
    overallfiltering: Object,
  },
  setup(props) {
    const overallFilters = toRefs(props.overallfiltering);

    // Title (if you want to handle "low/medium/high", or else blank)
    const title = computed(() => {
      if (props.type === "low") return "Doing good:";
      if (props.type === "medium") return "Warning zone:";
      if (props.type === "high") return "Something needs to be done:";
      return "";
    });

    // Filter data
    const filteredData = computed(() => {
      return props.data.filter(item => {
        const matchesTopic = item.topic_en === props.topicFilter;
        const matchesChapter = !props.chosenChapter || item.chapter_en === props.chosenChapter;
        const matchesFactor = !props.chosenFactor || item.factor_en === props.chosenFactor;

        let includeItem = true;
        // Check dropdown filters
        Object.keys(props.dropdownfilters).forEach(filterKey => {
          const selectedVals = props.dropdownfilters[filterKey].map(v => v.backgroundvar);
          if (selectedVals.length && !selectedVals.includes(item[filterKey])) {
            includeItem = false;
          }
        });
        // Check overall filters
        Object.keys(overallFilters).forEach(k => {
          const colVal = overallFilters[k].value; // e.g. "backgroundvar3"
          if (colVal && item[k] !== undefined && item[k] !== colVal) {
            includeItem = false;
          }
        });
        return matchesTopic && matchesChapter && matchesFactor && includeItem;
      });
    });

    // Group by question_de, tally up answers 1..5
    const groupedData = computed(() => {
      const grouped = {};
      filteredData.value.forEach(item => {
        const key = item.question_de;
        if (!grouped[key]) {
          grouped[key] = { counts: {1: 0,2: 0,3: 0,4: 0,5: 0}, total: 0 };
        }
        grouped[key].counts[item.answer] += 1;
        grouped[key].total += 1;
      });
      return grouped;
    });

    // Build chart data
    const chartData = computed(() => {
      const labels = Object.keys(groupedData.value);
      const backgroundColors = ["#b71c1c", "#e65100", "#ffeb3b", "#8bc34a", "#2e7d32"];
      const datasets = [1,2,3,4,5].map((rating, idx) => {
        return {
          label: rating.toString(),
          backgroundColor: backgroundColors[idx],
          data: labels.map(label => {
            const info = groupedData.value[label];
            if (info.total > 0) {
              return (info.counts[rating] / info.total) * 100;
            }
            return 0;
          })
        };
      });
      return { labels, datasets };
    });

    // Chart options
    const chartOptions = computed(() => ({
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: "y", // horizontal
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
            callback: (val) => val + "%",
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

    // Render function
    return () => {
      return h("div", [
        h("h3", title.value),
        // <Chart> is a normal SFC or plugin from primevue, so we can use h(Chart, { ... })
        h(Chart, {
          type: "bar",
          data: chartData.value,
          options: chartOptions.value,
          style: "height:600px;width:100%;",
        }),
      ]);
    };
  },
});

/* ------------------------------------------------------------------
   PARENT COMPONENT (the default export)
   Register child components, define data & watchers, etc.
------------------------------------------------------------------ */
export default defineComponent({
  name: "AllInOneNoRuntimeWarning",
  components: {
    Buttonsimple,
    DropdownUniques: dropdownUniques,
    ButtonbasedTable: buttonbasedTable,
    Persistentbuttonbasedtable: persistentbuttonbasedtable,
    RedflagGraph: redflagGraph,
  },
  setup() {
    // Reactive model for selected filters
    const selectedFiltersDropdown = reactive({
      backgroundvar1: [],
      backgroundvar2: [],
      backgroundvar3: [],
      backgroundvar4: [],
      backgroundvar5: [],
    });

    const selectedfactor = ref("");
    const selectedchapter = ref("");
    const topicFilter = ref("#1 Health factors");
    const companyChoice = ref("");

    const OverallComparisonLevel1 = ref("");
    const OverallComparisonLevel2 = ref("");
    const OverallComparisonLevel3 = ref("");
    const OverallComparisonLevel4 = ref("");
    const OverallComparisonType = ref("");
    const OverallComparisonFactor = ref("");

    const OverallComparisonPacket = ref({
      level1: OverallComparisonLevel1,
      level2: OverallComparisonLevel2,
      level3: OverallComparisonLevel3,
      level4: OverallComparisonLevel4,
      type: OverallComparisonType,
      factor: OverallComparisonFactor,
    });

    watch(selectedFiltersDropdown, (val) => {
      console.log("Filters updated:", JSON.stringify(val, null, 2));
    }, { deep: true });

    watch(topicFilter, (newVal) => {
      console.log("topicFilter updated:", newVal);
    });

    // Event handlers
    const handleButtonClickchapter = (event) => {
      if (selectedchapter.value === event.category) {
        selectedchapter.value = "";
      } else {
        selectedchapter.value = event.category;
      }
    };
    const handleButtonClickfactor = (event) => {
      if (selectedfactor.value === event.category) {
        selectedfactor.value = "";
      } else {
        selectedfactor.value = event.category;
      }
    };
    const handleClickCompany = (event) => {
      if (companyChoice.value === event.category) {
        companyChoice.value = "";
      } else {
        companyChoice.value = event.category;
      }
    };

    const handleOverallComparisonUpdate = (level, value) => {
      // toggles the filter
      if (eval(level).value === value) {
        eval(level).value = "";
      } else {
        eval(level).value = value;
      }
    };

    const handlefactorchapterReset = (filter) => {
      topicFilter.value = filter;
      selectedfactor.value = "";
      selectedchapter.value = "";
    };

    const updateSelection = ({ key, value }) => {
      selectedFiltersDropdown[key] = value;
    };

    const handleOverallComparisonReset = () => {
      OverallComparisonLevel1.value = "";
      OverallComparisonLevel2.value = "";
      OverallComparisonLevel3.value = "";
      OverallComparisonLevel4.value = "";
      OverallComparisonType.value = "";
      OverallComparisonFactor.value = "";
      console.log("Filters Reset:");
    };

    // Inject data or fallback
    const injectedData = inject("eudemosData");
    const converteddata = ref(injectedData?.eudemosData || []);

    return {
      selectedFiltersDropdown,
      selectedfactor,
      selectedchapter,
      topicFilter,
      companyChoice,
      OverallComparisonLevel1,
      OverallComparisonLevel2,
      OverallComparisonLevel3,
      OverallComparisonLevel4,
      OverallComparisonType,
      OverallComparisonFactor,
      OverallComparisonPacket,

      handleButtonClickchapter,
      handleButtonClickfactor,
      handleClickCompany,
      handleOverallComparisonUpdate,
      handlefactorchapterReset,
      updateSelection,
      handleOverallComparisonReset,

      converteddata,
    };
  },
});
</script>

<style scoped>
:global(body) {
  background-color: white;
  color: black;
  margin: 40px;
  padding: 0;
}

.grid-container {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr; /* Three columns: left, center, right */
  grid-template-rows: auto;
  gap: 20px;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.middle-column {
  grid-column: 2;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.button-container {
  display: flex;
  max-width: 1200px;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.card-container {
  max-width: 1200px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  gap: 10px;
  margin-bottom: 20px;
}

.card-container_2 {
  max-width: 1200px;
  background-color: grey;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  gap: 10px;
  margin-bottom: 20px;
}

.card {
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.header-container {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
}

.header-item {
  margin: 5px;
}

.item-container {
  display: flex;
  justify-content: space-between;
  margin: 5px 0;
  gap: 10px;
}

.red-flag {
  background-color: red;
  color: white;
}

/* For the persistent table categories */
.red-flag-low {
  background-color: green;
  color: white;
}
.red-flag-medium {
  background-color: orange;
  color: white;
}
.red-flag-high {
  background-color: red;
  color: white;
}

.bold-text {
  font-weight: bold;
}

.empty-message {
  color: gray;
  font-style: italic;
  margin-top: 10px;
}
</style>
