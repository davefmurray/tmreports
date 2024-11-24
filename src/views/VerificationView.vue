<template>
  <div class="h-100">
    <Message severity="success" :closable="false" v-if="message">{{
      message
    }}</Message>
    <Card
      class="text-center w-100 h-100 d-grid align-items-center"
      style="width: 25rem; overflow: hidden"
    >
      <template #title>
        <div class="d-flex flex-column">
          <i
            class="pi pi-envelope"
            style="color: slateblue; font-size: 2.5rem"
          ></i>
          <span> Check your email </span>
        </div>
      </template>
      <template #subtitle>Tekmetric extension</template>
      <template #content>
        <p class="m-0">
          A verification email has been sent to your email address. Please check
          your inbox and click on the verification link to complete the
          verification process.
        </p>
      </template>
      <template #footer>
        <div class="flex gap-3 mt-1">
          <Button
            label="Sign out"
            @click="handleSignOut"
            size="small"
            severity="secondary"
            outlined
            class="w-full"
          />
          <Button
            label="Resend"
            :loading="buttonLoading"
            @click="resendEmail"
            :disabled="buttonDisabled"
            size="small"
            class="w-full"
          />
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Card from "primevue/card";
import Message from "primevue/message";
import Button from "primevue/button";
import { getAuth, sendEmailVerification } from "firebase/auth";
import { useLogout } from "@/composables/useLogout";
const buttonLoading = ref(false);
const buttonDisabled = ref(false);
const message = ref("");

function resendEmail() {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    buttonLoading.value = true;

    sendEmailVerification(user).then(() => {
      // Email verification sent!
      message.value = "Email verification resent!";

      buttonLoading.value = false;
      buttonDisabled.value = true;
    });
  }
}

const handleSignOut = useLogout();
</script>

<style lang="scss" scoped></style>
