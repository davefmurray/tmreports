<template>
  <Panel style="width: 95%">
    <BlockUI :blocked="false" class="p-0">
      <small :class="'text-' + alertSeverity">{{ alertMessage }}</small>

      <div class="w-75 m-auto mt-1">
        <label for="username">Odometer out</label>
        <InputGroup>
          <InputText v-model="milesOut" placeholder="Enter odometer out" />
          <Button
            icon="pi pi-check"
            :disabled="!milesOut"
            :loading="submitButtonLoading"
            @click="updateRepairJob"
          />
        </InputGroup>
      </div>
    </BlockUI>
  </Panel>
</template>

<script setup>
import Panel from "primevue/panel";
import BlockUI from "primevue/blockui";
import InputText from "primevue/inputtext";
import InputGroup from "primevue/inputgroup";
import Button from "primevue/button";
import { defineProps, onBeforeMount, ref } from "vue";
import { storageGet } from "@/utils/functions";

const token = ref("");
const alertMessage = ref("");
const alertSeverity = ref("success");
const submitButtonLoading = ref(false);
const props = defineProps({
  repairOrder: Object,
});
const milesOut = ref(props.repairOrder.milesOut);

onBeforeMount(async () => {
  token.value = await storageGet("accessToken");
});

const updateRepairJob = () => {
  submitButtonLoading.value = true;
  fetch(
    process.env.VUE_APP_UPDATE_REPAIR_ORDER_CF_LINK +
      "?token=" +
      token.value +
      "&repair_order_id=" +
      props.repairOrder.id +
      "&miles_out=" +
      milesOut.value +
      "&miles_in=" +
      props.repairOrder.milesIn
  )
    .then((res) => {
      if (!res.ok) {
        alertSeverity.value = "danger";
        alertMessage.value = res.statusText;
        throw new Error(res.statusText);
      }
      return res.json();
    })
    .then((data) => {
      submitButtonLoading.value = false;
      if (data.type == "ERROR") {
        alertMessage.value = data.message;
      } else {
        alertSeverity.value = "success";
        alertMessage.value = "Repair order updated successfully";
      }
    })
    .catch((error) => {
      submitButtonLoading.value = false;
      alertSeverity.value = "danger";
      alertMessage.value = error;
    });
};
</script>

<style>
.p-panel-header {
  display: none;
}
</style>
