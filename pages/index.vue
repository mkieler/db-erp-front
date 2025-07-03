<template>
    <NuxtLayout pageTitle="Forside">
        <div class="flex flex-col gap-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FrontpageWarnings />

                <FrontpageTotalProducts />

                <FrontpageTotalUsers />
            </div>

            <FrontpageActivities />
        </div>
        
    </NuxtLayout>
</template>