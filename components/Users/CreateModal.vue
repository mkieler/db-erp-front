<script setup>
const emit = defineEmits(['update:open']);
</script>

<template>
    <UModal title="Opret ny bruger" @update:open="emit('update:open', $event)">
        <UButton 
            class="cursor-pointer" 
            icon="i-lucide-plus"
            @click="$emit('update:open', true)"
        >
            Opret bruger
        </UButton>

        <template #body>
            <UsersForm 
                @update:editing="$emit('update:open', $event)" 
                @update:open="$emit('update:open', $event)"
                @user:changed="$emit('user:changed', $event)"
                />
        </template>
    </UModal>
</template>