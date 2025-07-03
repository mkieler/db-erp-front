<script setup>
const { userCan } = useHelpers();
const props = defineProps({
    product: {
        type: Object,
        default: null
    },
    isOpen: {
        type: Boolean,
        default: false
    }
});

const editing = ref(false);
// Use a computed setter to emit changes instead of mutating the prop
const isOpen = computed({
    get: () => props.isOpen,
    set: (value) => emit('update:open', value)
});

function handleOpen(open){
    emit('update:open', open);
    if (!open) {
        editing.value = false;
    }
}

const inventoryFormRef = ref(null);

function saveChanges() {
    editing.value = false;
    inventoryFormRef.value?.saveChanges();
}

const emit = defineEmits(['update:open', 'product:changed']);
</script>

<template>
    <InventoryActionsPane 
        :product="product" 
        @update:editing="editing = $event" 
        @update:open="$emit('update:open', $event)" 
        @product:changed="$emit('product:changed', $event)"
        @saveChanges="saveChanges"
        :editing="editing"
        v-if="userCan('editInventory')"
    />

    <InventoryForm
        ref="inventoryFormRef"
        :updating="props.product"
        :editing="editing"
        @update:editing="editing = $event" 
        @update:open="handleOpen($event)"
        @product:changed="$emit('product:changed', $event)"
    />
</template>