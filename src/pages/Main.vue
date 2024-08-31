<template>
    <v-app>
        <v-layout>
            <v-app-bar>
                <v-app-bar-nav-icon @click="switchToGameHome">
                    <v-icon icon="mdi-nintendo-game-boy" class="pa-3"></v-icon>
                </v-app-bar-nav-icon>
                <v-toolbar-title>Kai Games</v-toolbar-title>
                <v-chip v-if="data.loginUser" class="mr-1" prepend-icon="mdi-gold" @click="refreshWallet">
                    {{ getWalletBalance() }}
                </v-chip>
                <v-menu transition="slide-y-transition">
                    <template v-slot:activator="{ props }">
                        <v-chip v-bind="props" class="mr-2" prepend-icon="mdi-account-circle" @click="clickUserChip"
                            :disabled="data.flipCoinRoundsLoading">
                            Hello! {{ getUserName() }}
                        </v-chip>
                    </template>
                    <UserInfoPopup v-if="data.loginUser" :onDepositSuccess="refreshWallet"
                        :onLogoutSuccess="onLogoutSuccess" />
                </v-menu>
            </v-app-bar>
            <v-main>
                <v-container class="d-flex justify-center" style="max-width: 800px;">
                    <component :is="dynamicComponent" :loginUser="data.loginUser" />
                </v-container>
            </v-main>
        </v-layout>
    </v-app>

    <v-dialog persistent v-model="data.loginPopup">
        <template v-slot:default="">
            <LoginPopup :onCancelClick="onLoginCancelClick" :onLoginSuccess="onLoginSuccess" />
        </template>
    </v-dialog>

</template>

<script setup>
import { ref, defineAsyncComponent, computed, provide } from 'vue';
import api from '@/services/api';
import LoginPopup from '@/components/LoginPopup.vue';
import UserInfoPopup from '@/components/UserInfoPopup.vue';
import FlipCoinRoundPage from './FlipCoinRoundPage.vue';
import TransactionsPage from './TransactionsPage.vue';

const components = {
    FlipCoinRoundPage,
    TransactionsPage
};

const data = ref({
    loginPopup: false,
    loginUser: null,

    userWallet: null,

    currentComponent: 'FlipCoinRoundPage',
});

// 動態組件定義
const dynamicComponent = computed(() => {
    return defineAsyncComponent(() => {
        console.log('Loading component:', data.value.currentComponent);
        return Promise.resolve(components[data.value.currentComponent]);
    });
});

// 切換組件的方法
function switchComponent(componentName) {
    console.log('Switching to component:', componentName);
    data.value.currentComponent = componentName;
}

function switchToGameHome() {
    switchComponent('FlipCoinRoundPage');
}

function switchToTransactionsPage() {
    switchComponent('TransactionsPage');
}

// 提供 switchComponent 方法給所有子組件
provide('switchToGameHome', switchToGameHome);
provide('switchToTransactionsPage', switchToTransactionsPage);

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

<style scoped>
.v-main {
    height: 100vh;
    overflow-y: auto;
}
</style>