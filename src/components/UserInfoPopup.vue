<template>
    <v-container width="300" height="200" class="pa-0 ma-1">
        <v-card>
            <v-card-title></v-card-title>
            <v-card-text></v-card-text>
            <v-btn color="grey" class="mx-auto my-1 d-flex">Money Change History</v-btn>
            <v-divider class="mt-5"></v-divider>
            <v-card-actions>
                <v-btn color="grey" @click="logout" block>Logout</v-btn>
            </v-card-actions>
        </v-card>
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