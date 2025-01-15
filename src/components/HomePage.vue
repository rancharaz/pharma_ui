<template>
  <div class="max-w-4xl mx-auto p-6">
    <!-- search & add medicine -->
    <div class="bg-white shadow-md rounded-lg p-6 flex items-center space-x-4">
      <input v-model="currentInput" @focus="showMedicinesList = true" @blur="handleBlur"
        class="w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="text" placeholder="Search or add a medicine..." />
      <button @click="addMedicineFromInput"
        class="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-400 focus:outline-none transition duration-300 ease-in-out">
        Add
      </button>
    </div>

    <!-- show med on hover -->
    <div v-if="showMedicinesList" class="mt-6 bg-white shadow-md rounded-lg p-6">
      <h3 class="text-xl font-semibold mb-4 text-black">Medicines</h3>
      <ul class="space-y-4">
        <li v-for="medicine in filteredMedicines" :key="medicine.id"
          class="relative flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-300 ease-in-out">

          <span class="text-lg font-medium text-black cursor-pointer" @mouseover="hoverMedicine = medicine"
            @mouseleave="hoverMedicine = null">
            {{ medicine.name }}
          </span>

          <!-- add one med -->
          <button @click="selectMedicine(medicine)"
            class="text-yellow-500 hover:text-yellow-400 focus:outline-none transition duration-300 ease-in-out ml-4">
            +
          </button>

          <!-- dropdown on hover -->
          <div v-if="hoverMedicine === medicine"
            class="absolute left-0 mt-2 p-2 w-full bg-white shadow-lg rounded-lg z-10">
            <p class="text-black">{{ medicine.name }}</p>
          </div>
        </li>
      </ul>
    </div>

    <!-- section for med choosen -->
    <div v-if="chosenMedicines.length" class="mt-8 bg-white shadow-md rounded-lg p-6">
      <h2 class="text-xl font-semibold mb-4 text-black">Chosen Medicines</h2>

      <!-- Wrapping the list with the draggable component -->
      <draggable v-model="chosenMedicines" item-key="id" class="space-y-4">
        <template #item="{ element }">
          <li :key="element.id"
            class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-300 ease-in-out">

            <!-- edit and delete btn -->
            <div class="flex items-center">
              <span v-if="!element.isEditing" class="text-lg font-medium text-black cursor-pointer">
                {{ element.name }}
              </span>

              <input v-if="element.isEditing" v-model="element.name" class="p-2 border rounded-md" />

              <button @click="toggleEdit(element)"
                class="ml-4 text-blue-500 hover:text-blue-400 focus:outline-none transition duration-300 ease-in-out">
                {{ element.isEditing ? 'Save' : 'Edit' }}
              </button>

              <button @click="deleteMedicine(element.id)"
                class="ml-4 text-red-500 hover:text-red-400 focus:outline-none transition duration-300 ease-in-out">
                Delete
              </button>
            </div>
          </li>
        </template>
      </draggable>
    </div>

    <div v-else class="mt-8 text-center text-gray-500">
      <p>No medicines chosen yet!</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import draggable from 'vuedraggable'
import { usePharmacyMedsStore } from '../stores/pharmacyMed'


const store = usePharmacyMedsStore()
const currentInput = ref('')
const hoverMedicine = ref(null)
const showMedicinesList = ref(false)

onMounted(() => {
  store.fetchMedicines()
})

const filteredMedicines = computed(() => {
  return store.existingMedicines.filter(medicine =>
    medicine.name.toLowerCase().includes(currentInput.value.toLowerCase())
  )
})

const selectMedicine = (medicine) => {
  store.addMedicineToChosen(medicine)
}

const toggleFavorite = (medicine) => {
  if (!store.existingMedicines.some(item => item.id === medicine.id)) {
    store.addMedicineToExisting(medicine.name)
  }
}

const getStarClass = (medicine) => {
  return store.existingMedicines.some(item => item.id === medicine.id)
    ? 'fa fa-star'
    : 'fa fa-star-o'
}

const addMedicineFromInput = () => {
  if (currentInput.value.trim()) {
    store.addMedicineToExisting(currentInput.value)
    currentInput.value = ''
  }
}

const handleBlur = () => {
  setTimeout(() => {
    showMedicinesList.value = false
  }, 200)
}

const toggleEdit = (medicine) => {
  medicine.isEditing = !medicine.isEditing
  if (!medicine.isEditing) {
    store.updateMedicineName(medicine)
  }
}

const deleteMedicine = (id) => {
  store.removeMedicineFromChosenById(id)
}

const chosenMedicines = computed(() => store.chosenMedicines)
</script>

<style scoped>
.fa {
  font-size: 20px;
}
</style>
