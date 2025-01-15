import { defineStore } from 'pinia'
import axios from 'axios'

interface Medicine {
  id: number
  name: string
}

export const usePharmacyMedsStore = defineStore('pharmacyMeds', {
  state: () => ({
    existingMedicines: [] as Medicine[],
    chosenMedicines: [] as Medicine[],
  }),
  actions: {
    /* fetch med on json server */
    async fetchMedicines() {
      try {
        const response = await axios.get<Medicine[]>('http://localhost:5000/existingMedicines')
        this.existingMedicines = response.data
      } catch (error) {
        console.error('Error fetching medicines:', error)
      }
    },

    /* add to chosenmed */
    addMedicineToChosen(medicine: Medicine) {
      if (!this.chosenMedicines.some((item) => item.id === medicine.id)) {
        this.chosenMedicines.push(medicine)
      }
    },

    /* add to json server */
    async addMedicineToExisting(medicineName: string) {
      try {
        const newMedicine: Medicine = { id: Date.now(), name: medicineName }
        const response = await axios.post<Medicine>('http://localhost:5000/existingMedicines', newMedicine)
        this.existingMedicines.push(response.data)
      } catch (error) {
        console.error('Error adding medicine:', error)
      }
    },

    // Update medicine name in backend and locally
    async updateMedicineName(medicine: Medicine) {
      try {
        const response = await axios.put<Medicine>(`http://localhost:5000/existingMedicines/${medicine.id}`, {
          name: medicine.name,
        })
        const index = this.existingMedicines.findIndex(item => item.id === medicine.id)
        if (index !== -1) {
          this.existingMedicines[index].name = response.data.name
        }

        // Update the chosenMedicines list if the medicine is in it
        const chosenIndex = this.chosenMedicines.findIndex(item => item.id === medicine.id)
        if (chosenIndex !== -1) {
          this.chosenMedicines[chosenIndex].name = response.data.name
        }
      } catch (error) {
        console.error('Error updating medicine:', error)
      }
    },

    // Remove medicine from both chosen and existing lists
    async removeMedicineFromChosen(index: number) {
      const medicineToDelete = this.chosenMedicines[index]
      try {
        await axios.delete(`http://localhost:5000/existingMedicines/${medicineToDelete.id}`)
        // Remove from local list
        this.chosenMedicines.splice(index, 1)
        // Remove from existingMedicines list too
        const existingIndex = this.existingMedicines.findIndex(item => item.id === medicineToDelete.id)
        if (existingIndex !== -1) {
          this.existingMedicines.splice(existingIndex, 1)
        }
      } catch (error) {
        console.error('Error deleting medicine:', error)
      }
    },

    // Update the order of chosenMedicines after drag
    updateChosenOrder(newOrder: Medicine[]) {
      this.chosenMedicines = newOrder
    }
  }
})
