<script setup>
const props = defineProps({
    selectedUsers: {
        type: Array,
        default: () => []
    }
});

const busy = ref(false);
const { userService } = useBackend();
const userCount = computed(() => props.selectedUsers.length);

const isOpen = ref(false);

const emit = defineEmits(['users:deleted']);

async function deleteUsers() {
    busy.value = true;
    await userService.bulkDelete(props.selectedUsers);
    isOpen.value = false;
    busy.value = false;
    emit('users:deleted', props.selectedUsers);
}

function close() {
    console.log(isOpen.value);
    isOpen.value = false;
    console.log(isOpen.value);
}
</script>


<template>
    <UModal
        title="Slet valgte brugere"
        v-model:open="isOpen"
        @update:open="isOpen = $event"
    >
        <UButton 
            type="button" 
            variant="ghost" 
            color="error" 
            icon="i-lucide-trash-2" 
            class="cursor-pointer p-4 rounded-none border-r border-l border-gray-600"
            size="lg"
            >
            Slet valgte
        </UButton>
        
        <template #body>
            <p class="mb-4">Er du sikker på, at du vil slette {{ userCount }} brugere? Denne handling kan ikke fortrydes.</p>
        </template>

        <template #footer>
            <div class="flex items-center justify-end w-full gap-2">
                <UButton 
                    type="button" 
                    variant="ghost" 
                    color="neutral" 
                    class="cursor-pointer"
                    @click="close"
                    :disabled="busy"
                >
                    Annuller
                </UButton>
                <UButton 
                    type="button" 
                    color="error" 
                    icon="i-lucide-trash-2" 
                    size="lg" 
                    class="cursor-pointer"
                    @click="deleteUsers"
                    :loading="busy"
                >
                    Slet brugere
                </UButton>
            </div>
        </template>
    </UModal>
</template>