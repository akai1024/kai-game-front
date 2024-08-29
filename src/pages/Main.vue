<template>
    <v-app>
        <v-main>
            <v-app-bar title="Kai Games">
                <template v-slot:prepend>
                    <v-icon icon="mdi-nintendo-game-boy" class="mx-3"></v-icon>
                </template>

                <v-spacer></v-spacer>
                <v-chip v-if="data.userWallet" class="ma-2" prepend-icon="mdi-gold" @click="refreshWallet">
                    {{ data.userWallet.balance }}
                </v-chip>
                <v-chip class="ma-2" prepend-icon="mdi-account-circle" @click="clickUserChip"
                    :disabled="data.flipCoinRoundsLoading">
                    Hello! {{ getUserName() }}
                </v-chip>
            </v-app-bar>
            <v-container class="d-flex justify-center" style="max-width: 800px;">

                <v-card title="Flip Coin" max-width="600">
                    <v-list density="compact">
                        <v-list-subheader class="my-3">
                            <v-btn prepend-icon="mdi-refresh" @click="searchFlipCoinRounds">Total Rounds: {{
                                data.flipCoinRoundsTotal }}</v-btn>
                        </v-list-subheader>

                        <v-list-item v-for="(round, i) in data.flipCoinRounds" :key="i" :value="round" color="primary"
                            class="d-flex justify-center">

                            <v-card class="ma-5" prepend-icon="mdi-alpha-c-circle"
                                :subtitle="`${round.participants} / ${round.participantLimit}`" width="400"
                                @click="onJoinRoundClick(round)" :disabled="round.ableToSettle || round.settle"
                                :color="round.ableToSettle || round.settle ? '' : 'green'">
                                <v-badge v-if="round.participant" color="error" content="Joined!">
                                    <v-card-title class="d-flex justify-space-between align-center">
                                        <span class="font-weight-black">{{ round.roundNumber }}</span>
                                        <span v-if="round.settleTime" class="font-weight-black text-right">{{
                                            getDateText(round.settleTime) }}</span>
                                    </v-card-title>
                                </v-badge>
                                <v-card-text class="bg-surface-light pt-3">
                                    <p>Start Time: {{ getDateText(round.startTime) }}</p>
                                    <p>End Time: {{ getDateText(round.endTime) }}</p>
                                    <h1>Prize Amount: {{ round.prizeAmount }}</h1>
                                </v-card-text>
                            </v-card>
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-container>
        </v-main>
    </v-app>

    <v-dialog persistent v-model="data.loginPopup">
        <template v-slot:default="">
            <LoginPopup :onCancelClick="onLoginCancelClick" :onLoginSuccess="onLoginSuccess" />
        </template>
    </v-dialog>
    <v-dialog v-model="data.userInfoPopup">
        <template v-slot:default="">
            <UserInfoPopup :onLogoutSuccess="onLogoutSuccess" />
        </template>
    </v-dialog>
    <v-dialog v-model="data.joinRoundPopup">
        <template v-slot:default="">
            <JoinRoundPopup :round="data.joinRound" :participant="data.roundParticipant" :onJoinSuccess="onJoinRoundSuccess" />
        </template>
    </v-dialog>
</template>

<script setup>
import { ref } from 'vue';
import api from '@/services/api';
import converter from '@/services/converter';
import LoginPopup from '@/components/LoginPopup.vue';
import UserInfoPopup from '@/components/UserInfoPopup.vue';
import JoinRoundPopup from '@/components/JoinRoundPopup.vue';

const data = ref({
    loginPopup: false,
    loginUser: null,

    userWallet: null,

    userInfoPopup: false,

    flipCoinRoundsLoading: false,
    flipCoinRoundsCurPage: 1,
    flipCoinRoundsPageSize: 10,
    flipCoinRoundsTotal: 0,
    flipCoinRounds: [],

    joinRound: null,
    roundParticipant: null,
    joinRoundPopup: false,
});

refreshAll();
onLoginSuccess();

async function refreshAll() {
    refreshWallet();
    searchFlipCoinRounds();
}

function getDateText(timestamp) {
    return converter.transferFromTimestamp(timestamp);
}

async function refreshWallet() {
    if (!data.value.loginUser) {
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

function getUserName() {
    const user = data.value.loginUser;
    return user ? user.account : 'Guest';
}

function clickUserChip() {
    if (!data.value.loginUser) {
        data.value.loginPopup = true;
    } else {
        data.value.userInfoPopup = true;
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
    }
    data.value.loginPopup = false;

    if (!data.value.userWallet) {
        refreshWallet();
    }
}

function onLogoutSuccess() {
    data.value.loginUser = null;
    data.value.userWallet = null;
    data.value.userInfoPopup = false;
    refreshAll();
}

async function searchFlipCoinRounds() {
    data.value.flipCoinRoundsLoading = true;

    try {
        const request = {
            pageNo: data.value.flipCoinRoundsCurPage,
            pageSize: data.value.flipCoinRoundsPageSize,
        };

        const result = await api.post('/user/game/flipCoin/findRounds', request);
        if (result) {
            data.value.flipCoinRounds = result.content;
            data.value.flipCoinRoundsCurPage = result.pageable.pageNumber + 1; // server page started from 0
            data.value.flipCoinRoundsPageSize = result.pageable.pageSize;
            data.value.flipCoinRoundsTotal = result.totalElements;
        }
    } catch (err) {
        console.error(err);
    }

    data.value.flipCoinRoundsLoading = false;
}

function onJoinRoundClick(round) {
    data.value.joinRound = round;
    data.value.roundParticipant = round.participant;
    data.value.joinRoundPopup = true;
}

function onJoinRoundSuccess() {
    // data.value.joinRound = null;
    data.value.joinRoundPopup = false;
    refreshAll();
}

</script>