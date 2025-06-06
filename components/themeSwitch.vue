<script setup>

</script>

<template>
    <ClientOnly v-if="!colorMode?.forced">
        <UButton
            :icon="icons[modeIndex]"
            :title="titles[modeIndex]"
            color="neutral"
            variant="ghost"
            @click="cycleMode"
        />

        <template #fallback>
            <div class="size-8" />
        </template>
    </ClientOnly>
</template>
