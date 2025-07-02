<script setup>
import { ref } from 'vue';

defineProps({
    user: {
        type: Object,
        required: true
    }
});

const editing = ref(false);

defineEmits(['update:open', 'user:changed']);

const usersFormRef = ref(null);

function saveChanges() {
    editing.value = false;
    // Call saveChanges on UsersForm if it exists
    usersFormRef.value?.saveChanges();
}
</script>

<template>
    <UsersActionsPane 
        :user="user" 
        @update:editing="editing = $event" 
        @update:open="$emit('update:open', $event)" 
        @user:changed="$emit('user:changed', $event)"
        @saveChanges="saveChanges"
        :editing="editing"
    />
    
    <UsersForm 
        ref="usersFormRef"
        :user="user" 
        @update:open="$emit('update:open', $event)" 
        @update:editing="editing = $event" 
        @user:changed="$emit('user:changed', $event)"
        :editing="editing"
        :updating="true"
    />
</template>