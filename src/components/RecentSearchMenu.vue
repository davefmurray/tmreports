<template>
  <Menu :model="recentSearchOrders" class="w-75 text-decoration-none">
    <template #start>
      <h6 class="m-0 text-muted ms-2 mt-2">Recent repair orders</h6>
    </template>
    <template #item="{ item, props }">
      <div v-bind="props.action" @click="navigateToRepairOrder(item)">
        <span class="pi pi-cog" />
        <span class="ms-2">Repair Order # {{ item }}</span>
      </div>
    </template>
  </Menu>
</template>

<script setup>
import { defineEmits, defineProps } from "vue";
import Menu from "primevue/menu";

defineProps({
  recentSearchOrders: { type: Array, required: true },
});
const navigateToRepairOrder = (id) => {
  emit("navigateToRepairOrder", id);
};

const emit = defineEmits(["navigateToRepairOrder"]);
</script>

<style lang="scss" scoped></style>
