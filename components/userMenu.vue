<script setup>
const user = useSanctumUser();
const { userService } = useBackend();
const colorMode = useColorMode()

const modeIndex = computed({
    get() {
        if (colorMode.preference === 'light') return 0
        if (colorMode.preference === 'dark') return 1
        return 2 // system
    },
    set(idx) {
        if (idx === 0) colorMode.preference = 'light'
        else if (idx === 1) colorMode.preference = 'dark'
        else colorMode.preference = 'system'
    }
})

const icons = ['i-lucide-sun', 'i-lucide-moon', 'i-lucide-monitor']
const titles = ['Tema: Lyst', 'Tema: Mørk', 'Tema: System']

function cycleMode() {
    modeIndex.value = (modeIndex.value + 1) % 3
}

const items = computed(() => [
  [
    {
      label: 'Settings',
      icon: 'i-lucide-cog'
    },
    {
      label: titles[modeIndex.value],
      icon: icons[modeIndex.value],
      onSelect(e){
          e.preventDefault();
          cycleMode();
        } 
    }
  ],
  [
    {
      label: 'Logout',
      icon: 'i-lucide-log-out',
      onSelect() {
        userService.logout();
      }
    }
  ]
])

const isOpen = ref(false)
</script>

<template>
    <ClientOnly>
        <UDropdownMenu
            :items="items"
            :ui="{ content: 'w-48' }"
            v-model:open="isOpen"
        >
            <UButton color="neutral" variant="link">
                <UAvatar :alt="user?.name" size="lg" />
                <div class="flex flex-col ml-2 text-left">
                    <span class="text-dimmed text-xs">Administrator</span>
                    <span class="text-md font-bold">{{ user?.name }}</span>
                </div>
                <UIcon
                  :name="isOpen ? 'i-lucide-chevron-down' : 'i-lucide-chevron-up'"
                  class="ml-2"
                />
            </UButton>
        </UDropdownMenu>
    </ClientOnly>
</template>
