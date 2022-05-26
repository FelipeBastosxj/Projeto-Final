<template>
  <q-item
    v-if="
      (title != 'Cadastrar Veiculo' && title != 'Cadastrar Funcionario') ||
      nivelAcc == 'Admin'
    "
    clickable
    tag="a"
    target="_blank"
    @click.prevent="routerPush(link)"
  >
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>{{ caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "EssentialLink",
  props: {
    title: {
      type: String,
      required: true,
    },

    caption: {
      type: String,
      default: "",
    },

    link: {
      type: String,
      default: "#",
    },

    icon: {
      type: String,
      default: "",
    },
    acesso: {
      type: String,
      default: "Padrão",
    },
  },

  setup() {
    const router = useRouter();
    const nivelAcc = ref("Padrão");

    const routerPush = async (link) => {
      router.push({ name: link });
    };

    const nivelAcesso = async () => {
      setInterval(() => {
        nivelAcc.value = sessionStorage.nivelAcc;
      }, 1500);
    };

    onMounted(nivelAcesso);

    return {
      routerPush,
      nivelAcesso,
      nivelAcc,
    };
  },
});
</script>
