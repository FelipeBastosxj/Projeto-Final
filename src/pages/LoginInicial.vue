<template>
  <main class="base">
    <div class="login">
      <p class="text-h2 tite">Bem-Vindo</p>
      <p class="text-h4 sub">Faça login para ter acesso a o sistema</p>
      <img src="../assets/car_23773.png" alt="" />
      <q-btn
        class="margin"
        color="red"
        icon="login"
        icon-right="send"
        label="Efetuar o login via google"
        @click="login"
      />
    </div>
  </main>
</template>



<script>
import {
  autenticacao,
  signInWithRedirect,
  provider,
  GoogleAuthProvider,
  getRedirectResult,
} from "../utils/firebase";

import { defineComponent, onMounted } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "LoginInicial",
  setup() {
    const router = useRouter();

    const login = async () => {
      signInWithRedirect(autenticacao, provider);
    };

    const getStatus = async () => {
      getRedirectResult(autenticacao)
        .then((result) => {
          if (result != null) {
            router.push({ name: "principal" });
          }

          // This gives you a Google Access Token. You can use it to access Google APIs.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          window.sessionStorage.credential = JSON.stringify(credential);
          window.sessionStorage.nivelAcc = "Padrão";
          const token = credential.accessToken;

          // The signed-in user info.
          const user = result.user;
          window.sessionStorage.user = JSON.stringify(user);
        })
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
          // ...
        });
    };

    onMounted(getStatus);

    return {
      login,
      getStatus,
    };
  },
});
</script>

<style scoped>
.base {
  display: flex;
  background-image: url("../assets/pexels-pixabay-531880.jpg");
  height: 100vh;
  justify-content: center;
  align-items: center;
  background-position: center;
  background-size: cover;
}

.login {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 75%;
  width: 40%;
  background-color: #00b3ff69;
  border-radius: 8px;
}

img {
  margin-top: 15px;
}

.margin {
  margin-top: 50px;
}

.sub,
.tite {
  text-align: center;
}
</style>