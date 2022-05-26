<template>
  <q-page class="flex justify-center" padding>
    <q-card style="width: 80%; height: 80%" class="my-card">
      <q-card-section>
        <p class="text-h5 row justify-center">Cadastrar Veiculo</p>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-select
          v-model="veiculoData.marca"
          :options="options1"
          label="Marca do Veiculo"
          @blur="getCarrosNomes"
          :rules="[(val) => !!val || 'Campo Obrigatorio']"
        />
        <q-select
          v-model="veiculoData.nome"
          :options="options3"
          label="Nome do Veiculo"
          :rules="[(val) => !!val || 'Campo Obrigatorio']"
        />
        <q-select
          v-model="veiculoData.ipva"
          :options="options4"
          label="IPVA"
          :rules="[(val) => !!val || 'Campo Obrigatorio']"
        />
        <q-input
          v-model="veiculoData.versao"
          label="Versão do veiculo"
          :rules="[(val) => !!val || 'Campo Obrigatorio']"
        />
        <q-input
          v-model="veiculoData.preco"
          maxlength="7"
          onkeypress="return event.charCode >= 48 && event.charCode <= 57"
          label="Preço do Veiculo"
          :rules="[(val) => !!val || 'Campo Obrigatorio']"
        />
        <q-input
          v-model="veiculoData.ano"
          maxlength="4"
          onkeypress="return event.charCode >= 48 && event.charCode <= 57"
          label="Ano do Veiculo"
          :rules="[(val) => !!val || 'Campo Obrigatorio']"
        />
        <q-input
          v-model="veiculoData.km"
          type="number"
          :rules="[(val) => !!val || 'Campo Obrigatorio']"
          label="Kilometragem"
        />
        <q-select
          v-model="veiculoData.combustivel"
          :options="options2"
          label="Combustivel"
          :rules="[(val) => !!val || 'Campo Obrigatorio']"
        />
        <q-btn
          style="width: 100%"
          color="deep-orange"
          label="Cadastrar veiculo"
          @click.prevent="validacao"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useQuasar } from "quasar";
import { collection, addDoc, getDoc, doc } from "firebase/firestore";
import { db } from "../utils/firebase";

export default defineComponent({
  setup() {
    const $q = useQuasar();
    const options3 = ref([]);
    const veiculoData = ref({
      marca: "",
      nome: "",
      versao: "",
      ano: "",
      km: "",
      combustivel: "",
      preco: "",
      ipva: "",
    });

    const adicionar = async () => {
      try {
        await addDoc(collection(db, "veiculos"), {
          marca: veiculoData.value.marca,
          nome: veiculoData.value.nome,
          versao: veiculoData.value.versao,
          preço: veiculoData.value.preco,
          ano: veiculoData.value.ano,
          km: veiculoData.value.km,
          combustivel: veiculoData.value.combustivel,
          ipva: veiculoData.value.ipva,
        });

        $q.notify({
          message: "Veiculo cadastrado com Sucesso",
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
          message: "Erro a o cadastrar veiculo",
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

    const getCarrosNomes = async () => {
      const docRef = doc(db, "marcas", `${veiculoData.value.marca}`);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        options3.value = docSnap.data().carros;
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    };

    const reset = async () => {
      (veiculoData.value.marca = ""),
        (veiculoData.value.nome = ""),
        (veiculoData.value.ano = ""),
        (veiculoData.value.km = "");
      veiculoData.value.preco = "";
      veiculoData.value.combustivel = "";
      veiculoData.value.versao = "";
      veiculoData.value.ipva = "";
    };

    const validacao = async () => {
      if (
        (veiculoData.value.marca =
          "" == "" ||
          veiculoData.value.nome == "" ||
          veiculoData.value.ano == "" ||
          veiculoData.value.km == "" ||
          veiculoData.value.preco == "" ||
          veiculoData.value.combustivel == "" ||
          veiculoData.value.versao == "" ||
          veiculoData.value.ipva == "")
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
      veiculoData,
      adicionar,
      reset,
      getCarrosNomes,
      options3,
      validacao,
      options1: [
        "Chevrolet",
        "Hyundai",
        "Ford",
        "Volkswagen",
        "Renault",
        "Toyota",
      ],
      options2: ["Disel", "Gasolina", "Premium", "Flex", "Álcool"],
      options4: ["Pago", "Não Pago"],
    };
  },
});
</script>