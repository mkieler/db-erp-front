<script setup>
    import { UButton } from '#components'

    const { statisticsService } = useServices();
    const warnings = ref([]);
    const loading = ref(true);

    async function loadWarnings() {
        loading.value = true;
        try {
            warnings.value = await statisticsService.getWarnings();
            console.log('Warnings loaded:', warnings.value);
        } catch (error) {
            console.error('Error loading warnings:', error);
        } finally {
            loading.value = false;
        }
    }

    onMounted(() => {
        loadWarnings();
    });
</script>

<template>
    <UCard>
        <template #header>
            <h2 class="text-lg font-semibold">Advarsler</h2>
        </template>

        <UTable
            :data="warnings"
            :ui="{
                thead: 'hidden'
            }"
            :columns="[
                {
                    id: 'expand',
                    cell: ({ row }) =>
                    h(UButton, {
                        color: 'neutral',
                        variant: 'ghost',
                        icon: 'i-lucide-chevron-down',
                        square: true,
                        'aria-label': 'Expand',
                        ui: {
                        leadingIcon: [
                            'transition-transform',
                            row.getIsExpanded() ? 'duration-200 rotate-180' : ''
                        ]
                        },
                        onClick: () => row.toggleExpanded()
                    })
                },
                {
                    accessorKey: 'label',
                    header: '',
                },
            ]"
            :loading="loading"
            >
            <template #expanded="{ row }">
                <ul>
                    <li v-for="product in row.original.data" :key="product.id">
                        {{ product.name }} har kun {{ product.qty }} tilbage på lager.
                    </li>
                </ul>
            </template>

            <template #empty>
                <p class="text-center text-gray-500">Ingen advarsler i øjeblikket.</p>
            </template>
        </UTable>
    </UCard>
</template>
                