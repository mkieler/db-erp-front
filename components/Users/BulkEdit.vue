<script setup lang="ts">
const props = defineProps({
    selectedUsers: {
        type: Array,
        default: () => []
    }
});

const { userService, accessService } = useBackend();
const accessItems = await accessService.get();
const busy = ref(false);
const data = ref({
    userIds: props.selectedUsers,
    accesses: []
});
const open = ref(false);
const emit = defineEmits(['users:updated']);

async function updateUsers(){
    busy.value = true;
    await userService.bulkUpdate(data.value);
    open.value = false;
    busy.value = false;
    emit('users:updated');
}
</script>

<template>
    <UModal
        title="Masseredigér brugere"
        description="Vælg de indstillinger, du vil opdatere for de valgte brugere."
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
            <div class="p-4">
                <UCheckboxGroup
                    value-key="id"
                    :items="accessItems"
                    v-model="data.accesses"
                    orientation="vertical"
                    :ui="{ fieldset: 'grid grid-cols-1 gap-4' }"
                />
            </div>
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
                    @click="updateUsers"
                    :loading="busy"
                >
                    Gem ændringer
                </UButton>
            </div>
        </template>
    </UModal>
</template>