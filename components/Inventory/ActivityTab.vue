<script setup>
    const { inventoryService, activityService } = useServices();

    const productActivities = ref([]);
    const loading = ref(false);

    const columns = [
        {
            accessorKey: 'user.firstName',
            header: 'Udført af',
            cell: ({ row }) => {
            const user = row.original.user || {};
            return [user.firstName, user.lastName].filter(Boolean).join(' ');
            }
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
                    default: () =>
                        h('span', { class: 'text-gray-500 cursor-help' }, desc.slice(0, 20) + '...')
                    }
                )
                : h('span', { class: 'text-gray-500' }, desc)
            ]);
            }
        },
        {
            accessorKey: 'created_at',
            header: 'tidspunkt',
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
        },
    ];

    const types = ref([]);

    const filters = ref({
        selectedDate: null,
        search: '',
        type: null,
        perPage: 1000
    });

    const props = defineProps({
        product: {
            type: Object,
            required: true
        }
    });
    
    async function loadActivities() {
        loading.value = true;
        // Helper to format { day, month, year } to 'YYYY-MM-DD'
        function formatDate(obj) {
            if (!obj || typeof obj !== 'object') return null;
            const yyyy = obj.year;
            const mm = String(obj.month).padStart(2, '0');
            const dd = String(obj.day).padStart(2, '0');
            return `${yyyy}-${mm}-${dd}`;
        }

        console.log(Array.isArray(filters.value.type) ? filters.value.type.join(',') : null);

        const productActivityResponse = await inventoryService.getActivities(props.product.id, {
            type: Array.isArray(filters.value.type) ? filters.value.type.join(',') : null,
            search: filters.value.search || null,
            from: filters.value.selectedDate?.start ? formatDate(filters.value.selectedDate.start) : null,
            to: filters.value.selectedDate?.end ? formatDate(filters.value.selectedDate.end) : null,
            perPage: 1000
        });

        console.log(productActivityResponse);

        productActivities.value = productActivityResponse.data;
        loading.value = false;
    }

    async function initialize() {
        const availableFilters = await activityService.getActivityFilters('product');

        types.value = availableFilters.availableTypes.map(type => ({
            label: type,
            value: type
        }));

        // By default select all
        filters.value.type = types.value.map(t => t.value);
        await loadActivities();
    }

    const selectedDateLabel = computed(() => {
        const { selectedDate } = filters.value;
        if (!selectedDate || !selectedDate.start) return 'Vælg en dato';
        const start = new Date(selectedDate.start);
        const end = selectedDate.end ? new Date(selectedDate.end) : null;

        const format = (date) => {
            const dd = date.getDate().toString().padStart(2, '0');
            const mm = (date.getMonth() + 1).toString().padStart(2, '0');
            const yy = date.getFullYear();
            return `${dd}-${mm}-${yy}`;
        };

        if (end && start.getTime() !== end.getTime()) {
            return `${format(start)} - ${format(end)}`;
        }
        return format(start);
    });

    onMounted(() => {
        initialize();
    });
</script>

<template>
    <div class="flex items-center justify-between mb-4">
        <UInput 
            v-model="filters.search" 
            placeholder="Søg i aktiviteter..." 
            variant="outline"
            icon="i-lucide-search" 
            @keyup="loadActivities"
        />

        <div class="flex items-center gap-2">
            <USelect
            v-model="filters.type"
            multiple
            :items="types"
            @change="loadActivities"
            class="w-[10rem]"
            >
                <template #default>
                    <span>
                    {{
                        !filters.type || filters.type.length === 0
                        ? 'Ingen typer'
                        : filters.type.length === types.length
                            ? 'Alle typer'
                            : `${filters.type.length} valgte`
                    }}
                    </span>
                </template>
            </USelect>

            
            <UPopover>
                <UButton color="neutral" variant="subtle" icon="i-lucide-calendar" class="w-[9rem]">
                    {{ selectedDateLabel }}
                </UButton>

                <template #content>
                    <UCalendar range v-model="filters.selectedDate" @update:modelValue="loadActivities" class="p-2" />
                </template>
            </UPopover>
        </div>
        
    </div>
    <UTable 
        :columns="columns"
        :data="productActivities"
        :loading="loading"
        sticky
        class="h-[30rem] w-full"
    />


</template>