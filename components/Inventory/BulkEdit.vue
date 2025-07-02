<script setup>
    import * as z from 'zod';

    const props = defineProps({
        selectedProducts: {
            type: Array,
            default: () => []
        }
    });
    const open = ref(false);
    const busy = ref(false);
    const { inventoryService } = useServices();

    const emit = defineEmits(['products:updated']);
    const state = ref({
        productIds: props.selectedProducts,
        quantity: null,
        alertThreshold: null,
        shouldAlert: '',
    });

    const schema = z.object({
        quantity: z.number()
            .int('Antal skal være et helt tal')
            .min(1, 'Antal skal være mindst 1')
            .optional(),
        shouldAlert: z.string().optional(),
        alertThreshold: z.number()
            .int('Advarselsgrænse skal være et helt tal')
            .min(1, 'Advarselsgrænse skal være mindst 1')
            .optional()
    });

    const shouldAlertOptions = [
        { label: 'Ja', value: '1' },
        { label: 'Nej', value: '0' },
        { label: 'Opdater ikke', value: '' }
    ];

    async function onSubmit() {
        busy.value = true;
        await inventoryService.bulkUpdate(state.value);
        open.value = false;
        busy.value = false;
        emit('products:updated');
    }
</script>

<template>
    <UModal
        title="Masseredigér varer"
        description="Vælg de indstillinger, du vil opdatere for de valgte vare."
        v-model:open="open"
        @update:open="open = $event"
        >
        <UButton 
            type="button" 
            variant="ghost"
            color="neutral"
            icon="i-lucide-edit"
            class="cursor-pointer p-4 rounded-none text-white hover:bg-gray-600"
            size="lg"
        >
            Redigér valgte
        </UButton>

        <template #body>
                <UForm :schema="schema" :state="state" @submit.prevent="onSubmit" class="grid gap-4" >
                    <UFormField label="Antal på lager" name="quantity" help="Sæt til 0 hvis ikke lagerantal skal ændres.">
                        <UInputNumber 
                            v-model="state.quantity" 
                            class="w-[10rem]"
                            
                            />
                    </UFormField>
                    <UFormField label="Skal der aktiveres notifikationer ved for lavt lagerantal?" name="shouldAlert">
                        <URadioGroup v-model="state.shouldAlert" color="primary" orientation="horizontal" default-value="0" :items="shouldAlertOptions" />
                    </UFormField>
                    <UFormField 
                        label="Advarselsgrænse" 
                        name="alertThreshold" 
                        v-if="state.shouldAlert == '1'"
                        help="sæt til 0 hvis ikke lagerantal skal ændres."
                        >
                        <UInputNumber 
                            v-model="state.alertThreshold" 
                            class="w-[10rem]"
                            :min="0"
                            />
                    </UFormField>
                </UForm>
        </template>

        <template #footer>
            <div class="flex items-center justify-end w-full gap-2">
                <UButton 
                    type="button" 
                    variant="ghost" 
                    color="neutral" 
                    class="cursor-pointer"
                    @click="open = false"
                    :disabled="busy"
                >
                    Annuller
                </UButton>
                <UButton 
                    type="button" 
                    color="primary" 
                    icon="i-lucide-save" 
                    size="lg" 
                    class="cursor-pointer"
                    @click="onSubmit"
                    :loading="busy"
                >
                    Gem ændringer
                </UButton>
            </div>
        </template>
    </UModal>
</template>