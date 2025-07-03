<script setup>
    import { UCheckbox } from '#components';
    import * as z from 'zod';
    const { inventoryService } = useServices();
    const buisy = ref(false);
    const { imageService } = useServices();
    const { userCan } = useHelpers();

    const props = defineProps({
        updating: {
            type: Object,
            default: null
        },
        editing: {
            type: Boolean,
            default: true
        }
    });

    const schema = z.object({
        productName: z.string()
            .nonempty('Produktnavn er påkrævet')
            .max(100, 'Produktnavn må højst være 100 tegn'),
        quantity: z.number()
            .int('Antal skal være et helt tal')
            .min(1, 'Antal skal være mindst 1'),
        shouldAlert: z.boolean().optional(),
        alertThreshold: z.number()
            .int('Advarselsgrænse skal være et helt tal')
            .min(1, 'Advarselsgrænse skal være mindst 1')
            .optional(),
        restockUrl: z.string()
            .regex(
            /^(?!https?:\/\/)[\w.-]+\.[a-zA-Z]{2,}(\/\S*)?$/,
            'Indtast et gyldigt URL uden http:// eller https://'
            )
            .nullish()
            .optional(),
    });

    const imageId = ref(props.updating?.image_id || null);

    const state = ref({
        productName: props.updating?.name || '',
        quantity: props.updating?.qty || 1,
        alertThreshold: props.updating?.alert_threshold || 5,
        shouldAlert: props.updating?.should_alert ?? true,
        note: props.updating?.note || '',
        restockUrl: props.updating?.restock_url || null
    });

    // Watch restockUrl and set to null if empty string
    watch(() => state.value.restockUrl, (val) => {
        if (val === '') state.value.restockUrl = null;
    });

    const emit = defineEmits(['update:open', 'update:editing', 'product:changed']);

    async function saveChanges() {
        buisy.value = true;
        const successful = await inventoryService.updateOrCreate({
            id: props.updating?.id,
            imageId: imageId.value || null,
            name: state.value.productName,
            quantity: state.value.quantity,
            alertThreshold: state.value.alertThreshold,
            shouldAlert: state.value.shouldAlert,
            note: state.value.note,
            restockUrl: state.value.restockUrl
        });
        if (successful) {
            emit('update:editing', false);
            emit('update:open', false);
            emit('product:changed', true);
        } 
        buisy.value = false;
    }

    function handleStockChange(changedStock) {
        if (changedStock > 0) {
            state.value.quantity += changedStock;
        }
        emit('product:changed', true);
    }

    defineExpose({
        saveChanges
    });
</script>
<template>
    <UForm :schema="schema" :state="state" @submit.prevent="saveChanges" class="grid gap-4">

        <SharedImageUploader :editable="editing" :url="updating?.image_url" class="my-2" @imageUpdated="imageId = $event"/>

        <UFormField label="Produktnavn" name="productName">
            <UInput 
                v-model="state.productName" 
                placeholder="Indtast produktnavn" 
                class="w-full"
                :variant="editing ? 'outline' : 'none'"
                :readonly="!editing"
                />
        </UFormField>
        <UFormField label="Antal på lager" name="quantity">
            <UInputNumber v-if="editing" class="w-[10rem]" v-model.number="state.quantity" />
            <div v-else class="px-2.5 flex items-center gap-2">
                {{ state.quantity }}
                <InventoryUpdateStockPopover
                    :productId="props.updating?.id" 
                    @productChanged="handleStockChange"
                    label="Tilføj produkter"
                    v-if="userCan('editInventory')"
                />
            </div>
        </UFormField>
        <UCheckbox 
            v-model="state.shouldAlert" 
            label="Skal der sendes en notifikation ved lavt lager antal" 
            v-if="editing"
            />
        <div v-if="!editing && state.shouldAlert">
            <p class="text-sm">
                Skal der sendes en notifikation ved lavt lager antal?
            </p>
            <UBadge class="mt-2" color="success" variant="subtle">
                Notifikation aktiveret
            </UBadge>
        </div>
        
        <UFormField v-if="state.shouldAlert" label="Advarselsgrænse" name="alertThreshold">
            <UInputNumber v-if="editing" class="w-[10rem]" v-model.number="state.alertThreshold" />
            <div v-else class="px-2.5">
                {{ state.alertThreshold }}
            </div>
        </UFormField>
        <UFormField name="restockUrl" label="Link til genbestilling" v-if="editing || state.restockUrl !== ''">
            <UInput 
                v-model="state.restockUrl"
                placeholder="Indtast link til genbestilling (valgfri)"
                class="w-full"
                :variant="editing ? 'outline' : 'none'"
                :readonly="!editing"
                :ui="{
                    base: 'pl-14.5',
                    leading: 'pointer-events-none'
                }"
                >
                    <template #leading>
                        <p class="text-sm text-muted">
                        https://
                        </p>
                    </template>
            </UInput>
        </UFormField>
        <UFormField label="Note" name="note" v-if="editing || state.note !== ''">
            <UTextarea 
                v-model="state.note" 
                placeholder="Indtast note (valgfri)" 
                class="w-full" 
                :variant="editing ? 'outline' : 'none'"
                :readonly="!editing"
                />
        </UFormField>
        <div class="flex justify-end gap-2 mt-10" v-if="editing">
            <UButton :disabled="buisy" type="button" variant="ghost" @click="$emit('update:editing', false)">Annuller</UButton>
            <UButton :loading="buisy" type="submit" icon="i-lucide-save">
                {{ props.updating ? 'Opdater produkt' : 'Opret produkt' }}
            </UButton>
        </div>
    </UForm>
</template>