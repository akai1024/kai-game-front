<template>
    <v-container width="300" height="200" class="pa-0 ma-0">
        <v-card>
            <v-card-title></v-card-title>
            <v-card-text></v-card-text>
            <v-btn prepend-icon="mdi-cash-plus" color="grey" class="mx-auto my-1 d-flex" height="50" @click="onDepositClick">Deposit</v-btn>
            <v-divider class="mt-5"></v-divider>
            <v-card-actions>
                <v-btn prepend-icon="mdi-logout" color="grey" @click="logout" block>Logout</v-btn>
            </v-card-actions>
        </v-card>
    </v-container>
</template>

<script setup>
import { ref } from 'vue';
import api from '@/services/api';


const props = defineProps({
    onDepositSuccess: {
        type: Function,
        required: false
    },

    onLogoutSuccess: {
        type: Function,
        required: true
    },
});

const data = ref({

    processDeposit: false,

});


async function onDepositClick() {
    if (data.value.processDeposit) {
        return;
    }

    data.value.processDeposit = true;
    try {
        const result = await api.post('/user/tx/deposit', { amount: 10 });
        if (result && result.id) {
            if (props.onDepositSuccess) {
                props.onDepositSuccess();
            }
        }
    } catch (err) {
        console.error(err);
    }
    data.value.processDeposit = false;
}

function logout() {
    localStorage.removeItem('localStorageUser');
    props.onLogoutSuccess();
}

</script>