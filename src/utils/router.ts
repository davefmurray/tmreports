import { createMemoryHistory, createRouter } from "vue-router";

import HomeView from "@/views/HomeView.vue";
import SignInView from "@/views/SignInView.vue";
import SignUpView from "@/views/SignUpView.vue";
import VerificationView from "@/views/VerificationView.vue";

const routes = [
  { path: "/", component: HomeView },
  { path: "/sign-in", component: SignInView },
  { path: "/sign-up", component: SignUpView },
  { path: "/verify", component: VerificationView },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

export default router;
