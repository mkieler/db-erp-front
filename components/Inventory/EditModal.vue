<script setup>
const emit = defineEmits(['update:open', 'product:changed']);

const props = defineProps({
    updating: {
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
</script>


<template>
    <UModal 
        title="Opdater vare"
        size="lg"
        @update:open="isOpen = $event"
        v-model:open="isOpen"
        >

        <template #header>
            <div class="w-full flex items-center justify-between">
                <h2 class="text-lg font-semibold">
                    {{ editing ? 'Rediger vare' : 'Varedetaljer' }}
                </h2>
                <div>
                    <InventoryDeleteModal
                        v-if="!editing"
                        :product="props.updating"
                        @update:open="isOpen = $event"
                        @update:editing="editing = $event"
                        @product:changed="$emit('product:changed', $event)"
                    />
                    <UTooltip
                        v-if="!editing"
                        text="Rediger vare"
                        :delay-duration="0"
                    >          
                        <UButton 
                            v-if="!editing"
                            type="button" 
                            icon="i-lucide-edit" 
                            size="lg" 
                            @click="editing = true" 
                            class="cursor-pointer text-gray-700"
                            variant="ghost"
                        >
                        </UButton>
                    </UTooltip>

                    <UButton 
                        type="button" 
                        icon="i-lucide-x" 
                        size="lg" 
                        @click="isOpen = false" 
                        class="cursor-pointer text-gray-700"
                        variant="ghost"
                    >
                    </UButton>
                </div>
            </div>

        </template>

        <template #body>
            <InventoryForm
                :updating="props.updating"
                :editing="editing"
                @update:editing="editing = $event" 
                @update:open="handleOpen($event)"
                @product:changed="$emit('product:changed', $event)"
            />
        </template>
    </UModal>
</template>