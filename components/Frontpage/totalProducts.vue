<script setup>
    const { statisticsService } = useServices();
    const totalProducts = await statisticsService.getTotalProducts();
</script>

<template>
    <UCard>
        <template #header>
            <h2 class="text-lg font-semibold">Produkter på lager</h2>
        </template>

        <p class="font-black text-6xl">{{totalProducts}}</p>
        <p class="text-gray-500">Produkter</p>
    </UCard>
</template>