<template>
  <div class="d-flex flex-column justify-content-center align-items-center">
    <h4>{{ title }}</h4>
    <p>{{ subTitle }}</p>
    <form>
      <Message v-if="formError" severity="error" :closable="false">{{
        formError
      }}</Message>
      <slot></slot>
      <Button
        type="submit"
        @click.prevent="submit"
        class="m-auto d-block mt-3"
        :label="buttonTitle"
        :loading="buttonLoading"
      />
    </form>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
import Button from "primevue/button";
import Message from "primevue/message";

defineProps({
  title: { type: String, required: true },
  buttonTitle: { type: String, required: true },
  subTitle: { type: String, required: true },
  buttonLoading: { type: Boolean, required: true },
  formError: { type: String, required: false },
});

const emit = defineEmits(["submit"]);

function submit() {
  emit("submit");
}
</script>

<style lang="scss" scoped></style>
