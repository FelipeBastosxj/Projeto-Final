<template>
  <q-page class="flex justify-center" padding>
    <q-card style="width: 80%" class="column">
      <q-card-section>
        <p class="text-h5 row justify-center">
          Funcionarios cadastrados da empresa
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

        <template #body-cell-excluir="props">
          <q-td :props="props">
            <q-btn
              :disable="nivelAcc != 'Admin'"
              round
              color="red"
              icon="delete"
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
    name: "idade",
    align: "left",
    label: "Idade",
    field: "idade",
  },
  {
    name: "função",
    label: "Função",
    align: "left",
    field: "função",
  },
  {
    name: "entrada",
    label: "Entrada",
    align: "left",
    field: "entrada",
    sortable: true,
  },
  { name: "email", label: "Email", field: "email", align: "left" },
  { name: "excluir", label: "Excluir", field: "excluir", align: "left" },
];

import { defineComponent, onMounted, ref } from "vue";

import { useQuasar } from "quasar";
import { collection, query, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../utils/firebase";
export default defineComponent({
  setup() {
    const nivelAcc = ref("Padrão");
    const rows = ref([]);
    const $q = useQuasar();

    const getFuncionarios = async () => {
      setInterval(() => {
        nivelAcc.value = sessionStorage.nivelAcc;
      }, 1500);
      const q = query(collection(db, "funcionarios"));

      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots

        let data = doc.data();

        let id = doc.id;

        data.id = id;

        rows.value.push(data);
      });
    };

    const excluirFuncionario = async () => {
      try {
        await deleteDoc(doc(db, "veiculos", id));
        $q.notify({
          message: "Funcionario excluido com sucesso",
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
      } catch (error) {
        $q.notify({
          message: "Erro a o excluir funcionario",
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
        title: `Deseja mesmo excluir o funcionario ${nome}?`,
        message: "Se sim, por favor confirme",
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

    onMounted(getFuncionarios);
    return {
      getFuncionarios,
      filter: ref(""),
      columns,
      rows,
      excluirFuncionario,
      confirm,
      nivelAcc,
    };
  },
});
</script>

