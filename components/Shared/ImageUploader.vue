<script setup>
const emit = defineEmits(['imageUpdated']);
const props = defineProps({
    url: {
        type: String,
        default: null
    },
    editable: {
        type: Boolean,
        default: true
    }
})

const file = ref(null)
const uploadedImageUrl = ref(props.url)
const fileInput = ref(null)
const { imageService } = useServices();


async function upload(e) {
    file.value = e.target.files[0] || null;
    if (!file.value) return
    const uploadedImage = await imageService.upload(file.value);
    if (uploadedImage) {
        uploadedImageUrl.value = uploadedImage.url
        file.value = null
        emit('imageUpdated', uploadedImage.id)
    }
}
</script>

<template>
    <div class="flex items-center gap-4" v-if="editable">
        <input
        ref="fileInput"
        type="file"
        class="hidden"
        @change="upload"
        />

        <div
        class="w-32 h-20 overflow-hidden rounded border cursor-pointer flex items-center justify-center"
        @click="fileInput.click()"
        >
            <img :src="uploadedImageUrl || '/img/no-image.jpg'" alt="Preview" class="object-cover w-full h-full" />
        </div>

        <div class="flex items-center gap-2">
            <UButton @click="fileInput.click()" variant="outline">{{ uploadedImageUrl ? 'Skift billede' : 'Vælg billede' }}</UButton>
            <UButton
                v-if="uploadedImageUrl"
                @click="file = null; uploadedImageUrl = null"
                variant="ghost"
                color="error"
            >Fjern billede</UButton>
        </div>
    </div>
    <div v-else class="flex flex-col items-center gap-4">
        <div class="w-50 h-32 overflow-hidden rounded border">
            <img :src="uploadedImageUrl || '/img/no-image.jpg'" alt="Preview" class="object-cover w-full h-full" />
        </div>
    </div>
</template>