<template>
  <div
    class="d-flex flex-column justify-content-start align-items-center gap-1"
  >
    <Message v-if="alertMessage" class="" :severity="alertSeverity">{{
      alertMessage
    }}</Message>

    <InputGroup class="w-75 mt-3">
      <Button
        label="Search"
        :loading="searchButtonLoading"
        @click="getRepairOrder"
        severity="info"
      />
      <InputNumber
        :useGrouping="false"
        @keyup.enter="getRepairOrder"
        placeholder="Enter repair order number #"
        v-model="repairOrderId"
      />
      <Button
        v-if="repairOrder.id"
        severity="secondary"
        outlined
        label="Back"
        @click="back"
      />
    </InputGroup>
    <small id="username-help" class="text-danger">{{
      repairOrderSearchError
    }}</small>

    <RecentSearchMenu
      :recentSearchOrders="recentSearchOrders"
      v-if="!repairOrder.id && recentSearchOrders.length"
      @navigateToRepairOrder="getRepairOrder"
    >
    </RecentSearchMenu>

    <JobsList v-if="repairOrder.id" :repairOrder="repairOrder"></JobsList>
    <RepairOrderInfo
      v-if="repairOrder.id"
      :repairOrder="repairOrder"
    ></RepairOrderInfo>
  </div>
  <Button
    icon="pi pi-sign-out"
    class="float-end position-absolute bottom-0"
    style="right: 0"
    text
    rounded
    @click="handleSignOut"
    aria-label="sign out"
  />
</template>

<script setup>
import Button from "primevue/button";
import InputGroup from "primevue/inputgroup";
import InputNumber from "primevue/inputnumber";
import Message from "primevue/message";
import { onBeforeMount, ref, watch } from "vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import router from "@/utils/router";
import { useLogout } from "@/composables/useLogout";
import { cacheExpired, storageGet } from "@/utils/functions";
import RecentSearchMenu from "@/components/RecentSearchMenu.vue";
import JobsList from "@/components/jobs/JobsList.vue";
import RepairOrderInfo from "@/components/RepairOrderInfo.vue";

const searchButtonLoading = ref(false);
const repairOrder = ref([null]);
const repairOrderId = ref();
const repairOrderSearchError = ref("");
const alertMessage = ref("");
const alertSeverity = ref("success");

// const jobs = ref([]);
const employees = ref([]);
const handleSignOut = useLogout();
const token = ref("");
const recentSearchOrders = ref([]);

onBeforeMount(async () => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      if (!user.emailVerified) {
        router.push("verify");
      }
    } else {
      // User is signed out
      router.push("sign-in");
    }
  });

  recentSearchOrders.value = (await storageGet("recentSearchOrders")) ?? [];
  token.value = await storageGet("accessToken");
  employees.value = await storageGet("employees");

  console.log("employees", employees.value);

  const isCachedExpired = await cacheExpired();

  if (isCachedExpired || !token.value || !employees.value) {
    fetch(process.env.VUE_APP_TOKEN_CF_LINK)
      .then((res) => res.json())
      .then((data) => {
        token.value = data.access_token;
        chrome.storage.local.set({ accessToken: data.access_token });
        fetch(process.env.VUE_APP_EMPLOYEES_CF_LINK + "?token=" + token.value)
          .then((res) => {
            if (!res.ok) {
              chrome.storage.local.set({
                updated_at: null,
              });
            }
            return res.json();
          })
          .then((data) => {
            // add alias name to employees list and sort them by alias name
            // retrieve only technicians with role id 3
            const TECHNICIAN_ROLE_CODE = "3";
            let technicians = data?.content
              ?.filter(
                (employee) =>
                  employee?.employeeRole?.code == TECHNICIAN_ROLE_CODE
              )
              .map((employee, index) => ({
                aliasName:
                  employee?.firstName.substring(0, 1) +
                  employee?.lastName.substring(0, 1),
                ...employee,
              }))
              .sort((a, b) => a.aliasName.localeCompare(b.aliasName));
            employees.value = technicians;
            chrome.storage.local.set({ employees: technicians });
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));
  }
});

watch(repairOrder, (newOrder, oldOrder) => {
  if (
    newOrder?.type != "ERROR" &&
    !repairOrder.value.jobs?.length &&
    newOrder?.id
  ) {
    repairOrderSearchError.value = "No jobs available yet for this order";
  } else if (repairOrder.value.postedDate != null) {
    repairOrderSearchError.value = "Repair order already posted";
  }
});
const getRepairOrder = (id = null) => {
  if (id !== null && Number.isInteger(id)) {
    repairOrderId.value = id;
  }

  if (!repairOrderId.value) {
    return;
  }

  searchButtonLoading.value = true;

  fetch(
    process.env.VUE_APP_REPAIR_ORDER_CF_LINK +
      "?token=" +
      token.value +
      "&repair_order_id=" +
      repairOrderId.value
  )
    .then((res) => {
      if (!res.ok) {
        repairOrderSearchError.value = "Invalid repair order number";
        throw new Error("Invalid repair order number");
      }

      return res.json();
    })
    .then((data) => {
      searchButtonLoading.value = false;
      if (data.type == "ERROR") {
        repairOrderSearchError.value = data.message;
      } else if (data.content?.length) {
        repairOrder.value = data.content[0];
        // milesOut.value = repairOrder.value.milesOut;

        recentSearchOrders.value.unshift(repairOrderId.value);
        recentSearchOrders.value = [...new Set(recentSearchOrders.value)].slice(
          0,
          8
        );
        chrome.storage.local.set({
          recentSearchOrders: [...recentSearchOrders.value],
        });
      } else {
        repairOrderSearchError.value = "Invalid repair order number";
      }
    })
    .catch((error) => {
      // blocked.value = false;
      repairOrderSearchError.value = error;
    });
};

const back = () => {
  repairOrder.value = [null];
  repairOrderSearchError.value = null;
};
</script>

<style>
.p-stepper {
  flex-basis: 50rem;
}

.p-listbox-list {
  padding: 5px;
}

.p-stepper-panels {
  height: 100%;
  padding-bottom: 0;
}

.p-stepper-content {
  height: 80%;
}

.p-stepper-nav {
  padding: 0 10px !important;
}

ul {
  padding-left: 0px !important;
}

.p-card {
  box-shadow: none;
}

.p-stepper-container {
  height: 335px;
}

.p-listbox-list-wrapper {
  height: 100%;
}

.p-menuitem-link {
  text-decoration: none;
}

.p-blockui-container {
  width: 100%;
  padding: 20px;
}
</style>

<style></style>
