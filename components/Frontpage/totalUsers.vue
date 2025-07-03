<script setup>
    const { statisticsService } = useServices();
    const totalUsers = await statisticsService.getTotalUsers();
</script>

<template>
    <UCard>
        <template #header>
            <h2 class="text-lg font-semibold">Brugere på platformen</h2>
        </template>

        <p class="font-black text-6xl">{{totalUsers}}</p>
        <p class="text-gray-500">Brugere</p>
    </UCard>
</template>