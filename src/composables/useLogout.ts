import router from "@/utils/router";
import { getAuth, signOut } from "firebase/auth";

export function useLogout() {
  function handleSignOut() {
    signOut(getAuth())
      .then(() => router.push("sign-in"))
      .catch((error) => console.log(error));
  }

  return handleSignOut;
}
