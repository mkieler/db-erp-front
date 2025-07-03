<script setup>
const emit = defineEmits(['update:open', 'product:changed']);

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

const activeTab = ref('info');
const tabItems = [
    {
        label: 'Produktoplysninger',
        icon: 'i-lucide-box',
        value: 'info'
    },
    {
        label: 'Aktivitet',
        icon: 'i-lucide-activity',
        value: 'activity'
    }
];

const dialogContentClass = computed(() => {
    switch (activeTab.value) {
        case 'info':
            return 'max-w-xl w-full';
        case 'activity':
            return 'max-w-3xl w-full';
        default:
            return 'w-full';
    }
});
</script>


<template>
    <UModal 
        title="Opdater vare"
        size="lg"
        @update:open="emit('update:open', $event)"
        v-model:open="props.isOpen"
        :ui="{
            header: '!p-0 min-h-0',
            content: dialogContentClass,
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
                        @click="emit('update:open', false)" 
                        class="cursor-pointer text-gray-700 mr-4"
                        variant="ghost"
                    >
                    </UButton>
                </div>
            </div>
        </template>

        <template #body>
            <div v-if="activeTab === 'info'" class="relative p-3" :class="{'mr-20': userCan('editInventory')}"> 
                <InventoryDetailsTab 
                    :product="product" 
                    @update:open="emit('update:open', $event)"
                    @product:changed="emit('product:changed', $event)"
                />
            </div>

            <div v-else-if="activeTab === 'activity'" class="p-3">
                <InventoryActivityTab :product="product" />
            </div>

        </template>
    </UModal>
</template>