<script setup>
    import { UButton, UsersDeleteModal } from '#components';
    import * as z from 'zod';

    const { accessService, userService } = useServices();
    const accessItems = await accessService.get();
    const buisy = ref(false);

    const props = defineProps({
        user: {
            type: Object,
            default: null
        },
        editing: {
            type: Boolean,
            default: true
        }, 
        updating: {
            type: Boolean,
            default: false
        }
    });

    const emit = defineEmits(['update:open', 'update:editing', 'user:changed']);

    const schema = z.object({
        name: z.string()
            .nonempty('Navn er påkrævet')
            .max(100, 'Navn må højst være 100 tegn')
            .regex(/^[a-zA-ZæøåÆØÅ\s]+$/, 'Navn må kun indeholde bogstaver og mellemrum')
            .refine(val => val.trim().split(' ').length >= 2, {
                message: 'Indtast fornavn og efternavn',
            }),
        email: z.string()
            .nonempty('Email er påkrævet')
            .email('Indtast en gyldig email'),
        password: z.string()
            .refine(val => {
                if (props.updating) {
                    // Allow empty string or at least 8 characters when updating
                    return val === '' || val.length >= 8;
                }
                // When creating, require at least 8 characters
                return val.length >= 8;
            }, {
                message: 'Adgangskode skal være mindst 8 tegn',
            })
    });

    const state = ref({
        name: props.user?.name || '',
        email: props.user?.email || '',
        accesses: props.user?.accesses?.map(a => a.id) || [],
        password: ''
    });

    async function saveChanges() {
        buisy.value = true;
        const successful = await userService.updateOrCreate({
            id: props.user?.id,
            name: state.value.name,
            email: state.value.email,
            accesses: state.value.accesses,
            password: state.value.password
        });
        if (successful) {
            emit('update:editing', false);
            emit('user:changed', true);
        } 
        buisy.value = false;
    }

    function cancel() {
        emit('update:editing', false);
        state.value = {
            name: props.user?.name || '',
            email: props.user?.email || '',
            password: '',
            accesses: props.user?.accesses?.map(a => a.id) || []
        };
    }

    function reset(){
        state.value = {
            name: props.user?.name || '',
            email: props.user?.email || '',
            password: '',
            accesses: props.user?.accesses?.map(a => a.id) || []
        };
    }

    watch(() => props.editing, (newVal) => {
        if (!newVal) {
            reset();
        }
    });

    defineExpose({
        saveChanges,
        reset,
    });
</script>

<template>
    <UForm :schema="schema" :state="state" @submit.prevent="saveChanges">
        <div class="grid grid-cols-2 gap-4">
            <UFormField label="Navn" name="name">
                <UInput
                    v-model="state.name"
                    placeholder="Indtast dit navn"
                    class="w-full"
                    :variant="editing ? 'outline' : 'none'"
                    :readonly="!editing"
                />
            </UFormField>
    
            <UFormField label="Email" name="email">
                <UInput
                    v-model="state.email"
                    label="Email"
                    placeholder="Indtast din email"
                    type="email"
                    class="w-full"
                    :variant="editing ? 'outline' : 'none'"
                    :readonly="!editing"
                />
            </UFormField>



            <UFormField v-if="!updating" label="Adgangskode" name="password">
                <UInput
                    v-model="state.password"
                    placeholder="**********"
                    type="password"
                    class="w-full"
                    :variant="updating ? 'none' : 'outline'"
                    :readonly="updating"
                />
            </UFormField>

            <UFormField v-if="editing" label="Adgange" name="accesses" class="w-full col-span-2">
                <UCheckboxGroup
                    v-model="state.accesses"
                    value-key="id"
                    :items="accessItems"
                    orientation="horizontal"
                    :ui="{
                        fieldset: 'grid grid-cols-2 gap-4',
                    }"
                    />
            </UFormField>
            <div v-else>
                <span class="text-sm font-medium">Adgange:</span>
                <ul v-if="user?.accesses && user.accesses.length > 0" class="m-2">
                    <li v-for="access in user.accesses" :key="access.id" class="text-sm text-gray-900 dark:text-white">
                        {{ access.label }}
                    </li>
                </ul>
                <span v-else class="text-sm text-gray-500 ml-2">ingen adgang</span>
            </div>
        </div>


        <div v-if="editing && !updating" class="mt-10 flex items-center justify-end">            
            <div class="flex gap-2">
                <UButton 
                    type="button" 
                    variant="ghost" 
                    @click="cancel()" 
                    class="cursor-pointer"
                    :disabled="buisy"
                >
                    Annuller
                </UButton>
                <UButton type="submit" icon="i-lucide-save" size="lg" class="cursor-pointer" :loading="buisy">
                    opret
                </UButton>
            </div>
        </div>
    </UForm>
</template>