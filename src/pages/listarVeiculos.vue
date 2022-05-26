<template>
  <q-page class="flex justify-center" padding>
    <q-card style="width: 80%" class="column">
      <q-card-section>
        <p class="text-h5 row justify-center">
          Tabela de carros disponiveis da {{ marca }}
        </p>
      </q-card-section>
      <q-separator />
      <q-table :rows="rows" :columns="columns" :filter="filter" row-key="name">
        <template v-slot:top-right>
          <q-input
            borderless
            dense
            debounce="300"
            v-model="filter"
            placeholder="Search"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
        <template #body-cell-ipva="props">
          <q-td :props="props">
            <q-icon
              v-if="props.row.ipva == 'Não Pago'"
              color="red"
              size="md"
              name="close"
            />
            <q-icon
              v-if="props.row.ipva == 'Pago'"
              color="green"
              size="md"
              name="done"
            />
          </q-td>
        </template>
        <template #body-cell-alterar="props">
          <q-td :props="props">
            <q-btn
              :disable="nivelAcc != 'Admin'"
              round
              color="primary"
              icon="info"
              @click="radio(props.row.id)"
            />
          </q-td>
        </template>
        <template #body-cell-vender="props">
          <q-td :props="props">
            <q-btn
              round
              color="red"
              icon="sell"
              @click="confirm(props.row.id, props.row.nome)"
            />
          </q-td>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script>
const columns = [
  {
    name: "nome",

    label: "Nome",
    align: "left",
    field: "nome",
  },
  {
    name: "ano",
    align: "left",
    label: "Ano",
    field: "ano",
  },
  {
    name: "combustivel",
    label: "Combustivel",
    align: "left",
    field: "combustivel",
  },
  {
    name: "ipva",
    label: "IPVA",
    align: "left",
    field: "ipva",
    sortable: true,
  },
  { name: "km", label: "Kilometragem", field: "km", align: "left" },
  { name: "preço", label: "Preço", field: "preço", align: "left" },
  { name: "versao", label: "Versão", field: "versao", align: "left" },
  { name: "alterar", label: "Alterar", field: "alterar", align: "left" },
  { name: "vender", label: "Vender", field: "vender", align: "left" },
];

import { defineComponent, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useQuasar } from "quasar";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../utils/firebase";
export default defineComponent({
  setup() {
    const route = useRoute();
    const marca = route.params.id;
    const rows = ref([]);
    const $q = useQuasar();
    const nivelAcc = ref("Padrão");

    const getMarca = async () => {
      setInterval(() => {
        nivelAcc.value = sessionStorage.nivelAcc;
      }, 1500);
      rows.value = [];
      const q = query(collection(db, "veiculos"), where("marca", "==", marca));

      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots

        let data = doc.data();
        let id = doc.id;

        data.id = id;

        rows.value.push(data);
      });
    };

    const vender = async (id) => {
      try {
        await deleteDoc(doc(db, "veiculos", id));

        $q.notify({
          message: "Veiculo vendido com sucesso",
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
        getMarca();
      } catch (error) {
        $q.notify({
          message: "Erro a o vender veiculo",
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
      }
    };

    function confirm(value, nome) {
      $q.dialog({
        title: `Deseja mesmo vender o ${nome}?`,
        message: "Se sim, por favor confirme a venda",
        cancel: true,
        persistent: true,
      })
        .onOk(() => {
          vender(value);
        })
        .onOk(() => {
          vender(value);
        })
        .onCancel(() => {
          // console.log('>>>> Cancel')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
    }

    function radio(value) {
      $q.dialog({
        title: "Opções de dados",
        message: "Escolha qual dado deseja alterar:",

        options: {
          type: "radio",
          model: "ano",
          // inline: true
          items: [
            { label: "Ano", value: "ano", color: "secondary" },

            { label: "IPVA", value: "ipva" },
            { label: "Kilometragem", value: "kilometragem" },
            { label: "Preço", value: "preço" },
          ],
        },

        cancel: true,
        persistent: true,
      })
        .onOk((data) => {
          prompt(data, value);
        })
        .onCancel(() => {
          // console.log('>>>> Cancel')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
    }

    async function prompt(escolha, value) {
      $q.dialog({
        title: "Digite o dado que você quer",
        message:
          "Confirme quando terminado, se for ipva pode ser (Pago) ou (Não pago)",
        prompt: {
          model: "",
          type: "text", // optional
        },
        cancel: true,
        persistent: true,
      })
        .onOk(async (data) => {
          if (escolha == "ano") {
            if (data.length == 4 && Number(data)) {
              const Ref = doc(db, "veiculos", value);

              await updateDoc(Ref, {
                ano: data,
              });
              getMarca();
            } else {
              $q.notify({
                message: "Ano invalido",
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
            }
          } else if (escolha == "ipva") {
            if (data == "Pago" || data == "Não pago") {
              const Ref = doc(db, "veiculos", value);

              await updateDoc(Ref, {
                ipva: data,
              });
              getMarca();
            } else {
              $q.notify({
                message: "Escolha de IPVA incorreto",
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
            }
          } else if (escolha == "kilometragem") {
            if (data.length <= 6 && Number(data) && Number(data) <= 200000) {
              const Ref = doc(db, "veiculos", value);

              await updateDoc(Ref, {
                km: data,
              });
              getMarca();
            } else {
              $q.notify({
                message: "Escolha de kilometragem incorreta",
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
            }
          } else if (escolha == "preço") {
            if (data.length <= 6 && Number(data)) {
              const Ref = doc(db, "veiculos", value);

              await updateDoc(Ref, {
                preço: data,
              });
              getMarca();
            } else {
              $q.notify({
                message: "Escolha de preço incorreta",
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
            }
          }
        })
        .onCancel(() => {
          // console.log('>>>> Cancel')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
    }
    onMounted(getMarca);
    return {
      getMarca,
      marca,
      columns,
      rows,
      vender,
      confirm,
      radio,
      prompt,
      nivelAcc,
      filter: ref(""),
    };
  },
});
</script>

