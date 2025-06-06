
<template>
    <NuxtLayout pageTitle="Forside">
        <template #pageActions>
            <UButton
                icon="i-heroicons-plus-solid"
                color="primary"
                variant="solid"
                class="ml-auto"
                @click="$router.push('/new')"
            >
                New Item
            </UButton>
        </template>
    </NuxtLayout>
</template>