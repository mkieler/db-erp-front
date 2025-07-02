<script setup>
const props = defineProps({
    selectedProducts: {
        type: Array,
        default: () => []
    }
});

const busy = ref(false);
const { inventoryService } = useServices();
const productCount = computed(() => props.selectedProducts.length);

const isOpen = ref(false);

const emit = defineEmits(['products:deleted']);

async function deleteProducts() {
    busy.value = true;
    await inventoryService.bulkDelete(props.selectedProducts);
    isOpen.value = false;
    busy.value = false;
    emit('products:deleted', props.selectedProducts);
}

function close() {
    isOpen.value = false;
}
</script>


<template>
    <UModal
        title="Slet valgte produkter"
        v-model:open="isOpen"
        @update:open="isOpen = $event"
    >
        <UButton 
            type="button" 
            variant="ghost" 
            color="error" 
            icon="i-lucide-trash-2" 
            class="cursor-pointer p-4 rounded-none border-r border-l border-gray-600"
            size="lg"
            >
            Slet valgte
        </UButton>
        
        <template #body>
            <p class="mb-4">Er du sikker på, at du vil slette {{ productCount }} produkter? Denne handling kan ikke fortrydes.</p>
        </template>

        <template #footer>
            <div class="flex items-center justify-end w-full gap-2">
                <UButton 
                    type="button" 
                    variant="ghost" 
                    color="neutral" 
                    class="cursor-pointer"
                    @click="close"
                    :disabled="busy"
                >
                    Annuller
                </UButton>
                <UButton 
                    type="button" 
                    color="error" 
                    icon="i-lucide-trash-2" 
                    size="lg" 
                    class="cursor-pointer"
                    @click="deleteProducts"
                    :loading="busy"
                >
                    Slet brugere
                </UButton>
            </div>
        </template>
    </UModal>
</template>