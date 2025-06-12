<script setup>
    import { UCheckbox } from '#components';
import * as z from 'zod';

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
            .optional()
    });

    const state = ref({
        productName: '',
        quantity: 1,
        alertThreshold: 5
    });

    const emit = defineEmits(['stockItem:created', 'update:open']);

    async function onSubmit() {

    }
</script>
<template>
    <UForm :schema="schema" :state="state" @submit.prevent="onSubmit">
        <UFormField label="Produktnavn" name="productName">
            <UInput v-model="state.productName" placeholder="Indtast produktnavn" />
        </UFormField>
        <UFormField label="Antal på lager" name="quantity">
            <UInput v-model.number="state.quantity" type="number" placeholder="Indtast antal" />
        </UFormField>
        <UCheckbox v-model="state.shouldAlert" label="Skal der sendes en notifikation ved lavt lager antal" />
        <UFormField v-if="state.shouldAlert" label="Advarselsgrænse" name="alertThreshold">
            <UInput v-model.number="state.alertThreshold" type="number" placeholder="Indtast advarselsgrænse" />
        </UFormField>

    </UForm>
</template>