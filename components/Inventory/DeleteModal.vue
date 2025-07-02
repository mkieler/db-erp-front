<script setup>
    const open = ref(false);
    const { inventoryService } = useServices();
    const buisy = ref(false);

    const props = defineProps({
        productId: {
            type: Number,
            default: null
        },
        disabled: {
            type: Boolean,
            default: false
        }
    });
    const emit = defineEmits(['deleted']);

    const deleteProduct = async () => {
        buisy.value = true;
        const success = await inventoryService.remove(props.productId);
        open.value = false;
        if(success){
            emit('deleted');
        }
        buisy.value = false;
    };

</script>

<template>
    <UModal v-model:open="open" title="Second modal" :ui="{ footer: 'justify-end' }" @update:open="open = $event">
        <UTooltip
            text="Slet produkt"
            :delay-duration="0"
            >
            <UButton
                variant="ghost"
                color="error"
                size="sm"
                icon="i-lucide-trash-2"
            />
        </UTooltip>
        

        <template #title>
            <p class="font-normal">Er du sikker på, at du vil slette dette produkt?</p>
            <p class="text-sm text-gray-500 font-normal">Denne handling kan ikke fortrydes.</p>
        </template>

        <template #body>
            <div class="flex items-center justify-end gap-2">
                <UButton :disabled="buisy" type="button" variant="ghost" color="neutral" class="cursor-pointer" @click="open = false">
                    Annuller
                </UButton>
                <UButton :loading="buisy" type="button" color="error" icon="i-lucide-trash-2" size="lg" class="cursor-pointer" @click="deleteProduct">
                    Slet bruger
                </UButton>
            </div>
        </template>
    </UModal>
</template>