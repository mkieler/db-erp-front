

<template>
    <div class="h-screen">
        <div class="flex h-full">
            <aside class="p-4 w-64 shadow-xl h-full overflow-y-auto z-10">
                <div class="flex flex-col justify-between h-full">
                    <div>
                        <SharedLogo class="mb-3"/>
                        <USeparator />
                        <SharedNavigation class="my-3" />
                    </div>
                    <div>
                        <USeparator class="my-3"/>
                        <SharedUserMenu />
                    </div>
                </div>
            </aside>
            <main class="flex flex-col flex-1 p-6 bg-gray-50 dark:bg-elevated/50 overflow-y-auto">
                <div class="flex items-center mb-6">
                    <h1 class="text-2xl font-semibold mr-5">{{ pageTitle }}</h1>
                    <slot name="pageActions" />
                </div>
                <slot/>
            </main>
        </div>
    </div>
</template>

<script setup>
    defineProps({
        pageTitle: {
            type: String,
            default: 'Page Title'
        }
    })
</script>