<template>
  <FormItem
    @submit="submit"
    :buttonLoading="buttonLoading"
    :formError="errorMessage"
    title="Sign In For Tekmetric"
    subTitle="Log into your account"
    buttonTitle="sign in"
    class="h-100"
  >
    <InputItem label="E-mail" :error="errors.email">
      <InputText id="email" v-model="email" />
    </InputItem>
    <InputItem label="Password" :error="errors.password">
      <Password id="password" v-model="password" toggleMask :feedback="false" />
    </InputItem>

    <span class="text-muted small"
      >create new account
      <router-link to="sign-up" class="text-decoration-none"
        >sign up</router-link
      >?</span
    >
  </FormItem>
</template>

<script setup lang="ts">
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import FormItem from "@/components/auth/FormItem.vue";
import InputItem from "@/components/auth/InputItem.vue";

import { ref } from "vue";
import { auth } from "@/utils/firebase-init";
import { signInWithEmailAndPassword } from "firebase/auth";
import router from "@/utils/router";
import { useForm } from "vee-validate";
import * as yup from "yup";

const buttonLoading = ref(false);
const errorMessage = ref("");
const { values, errors, defineField, handleSubmit } = useForm({
  validationSchema: yup.object({
    email: yup.string().email().required(),
    password: yup.string().min(8).required(),
  }),
});

const [email] = defineField("email", {
  validateOnModelUpdate: false,
});
const [password] = defineField("password", {
  validateOnModelUpdate: false,
});

const submit = handleSubmit(() => {
  buttonLoading.value = true;

  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      buttonLoading.value = false;
      console.log("signed in successfully user : ", user);

      router.push("/");
      // ...
    })
    .catch((error) => {
      errorMessage.value = error.code;
      buttonLoading.value = false;
      buttonLoading.value = false;
    });
});
</script>
