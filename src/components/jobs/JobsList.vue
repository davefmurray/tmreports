<template>
  <div class="w-100">
    <BlockUI
      :blocked="listBlocked || repairOrder.postedDate != null"
      style="width: 95%"
      class="p-0 mb-2 m-auto"
    >
      <Listbox
        v-if="jobs?.length"
        v-model="selectedJob"
        :options="jobs"
        optionLabel="name"
        placeholder="No available jobs yet"
        style="overflow-y: auto; max-height: 376px"
        class="m-auto"
      >
        <template #option="slotProps">
          <JopItem
            :jobs="jobs"
            :job="jobs[slotProps.index]"
            :employees="employees"
            :slotProps="slotProps"
            v-model="jobs[slotProps.index].technician"
            @listBlocked="listBlocked = $event"
          ></JopItem>
        </template>
      </Listbox>
    </BlockUI>
  </div>
</template>

<script setup>
import BlockUI from "primevue/blockui";
import Listbox from "primevue/listbox";
import JopItem from "@/components/jobs/jobItem.vue";
import { storageGet } from "@/utils/functions";
import { defineProps, ref, onMounted, toRefs, watch } from "vue";

const props = defineProps({
  repairOrder: Object,
  blocked: Boolean,
});

onMounted(async () => {
  employees.value = await storageGet("employees");
  jobs.value = repairOrder.value.jobs.sort((a, b) => {
    if (a.authorized === b.authorized) {
      return 0;
    }
    return a.authorized ? -1 : 1;
  });
});

const { repairOrder } = toRefs(props);
const selectedJob = ref();
const employees = ref([]);
const jobs = ref([]);
const listBlocked = ref(false);

watch(repairOrder, (newOrder, oldOrder) => {
  jobs.value =
    newOrder?.jobs.sort((a, b) => {
      if (a.authorized === b.authorized) {
        return 0;
      }
      return a.authorized ? -1 : 1;
    }) ?? [];
});

watch(
  jobs,
  (newJobs) => {
    newJobs?.forEach((job, index) => {
      if (job.technician) {
        newJobs[index].technicianId = job.technician?.id;
      } else if (job.technicianId) {
        newJobs[index].technician = employees.value.find(
          (employee) => employee.id == job.technicianId
        );
      }
    });
  },
  { deep: true }
);
</script>

<style lang="scss" scoped></style>
