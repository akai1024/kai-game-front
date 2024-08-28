<template>
    <v-container width="400">
        <v-btn color="primary" type="submit" @click="logout" block class="my-3">Logout</v-btn>

    </v-container>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    onLogoutSuccess: {
        type: Function,
        required: true
    },
});

const data = ref({
});

function logout() {
    localStorage.removeItem('localStorageUser');
    props.onLogoutSuccess();
}

</script>