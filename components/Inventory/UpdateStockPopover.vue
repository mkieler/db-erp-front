<script setup>
    const addStockQty = ref(0);
    const addingStockOpen = ref(false);
    const busy = ref(false);
    const { inventoryService } = useServices();

    const emit = defineEmits(['productChanged']);

    const props = defineProps({
        productId: {
            type: Number,
            required: true
        },
        label: {
            type: String,
            default: ''
        }
    });

    async function addStock() {
        busy.value = true;
        if (addStockQty.value > 0) {
            await inventoryService.addStock(
                props.productId,
                addStockQty.value
            );
        }
        addingStockOpen.value = false; 
        //waiting so it dosen't change to zero before the popover closes
        setTimeout(() => addStockQty.value = 0, 300);
        emit('productChanged', addStockQty.value);
        busy.value = false; 
    }
</script>

<template>
    <UPopover
            v-model:open="addingStockOpen"
            @update:open="addingStockOpen = $event"
            >
             <UTooltip
                text="Tilføj vare til lager"
                :delay-duration="0"
                >
                <UButton
                    variant="ghost"
                    size="sm"
                    icon="i-lucide-package-plus"
                >
                    {{ props.label }}
                </UButton>
            </UTooltip>
            <template #content>
                <UButtonGroup>
                    <UInputNumber
                        v-model="addStockQty"
                        class="w-24"
                        :min="0"
                    />

                    <UButton
                        color="primary"
                        size="sm"
                        @click="addStock"
                        >
                        Tilføj
                    </UButton>
                </UButtonGroup>
            </template>
        </UPopover>
</template>