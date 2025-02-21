// Method to log button clicks
const handleButtonClickchapter = (event) => {
    console.log('Button clicked (chapter):', event.category);
    if (selectedchapter.value === event.category) {
      selectedchapter.value = ""; // Clear selection
    } else {
      selectedchapter.value = event.category; // Update selection
    }
  };
  
  const handleButtonClickfactor = (event) => {
    console.log('Button clicked (factor):', event.category);
    if (selectedfactor.value === event.category) {
      selectedfactor.value = ""; // Clear selection
    } else {
      selectedfactor.value = event.category; // Update selection
    }
  };
  
  const handleClickCompany = (event) => {
    console.log('Button clicked (factor):', event.category);
    if (companyChoice.value === event.category) {
      companyChoice.value = ""; // Clear selection
    } else {
      companyChoice.value = event.category; // Update selection
    }
  };
  
  
  const handlefactorchapterReset = (filter) => {
    console.log('Button clicked (factorandchapter reset):');
    topicFilter.value = filter;  // Directly update topicFilter without "this"
    selectedfactor.value = "";   // Clear selection
    selectedchapter.value = "";  // Clear selection
  };
  
  // Handle updates from dropdowns
  const updateSelection = ({ key, value }) => {
    selectedFiltersDropdown[key] = value;
  };
  
  
  //problemmerne
  const handleOverallComparison = (filter) => {
      const filters = new Set(selectedOverallFilters.value); // Clone set
      if (filters.has(filter)) {
          filters.delete(filter);
      } else {
          filters.add(filter);
      }
      selectedOverallFilters.value = filters; // Replace to trigger reactivity
      console.log("Updated Filters:", Array.from(selectedOverallFilters.value));
  };
  
  
  const handleOverallComparisonReset = () => {
    selectedOverallFilters.value = new Set(); // Replace with new Set
    console.log("Filters Reset:", Array.from(selectedOverallFilters.value)); 
  };
  