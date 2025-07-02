<script setup>
const emit = defineEmits(['update:open', 'product:changed']);
const isOpen = ref(false);
</script>

<template>
    <UModal 
        title="Opret ny vare"
        size="lg"
        @update:open="isOpen = $event"
        v-model:open="isOpen"
        >
        <UButton
            icon="i-lucide-plus"
        >Opret ny vare</UButton>

        <template #body>
            <InventoryForm
                @update:editing="isOpen = $event" 
                @update:open="isOpen = $event"
                @product:changed="$emit('product:changed', $event)"
            />
        </template>
    </UModal>
</template>