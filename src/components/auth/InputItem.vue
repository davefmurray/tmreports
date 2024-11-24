<template>
  <div class="d-flex flex-column gap-2">
    <label for="email">{{ label }}</label>
    <slot></slot>
    <small class="text-danger">{{ error }}</small>
  </div>
</template>

<script setup>
import defineProps from "vue";

defineProps({
  label: { type: String, required: true },
  error: { type: String, required: true },
});
</script>

<style lang="scss" scoped></style>
