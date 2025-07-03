<script setup>
import { UBadge, UCheckbox,UButton } from '#components'
import TableActions from '@/components/Inventory/TableActions.vue'

const { inventoryService } = useServices();

const { userCan } = useHelpers();

const productModalOpen = ref(false)
const loading = ref(true)
const inventory = ref([])
const selectedProducts = ref([])
const selectedProduct = ref(null)
const totalProducts = ref(0)
const inventoryRequestParams = ref({
    page: 1,
    perPage: 20,
    search: ''
})
const rowSelection = ref({})

// Methods
async function loadProducts() {
    loading.value = true;
    selectedProducts.value = []
    rowSelection.value = {}
    const paginatedProducts = await inventoryService.getProducts(inventoryRequestParams.value);
    inventory.value = paginatedProducts.data;
    totalProducts.value = paginatedProducts.total;
    loading.value = false;
}

function clearSelection() {
    selectedProducts.value = []
    rowSelection.value = {}
}

function handleSelectedProducts(selectedId, value) {
    if (value && !selectedProducts.value.includes(selectedId)) {
        selectedProducts.value.push(selectedId)
    } else if (!value) {
        selectedProducts.value = selectedProducts.value.filter(id => id !== selectedId)
    }
}

function onSelect(row) {
    selectedProduct.value = row.original;
    productModalOpen.value = true;
}

function updateFilters() {
  inventoryRequestParams.value.page = 1
  loadProducts()
}

onMounted(loadProducts)
</script>


<template>
    <NuxtLayout pageTitle="Lager">
        <template #pageActions>
            <div class="flex-1 flex items-center justify-between gap-2">
                <UInput
                    placeholder="Søg efter produkter..."
                    class="w-64"
                    icon="i-lucide-search"
                    v-model="inventoryRequestParams.search"
                    @keyup="updateFilters"
                />
                <div class="flex items-center gap-2" v-if="userCan('editInventory')">
                    <InventoryCreateModal @product:changed="loadProducts"/>
                </div>
            </div>
        </template>

        <InventoryDetailsModal
            v-model:open="productModalOpen"
            :product="selectedProduct"
            @product:changed="loadProducts"
            @update:open="productModalOpen = $event"
        />
        <UCard class="relative">
            <div
                v-if="selectedProducts.length > 0 && userCan('editInventory')"
                class="rounded-xl overflow-hidden z-10 shadow-xl absolute bottom-15 left-1/2 transform -translate-x-1/2 flex justify-between items-center bg-gray-800"
            >
                <UButton 
                    variant="ghost"
                    color="neutral"
                    class="cursor-pointer p-4 rounded-none text-white hover:bg-gray-600"
                    size="lg"
                    @click="clearSelection"
                >
                    fjern valgte ({{ selectedProducts.length }})
                </UButton>
                <InventoryBulkDelete :selectedProducts="selectedProducts" @products:deleted="loadProducts" />
                <InventoryBulkEdit :selectedProducts="selectedProducts" @products:updated="loadProducts" />
            </div>

        <UTable
            :loading="loading"
            :data="inventory"
            sticky
            class="h-[75vh] w-full"
            :rowSelection="rowSelection"
            :columns="[
                ...(userCan('editInventory') ? [{
                    id: 'select',
                    header: ({ table }) =>
                        h(UCheckbox, {
                            modelValue: table.getIsSomePageRowsSelected() ? 'indeterminate' : table.getIsAllPageRowsSelected(),
                            'onUpdate:modelValue': (value) => {
                                table.toggleAllPageRowsSelected(value)
                                const ids = table.getRowModel().rows.map(r => r.original.id)
                                ids.forEach(id => handleSelectedProducts(id, value))
                            },
                            'aria-label': 'Vælg alle'
                        }),
                    cell: ({ row }) =>
                        h(UCheckbox, {
                            modelValue: row.getIsSelected(),
                            'onUpdate:modelValue': (val) => {
                                row.toggleSelected(val)
                                handleSelectedProducts(row.original.id, val)
                            }
                        })
                }] : []),
                { accessorKey: 'image_url', header: 'Billede', cell: ({ row }) => {
                    const imageUrl = row.original.image_url || '/img/no-image.jpg'
                    return h('img', { src: imageUrl, class: 'w-10 h-10 object-cover rounded' })
                }},
                { accessorKey: 'name', header: 'Produkt' },
                { accessorKey: 'qty', header: 'Antal' },
                { 
                    accessorKey: 'alert_threshold', 
                    header: 'Advarselsgrænse',
                    cell: ({ row }) => row.original.should_alert ? row.original.alert_threshold  : '--'
                },
                { 
                    accessorKey: 'should_alert', 
                    header: 'Advarsel ved lavt lager', 
                    cell: ({ cell }) => {
                        const value = cell.getValue()
                        const color = value ? 'success' : 'neutral'
                        return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () =>
                            value ? 'Notifikation aktiveret' : 'Notifikation deaktiveret'
                        )
                    }
                },
                {
                    id: 'actions',
                    header: '',
                    cell: ({ row }) => {
                        return h(TableActions, {
                            product: row.original,
                            onProductChanged: () => {
                                loadProducts()
                            },
                            onViewProduct: () => {
                                onSelect(row)
                            }
                        })
                    }
                }
            ]"
            :ui="{
                tbody: 'cursor-pointer',
            }"
            @select="onSelect"
        >
            <template #loading>
            <div v-for="i in 20" :key="i">
                <USkeleton class="h-10 w-full mb-5" />
            </div>
            </template>
        </UTable>
    </UCard>

        <div class="mt-4 flex justify-between items-center">
            <span v-if="totalProducts > 0" class="text-sm text-gray-500">
            Viser {{ inventoryRequestParams.page }} - {{ inventoryRequestParams.page * inventoryRequestParams.perPage }} af {{ totalProducts }} produkter
            </span>
            <UPagination
                v-if="totalProducts > inventoryRequestParams.perPage"
                v-model:page="inventoryRequestParams.page"
                :total="totalProducts"
                show-edges
                variant="ghost"
                :items-per-page="inventoryRequestParams.perPage"
                @update:page="loadProducts"
            />
        </div>
    </NuxtLayout>
</template>