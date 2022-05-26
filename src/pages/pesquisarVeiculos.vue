<template>
  <q-page class="flex justify-center" padding>
    <q-card style="width: 80%" class="column">
      <q-card-section>
        <p class="text-h5 row justify-center">
          Selecione a marca do veiculos que deseja pesquisar
        </p>
      </q-card-section>
      <q-separator />

      <div style="width: 100%" class="row q-gutter-md justify-center">
        <q-card-section
          v-for="(marca, index) in marcas"
          :key="index"
          class="col-5"
        >
          <q-card class="my-card">
            <q-img v-if="marca.nome == 'Hyundai'" src="../assets/Hyundai.png"
              ><div class="absolute-bottom text-h6">{{ marca.nome }}</div>
            </q-img>
            <q-img
              v-if="marca.nome == 'Chevrolet'"
              src="../assets/Chevrolet.png"
              ><div class="absolute-bottom text-h6">{{ marca.nome }}</div>
            </q-img>
            <q-img v-if="marca.nome == 'Ford'" src="../assets/Ford.png"
              ><div class="absolute-bottom text-h6">{{ marca.nome }}</div>
            </q-img>
            <q-img v-if="marca.nome == 'Renault'" src="../assets/Renault.png"
              ><div class="absolute-bottom text-h6">{{ marca.nome }}</div>
            </q-img>
            <q-img v-if="marca.nome == 'Toyota'" src="../assets/Toyota.png"
              ><div class="absolute-bottom text-h6">{{ marca.nome }}</div>
            </q-img>
            <q-img
              v-if="marca.nome == 'Volkswagen'"
              src="../assets/Volkswagen.png"
            >
              <div class="absolute-bottom text-h6">{{ marca.nome }}</div>
            </q-img>

            <q-card-section
              style="height: 47%"
              class="end-section column justify-between"
            >
              <p class="lorem">{{ marca.lorem }}</p>

              <q-btn
                color="primary"
                label="Verificar veiculos disponiveis"
                @click.prevent="listarVeiculos(marca.nome)"
              />
            </q-card-section>
          </q-card>
        </q-card-section>
      </div>
    </q-card>
  </q-page>
</template>

<script>
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "../utils/firebase";
import { useRouter } from "vue-router";
import { defineComponent, onMounted, ref } from "vue";
export default defineComponent({
  setup() {
    const marcas = ref([]);
    const router = useRouter();

    const listarMarcas = async () => {
      const marcasRef = query(collection(db, "marcas"));

      const marcasDocs = await getDocs(marcasRef);

      marcasDocs.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots

        marcas.value.push({ nome: doc.id, lorem: doc.data().lorem });
      });
    };

    const listarVeiculos = async (marca) => {
      router.push({ name: "listarVeiculos", params: { id: marca } });
    };

    onMounted(listarMarcas);

    return {
      listarMarcas,
      listarVeiculos,
      marcas,
    };
  },
});
</script>

<style scoped>
.my-card {
  width: 100%;
  max-width: 350px;
  height: 500px;
}

@media (max-width: 1446px) {
  .lorem {
    display: none !important;
  }
  .end-section {
    height: 0% !important;
  }

  .my-card {
    height: auto;
  }
}
</style>