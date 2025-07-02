<script setup>
    const props = defineProps({
        product: {
            type: Object,
            required: true
        },
    });

    const emit = defineEmits(['productChanged', 'viewProduct']);
</script>


<template>
    <div class="flex gap-1">
         <UTooltip
            text="Se produkt"
            :delay-duration="0"
            >        
            <UButton
                variant="ghost"
                size="sm"
                icon="i-fa-regular-eye"
                @click="$emit('viewProduct')"
            />
        </UTooltip>

        <InventoryUpdateStockPopover
            :productId="props.product.id"
            @productChanged="$emit('productChanged')"
        />
        

        <InventoryDeleteModal
            :productId="props.product.id"
            @deleted="$emit('productChanged')"
        />


        <UTooltip
            text="Åben link til genbestilling"
            :delay-duration="0"
            >
            <UButton
                variant="ghost"
                size="sm"
                icon="i-lucide-globe"
                :href="'https://' + product.restock_url"
                target="_blank"
                v-if="product.restock_url"
            />

        </UTooltip>
        
    </div>
</template>