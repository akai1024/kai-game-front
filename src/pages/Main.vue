<template>
    <v-app>
        <v-app-bar title="Kai Games" app fixed>
            <template v-slot:prepend>
                <v-icon icon="mdi-nintendo-game-boy" class="ml-3"></v-icon>
            </template>
            <v-chip v-if="data.loginUser" class="ma-2" prepend-icon="mdi-gold" @click="refreshWallet">
                {{ getWalletBalance() }}
            </v-chip>
            <v-menu transition="slide-y-transition">
                <template v-slot:activator="{ props }">
                    <v-chip v-bind="props" class="ma-2" prepend-icon="mdi-account-circle" @click="clickUserChip"
                        :disabled="data.flipCoinRoundsLoading">
                        Hello! {{ getUserName() }}
                    </v-chip>
                </template>
                <UserInfoPopup v-if="data.loginUser" :onLogoutSuccess="onLogoutSuccess" />
            </v-menu>

        </v-app-bar>
        <v-main>
            <v-container class="d-flex justify-center" style="max-width: 800px;">
                <template #default>
                    <component :is="FlipCoinRoundPage" :loginUser="data.loginUser" />
                </template>
            </v-container>
        </v-main>
    </v-app>

    <v-dialog persistent v-model="data.loginPopup">
        <template v-slot:default="">
            <LoginPopup :onCancelClick="onLoginCancelClick" :onLoginSuccess="onLoginSuccess" />
        </template>
    </v-dialog>

</template>

<script setup>
import { ref } from 'vue';
import api from '@/services/api';
import converter from '@/services/converter';
import LoginPopup from '@/components/LoginPopup.vue';
import UserInfoPopup from '@/components/UserInfoPopup.vue';
import FlipCoinRoundPage from './FlipCoinRoundPage.vue';

const data = ref({
    loginPopup: false,
    loginUser: null,

    userWallet: null,
});

onLoginSuccess();

async function refreshAll() {
    refreshWallet();
}

async function refreshWallet() {
    if (!data.value.loginUser) {
        data.value.userWallet = null;
        return;
    }

    try {
        const result = await api.get('/user/money/getInfo');
        if (result) {
            data.value.userWallet = result;
        }
    } catch (err) {
        console.error(err);
        onLoginSuccess();
    }
}

function getWalletBalance() {
    return data.value.userWallet ? data.value.userWallet.balance : 0;
}

function getUserName() {
    const user = data.value.loginUser;
    return user ? user.account : 'Guest';
}

function clickUserChip() {
    if (!data.value.loginUser) {
        data.value.loginPopup = true;
    }
}

function onLoginCancelClick() {
    data.value.loginPopup = false;
}

function onLoginSuccess() {
    const localStorageUser = JSON.parse(localStorage.getItem('localStorageUser'));
    if (localStorageUser) {
        data.value.loginUser = {
            account: localStorageUser.account,
            userId: localStorageUser.userId,
        };
    } else {
        data.value.loginUser = null;
    }
    data.value.loginPopup = false;

    refreshAll();
}

function onLogoutSuccess() {
    data.value.loginUser = null;
    data.value.userWallet = null;
    refreshAll();
}

</script>