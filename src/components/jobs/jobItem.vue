<template>
  <div>
    <small :class="'text-' + jobItemMessageState">{{
      !slotProps.option.authorized ? "Unauthorized job" : jobItemMessage
    }}</small>
    <BlockUI :blocked="!slotProps.option.authorized" class="py-1">
      <Accordion>
        <AccordionTab :header="slotProps.option.name">
          <div style="display: flow-root">
            <div class="d-flex align-items-center gap-1">
              <div class="d-flex flex-column gap-2" style="width: 45%">
                <label for="username">Technician</label>
                <Dropdown
                  v-model="selectedTechnician"
                  @change="saveButtonDisabled = false"
                  :options="employees"
                  :optionLabel="getFullName"
                  placeholder="technician"
                  class="me-2"
                />
              </div>
              <div class="d-flex flex-column gap-2" style="width: 45%">
                <label for="logged-hours">Hours</label>
                <InputNumber
                  :useGrouping="false"
                  disabled
                  placeholder="Enter hours"
                  v-model="loggedHours"
                  suffix="h"
                  id="logged-hours"
                  aria-describedby="logged-hours-help"
                />
              </div>
              <div class="d-flex flex-column gap-2">
                <label for="ingredient1" class="ml-2"> Completed </label>
                <Checkbox
                  inputId="ingredient1"
                  @change="saveButtonDisabled = false"
                  class="m-auto"
                  v-model="isCompleted"
                  :binary="true"
                />
              </div>
            </div>
            <Button
              class="float-end mt-4 mb-0 m-auto p-2 rounded"
              label="save"
              :disabled="saveButtonDisabled"
              :loading="saveButtonLoading"
              @click="updateJob"
            />
          </div>
        </AccordionTab>
      </Accordion>
    </BlockUI>
  </div>
</template>

<script setup>
import { defineProps, ref, defineEmits, watch, onMounted, toRefs } from "vue";
import Button from "primevue/button";
import InputNumber from "primevue/inputnumber";
import Dropdown from "primevue/dropdown";
import BlockUI from "primevue/blockui";
import Checkbox from "primevue/checkbox";
import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";
import { storageGet } from "@/utils/functions";

const props = defineProps({
  employees: { type: Array, required: true },
  slotProps: { type: Object, required: true },
  jobs: { type: Array, required: true },
  job: { type: Object, required: true },
  modelValue: { type: Object, required: true },
});

onMounted(async () => {
  token.value = await storageGet("accessToken");
  selectedTechnician.value = props.modelValue;
  isCompleted.value = props.job?.completedDate ? true : false;
  loggedHours.value = props.job?.labor[0]?.hours
    ? props.job?.labor[0]?.hours
    : 0;
});
const emits = defineEmits(["update:modelValue", "listBlocked"]);

const selectedTechnician = ref([null]);
const jobItemMessageState = ref("danger");
const jobItemMessage = ref("");
const token = ref("");
const loggedHours = ref(0);
const saveButtonLoading = ref(false);
const saveButtonDisabled = ref(true);
const isCompleted = ref(false);

watch(
  selectedTechnician,
  (newTechnician) => {
    emits("update:modelValue", newTechnician);
  },
  { deep: true }
);

const getFullName = (employee) =>
  employee?.firstName.substring(0, 1) + employee?.lastName.substring(0, 1);

const updateJob = async () => {
  if (!selectedTechnician.value?.id) {
    jobItemMessage.value = "Please select a technician";
    jobItemMessageState.value = "danger";
    return;
  }

  emits("listBlocked", true);
  saveButtonLoading.value = true;
  fetch(
    process.env.VUE_APP_UPDATE_JOB_CF_LINK +
      "?token=" +
      token.value +
      "&job_id=" +
      props.job.id +
      "&technician_id=" +
      selectedTechnician.value?.id +
      "&completed=" +
      isCompleted.value
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      emits("listBlocked", false);
      saveButtonLoading.value = false;
      if (data.type == "ERROR") {
        jobItemMessage.value = data.message;
        jobItemMessageState.value = "danger";
      } else {
        jobItemMessageState.value = "success";
        jobItemMessage.value = "Job updated successfully";
      }
    })
    .catch((error) => {
      emits("listBlocked", false);
      saveButtonLoading.value = false;
      console.log("error.message", error.message);
      jobItemMessage.value = "Failed to update job " + error.message;
      jobItemMessage.value = "danger";
    });
};
</script>

<style>
.p-accordion-header-text {
  color: black;
  width: 90%;
}

.p-accordion-header-link {
  text-decoration: none;
}
.p-inputnumber-input {
  width: 45%;
}
</style>
