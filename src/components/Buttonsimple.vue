<template>
  <button @click="handleClick" :class="buttonClass">
    {{ filterName }}
  </button>
</template>

<script>
export default {
  name: "MyButton",
  props: {
      buttonClass: {
          type: String,
          default: "btn-primary", // Default class for styling
      },
      filterName: {
          type: String,
          default: "missing input",
      }
  },
  methods: {
      handleClick(event) { // Accept event parameter
          console.log(this.filterName);
      }
  }
};
</script>

<style>
/* Example button styles */
.btn-primary {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}
.btn-primary:hover {
  background-color: #0056b3;
}
</style>
