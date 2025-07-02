<script setup>
const props = defineProps({
    userModalOpen: {
        type: Boolean,
        default: false
    },
    user: {
        type: Object,
        default: null
    }
});
const emit = defineEmits(['update:open', 'user:changed']);

function handeOpen(open){
    emit('update:open', open);
    if (!open) {
        editing.value = false;
    }
}
const editing = ref(false);


const activeTab = ref('info');
const tabItems = [
    {
        label: 'Oplysninger',
        icon: 'i-lucide-user',
        value: 'info'
    },
    {
        label: 'Aktivitet',
        icon: 'i-lucide-activity',
        value: 'activity'
    }
];
</script>

<template>
    <UModal
        :open="props.userModalOpen"
        @update:open="handeOpen($event)"
        :ui="{
            header: '!p-0 min-h-0',
            content: 'max-w-3xl w-full',
        }"
    >
        <template #header>
            <div class="w-full flex items-center justify-between">
                <UTabs 
                    :items="tabItems" 
                    class="" 
                    variant="link" 
                    :content="false"
                    v-model="activeTab"
                    :ui="{
                        trigger: 'py-4 px-7',
                    }"
                    >

                </UTabs>
                <div>
                    <UButton 
                        type="button" 
                        icon="i-lucide-x" 
                        size="lg" 
                        @click="handeOpen(false)" 
                        class="cursor-pointer text-gray-700 mr-4"
                        variant="ghost"
                    >
                    </UButton>
                </div>
            </div>

        </template>

        <template #body>
            <div v-if="activeTab === 'info'" class="relative mr-20 p-3">
                <UsersDetailsTab 
                    :user="user" 
                    @update:open="handeOpen($event)"
                    @user:changed="emit('user:changed', $event)"
                />
            </div>

            <div v-else-if="activeTab === 'activity'" class="p-3">
                <UsersActivityTab :user="user" />
            </div>
            
        </template>
    </UModal>
</template>