<template>
  <q-page class="flex justify-center" padding>
    <q-card style="width: 80%; height: 80%" class="my-card">
      <q-card-section>
        <p class="text-h5 row justify-center">Cadastrar Funcionario</p>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-input
          v-model="funcionarioData.nome"
          label="Nome"
          :rules="[(val) => !!val || 'Campo Obrigatorio']"
        />
        <q-input
          v-model="funcionarioData.idade"
          maxlength="2"
          onkeypress="return event.charCode >= 48 && event.charCode <= 57"
          label="Idade do funcionario"
          :rules="[(val) => !!val || 'Campo Obrigatorio']"
        />
        <q-input
          v-model="funcionarioData.email"
          label="Email do funcionario"
          :rules="[(val) => !!val || 'Campo Obrigatorio']"
        />
        <q-select
          v-model="funcionarioData.função"
          :options="options1"
          label="Função"
          :rules="[(val) => !!val || 'Campo Obrigatorio']"
        />

        <q-btn
          style="width: 100%"
          color="secondary"
          label="Cadastrar Funcionario"
          @click.prevent="validacao"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useQuasar } from "quasar";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../utils/firebase";

export default defineComponent({
  setup() {
    const $q = useQuasar();

    const funcionarioData = ref({
      nome: "",
      idade: "",
      função: "",
      email: "",
    });

    const adicionar = async () => {
      try {
        await addDoc(collection(db, "funcionarios"), {
          nome: funcionarioData.value.nome,
          idade: funcionarioData.value.idade,
          função: funcionarioData.value.função,
          email: funcionarioData.value.email,
          entrada: new Date()
            .toISOString()
            .slice(0, 19)
            .replace("T", " ")
            .split(" ")[0]
            .split("-")
            .reverse()
            .join("/"),
        });

        $q.notify({
          message: "Funcionario cadastrado com Sucesso",
          color: "positive",
          actions: [
            {
              label: "Fechar",
              color: "white",
              handler: () => {
                /* ... */
              },
            },
          ],
        });
        reset();
      } catch (e) {
        $q.notify({
          message: "Erro a o cadastrar funcionario",
          color: "negative",
          actions: [
            {
              label: "Fechar",
              color: "white",
              handler: () => {
                /* ... */
              },
            },
          ],
        });
        console.error("Error adding document: ", e);
      }
    };

    const reset = async () => {
      funcionarioData.value.nome = "";
      funcionarioData.value.idade = "";
      funcionarioData.value.função = "";
      funcionarioData.value.email = "";
    };

    const validacao = async () => {
      if (
        funcionarioData.value.nome == "" ||
        funcionarioData.value.idade == "" ||
        funcionarioData.value.função == "" ||
        funcionarioData.value.email == "" ||
        funcionarioData.value.email.indexOf("@") == -1
      ) {
        $q.notify({
          message: "Preencha todos os campos",
          color: "negative",
          actions: [
            {
              label: "Fechar",
              color: "white",
              handler: () => {
                /* ... */
              },
            },
          ],
        });
        return;
      } else {
        adicionar();
      }
    };

    return {
      funcionarioData,
      adicionar,
      reset,
      validacao,
      options1: [
        "Vendedor",
        "Porteiro",
        "Segurança",
        "Atendente",
        "Contador",
        "Suporte",
      ],
    };
  },
});
</script>