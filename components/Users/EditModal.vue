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
</script>

<template>
    <UModal
        :open="props.userModalOpen"
        @update:open="handeOpen($event)"
    >
        <template #header>
            <div class="w-full flex items-center justify-between">
                <h2 class="text-lg font-semibold">
                    {{ editing ? 'Rediger bruger' : 'Brugeroplysninger' }}
                </h2>
                <div>
                    <UTooltip
                        v-if="!editing"
                        text="Rediger bruger"
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
                        @click="handeOpen(false)" 
                        class="cursor-pointer text-gray-700"
                        variant="ghost"
                    >
                    </UButton>
                </div>
            </div>

        </template>

        <template #body>
            <UsersForm 
                :user="user" 
                @update:open="handeOpen($event)" 
                @update:editing="editing = $event" 
                @user:changed="$emit('user:changed', $event)"
                :editing="editing"
                :updating="true"
            />
        </template>
    </UModal>
</template>