<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const items = ref<NavigationMenuItem[][]>([
    [ 
        {
            label: 'Forside',
            icon: 'i-lucide-home',
            to: '/',
        },
        {
            label: 'Brugere',
            icon: 'i-lucide-users',
            to: '/users',
        },
        {
            label: 'Lager',
            icon: 'i-lucide-box',
            to: '/inventory',
        },
    ]
])
</script>

<template>
  <UNavigationMenu orientation="vertical" :items="items" class="data-[orientation=vertical]:w-48" />
</template>
