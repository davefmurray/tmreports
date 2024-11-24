<template>
  <FormItem
    @submit="submit"
    :buttonLoading="buttonLoading"
    :formError="errorMessage"
    title="Sign Up For Tekmetric"
    subTitle="create new account"
    buttonTitle="sign up"
    class="h-100"
  >
    <InputItem label="E-mail" :error="errors.email">
      <InputText id="email" v-model="email" />
    </InputItem>
    <InputItem label="Password" :error="errors.confirmation">
      <Password id="password" v-model="password" toggleMask :feedback="false" />
    </InputItem>
    <InputItem label="Password Confirmation" :error="errors.email">
      <Password
        id="password"
        v-model="confirmation"
        toggleMask
        :feedback="false"
      />
    </InputItem>
    <span class="text-muted small"
      >already have an account
      <router-link to="sign-in" class="text-decoration-none"
        >sign in</router-link
      >
      ?</span
    >
  </FormItem>
</template>

<script setup lang="ts">
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import InputItem from "@/components/auth/InputItem.vue";
import FormItem from "@/components/auth/FormItem.vue";

import { ref } from "vue";
import { auth } from "@/utils/firebase-init";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { useForm } from "vee-validate";
import * as yup from "yup";
import router from "@/utils/router";

const { values, errors, defineField, handleSubmit } = useForm({
  validationSchema: yup.object({
    email: yup.string().email().required(),
    password: yup.string().min(8).required(),
    confirmation: yup
      .string()
      .required()
      .oneOf([yup.ref("password")], "Passwords must match"),
  }),
});

const [email] = defineField("email", {
  validateOnModelUpdate: false,
});
const [password] = defineField("password", {
  validateOnModelUpdate: false,
});
const [confirmation] = defineField("confirmation", {
  validateOnModelUpdate: false,
});

const buttonLoading = ref(false);
const errorMessage = ref("");

const submit = handleSubmit((values) => {
  buttonLoading.value = true;
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      // Signed up
      sendEmailVerification(userCredential.user).then(() => {
        // Email verification sent!
        console.log("Email verification sent!");

        buttonLoading.value = false;
        router.push("/");
        // ...
      });

      // ...
    })
    .catch((error) => {
      errorMessage.value = error.code;
      buttonLoading.value = false;
      // ..
    });
});
</script>
