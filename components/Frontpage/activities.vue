<script setup>
    const { activityService } = useServices();
    const activities = ref([]);
    const loading = ref(true);

    async function loadActivities() {
        loading.value = true;
        try {
            activities.value = await activityService.getActivities();
        } catch (error) {
            console.error('Error loading activities:', error);
        } finally {
            loading.value = false;
        }
    }

    const activitiesColumns = [
        { 
            accessorKey: 'user.name', 
            header: 'Handling udført af', 
        },
        { 
            accessorKey: 'activity_type', 
            header: 'Type / Handling', 
            cell: ({ row }) => {
                const desc = row.original.activity_label || '';
                const isLong = desc.length > 20;
                return h('div', [
                    h('strong', row.original.activity_type),
                    h('br'),
                    isLong
                        ? h(
                            resolveComponent('UTooltip'),
                            { 'delay-duration': 0, text: desc },
                            {
                                default: () => h('span', { class: 'text-gray-500 cursor-help' }, desc.slice(0, 20) + '...')
                            }
                        )
                        : h('span', { class: 'text-gray-500' }, desc)
                ]);
            }
        },
        {
            accessorKey: 'created_at',
            header: 'Tidspunkt',
            cell: ({ row }) => {
                const date = new Date(row.original.created_at);
                const pad = n => n.toString().padStart(2, '0');
                const dd = pad(date.getDate());
                const mm = pad(date.getMonth() + 1);
                const yy = date.getFullYear().toString();
                const HH = pad(date.getHours());
                const MM = pad(date.getMinutes());
                return `${HH}:${MM} / d. ${dd}-${mm}-${yy}`;
            }
        }
    ];

    onMounted(() => {
        loadActivities();
    });
</script>

<template>
    <UCard>
        <template #header>
            <h2 class="text-lg font-semibold">Seneste aktiviteter</h2>
        </template>

        <UTable 
            :data="activities" 
            :loading="loading"
            :columns="activitiesColumns"
            class="h-200"
            />
    </UCard>
</template>
