<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> {{ userData.displayName }} </q-toolbar-title>

        <div class="container-left">
          <img
            class="profile"
            :src="userData.photoURL"
            alt=""
            referrerpolicy="no-referrer"
          />
          <q-icon name="logout" size="md" @click="logout" />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>
          Seu nivel de acesso:
          {{ nivelAcc }}
        </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import EssentialLink from "components/EssentialLink.vue";
import { collection, addDoc, getDoc, doc } from "firebase/firestore";
import { db } from "../utils/firebase";

const linksList = [
  {
    title: "Inicio",
    caption: "Apresentação do sistema",
    icon: "home",
    link: "principal",
  },
  {
    title: "Cadastrar Veiculo",
    caption: "Insira aqui o veiculo que deseja adicionar",
    icon: "directions_car",
    link: "cadastrar",
  },
  {
    title: "Veiculos Disponiveis",
    caption: "Verificar quais veiculos estão disponiveis pela marca",
    icon: "receipt_long",
    link: "pesquisar",
  },
  {
    title: "Cadastrar Funcionario",
    caption:
      "Adicione os dados de funcionarios da sua empresa para melhor gerenciamento",
    icon: "person_add",
    link: "cadastrarFuncionarios",
  },
  {
    title: "Gerenciar Funcionarios",
    caption: "Veja aqui os funcionarios cadastrados e seus dados",
    icon: "group",
    link: "listarFuncionarios",
  },
];

export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
  },

  setup() {
    const leftDrawerOpen = ref(false);
    const userData = ref("");
    const router = useRouter();
    const nivelAcc = ref("");

    const insertData = async () => {
      const docRef = doc(db, "adm", "pessoasADM");
      const docSnap = await getDoc(docRef);

      let adm = docSnap.data().ID;

      userData.value = JSON.parse(sessionStorage.user);
      let admPermission = adm.find((e) => {
        return e == userData.value.uid;
      });

      if (admPermission != undefined) {
        sessionStorage.nivelAcc = "Admin";
      }
      nivelAcc.value = sessionStorage.nivelAcc;
    };

    const logout = async () => {
      window.sessionStorage.clear();
      router.push({ name: "login" });
    };

    onMounted(insertData);
    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      userData,
      logout,
      nivelAcc,
    };
  },
});
</script>

<style scoped>
.profile {
  width: 30%;
  height: 30%;
  border-radius: 50%;
}

.container-left {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.container-left .q-icon {
  cursor: pointer;
}
</style>