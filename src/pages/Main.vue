<template>
    <v-app>
        <v-layout>
            <v-app-bar>
                <v-app-bar-nav-icon @click="switchMainPageContentToGamePage">
                    <v-icon icon="mdi-nintendo-game-boy" class="pa-1"></v-icon>
                </v-app-bar-nav-icon>
                <v-toolbar-title class="ml-0">Kai Games</v-toolbar-title>
                <v-chip v-if="data.loginUser" class="pa-4 mr-1" prepend-icon="mdi-gold" @click="refreshWallet">
                    {{ getWalletBalance() }}
                </v-chip>

                <v-menu transition="slide-y-transition" :disabled="!data.loginUser">
                    <v-card>
                        <v-tabs v-model="data.mainPageContent" color="primary" direction="vertical">
                            <v-tab prepend-icon="mdi-nintendo-game-boy" text="Flip Coin" value="FlipCoin"
                                @click="clickTabFlipCoin"></v-tab>
                            <v-tab prepend-icon="mdi-wallet" text="Balance Records" value="TransactionsPage"></v-tab>
                        </v-tabs>
                    </v-card>

                    <template v-slot:activator="{ props }">
                        <v-chip v-bind="props" class="pa-4 mr-2" prepend-icon="mdi-account-circle"
                            @click="clickUserChip" :disabled="data.flipCoinRoundsLoading">
                            Hello! {{ getUserName() }}
                        </v-chip>
                    </template>
                    <UserInfoDrawer v-if="data.loginUser" :onDepositSuccess="onDepositReqSucc"
                        :onLogoutSuccess="refreshAll" />
                </v-menu>
            </v-app-bar>

            <v-main>
                <v-alert type="error" text="Server is on vacation... :(" v-model="data.serverDown"
                    @click="sendTestRequest"></v-alert>

                <div class="d-flex justify-center">
                    <v-container class="pa-1">
                        <v-tabs-window v-model="data.mainPageContent">
                            <v-tabs-window-item value="FlipCoin">
                                <component :is="FlipCoinRoundPage" :loginUser="data.loginUser"
                                    :userWallet="data.userWallet" :onBetSuccess="refreshWallet" />
                            </v-tabs-window-item>
                            <v-tabs-window-item value="TransactionsPage">
                                <component :is="TransactionsPage" :loginUser="data.loginUser"
                                    :onLoginUserChange="switchMainPageContentToGamePage" />
                            </v-tabs-window-item>
                        </v-tabs-window>
                    </v-container>
                </div>

            </v-main>
        </v-layout>
    </v-app>

    <v-snackbar v-model="data.snackbar" :timeout="5000">
        {{ data.snackbarText }}
        <template v-slot:actions>
            <v-btn @click="data.snackbar = false">
                Close
            </v-btn>
        </template>
    </v-snackbar>

    <v-dialog persistent v-model="data.loginPopup">
        <template v-slot:default="">
            <LoginPopup :onCancelClick="onLoginCancelClick" :onLoginSuccess="refreshAll" />
        </template>
    </v-dialog>

</template>

<script setup>
import { ref } from 'vue';
import api from '@/services/api';
import LoginPopup from '@/components/LoginPopup.vue';
import UserInfoDrawer from '@/components/UserInfoDrawer.vue';
import FlipCoinRoundPage from './FlipCoinRoundPage.vue';
import TransactionsPage from './TransactionsPage.vue';

const FlipCoinPage = 'FlipCoin';

const data = ref({
    serverDown: true,

    loginPopup: false,
    loginUser: null,
    userWallet: null,
    mainPageContent: FlipCoinPage,
    lastGamePage: FlipCoinPage,

    snackbar: false,
    snackbarText: '',
});

refreshAll();

async function sendTestRequest() {
    try {
        const result = await api.get('/kai/game/test');
        if (result) {
            data.value.serverDown = false;
        }
    } catch (err) {
        console.error(err);
    }
}

function switchMainPageContentToGamePage() {
    data.value.mainPageContent = data.value.lastGamePage;
}

function clickTabFlipCoin() {
    data.value.lastGamePage = FlipCoinPage;
}

function showSnackBar(content) {
    if (!content) {
        return;
    }
    data.value.snackbar = true;
    data.value.snackbarText = content;
}

async function refreshAll() {
    refreshLoginUser();
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

function refreshLoginUser() {
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
}

function onDepositReqSucc() {
    showSnackBar('Deposit Request Submitted !');
}

</script>

<style scoped>
.v-main {
    height: 100vh;
    overflow-y: auto;
}
</style>