<template>
    <v-app>
        <v-app-bar title="Kai Games" app fixed>
            <template v-slot:prepend>
                <v-icon icon="mdi-nintendo-game-boy" class="ml-3"></v-icon>
            </template>
            <v-chip v-if="data.loginUser" class="ma-2" prepend-icon="mdi-gold" @click="refreshWallet">
                {{ getWalletBalance() }}
            </v-chip>
            <v-chip class="ma-2" prepend-icon="mdi-account-circle" @click="clickUserChip"
                :disabled="data.flipCoinRoundsLoading">
                Hello! {{ getUserName() }}
            </v-chip>
        </v-app-bar>
        <v-main>
            <v-container class="d-flex justify-center" style="max-width: 800px;">
                <v-card max-width="600">
                    <v-card-title>
                        <v-icon>mdi-alpha-c-circle</v-icon>
                        Flip Coin
                        <v-btn class="ml-10" color="blue-lighten-1" prepend-icon="mdi-refresh"
                            @click="searchFlipCoinRounds">Total Rounds: {{
                                data.flipCoinRoundsTotal }}</v-btn>
                    </v-card-title>
                    <PageBottomElement :bottomTriggerMethod="scrollPage">
                        <v-list density="compact">
                            <v-list-item v-for="(round, i) in data.flipCoinRounds" :key="i" :value="round"
                                color="primary" class="d-flex justify-center">
                                <v-card class="my-1" :color="getRoundColor(round)" @click="onJoinRoundClick(round)">
                                    <v-card-title>
                                        <v-chip>
                                            <h2>{{ round.roundNumber }}</h2>
                                        </v-chip>
                                        <v-badge v-if="round.participant" color="yellow-darken-4"
                                            :content="getJoinedMarkContent(round)" inline
                                            class="flip-scale-up-ver ml-3">
                                            <span></span>
                                        </v-badge>
                                    </v-card-title>
                                    <v-card-subtitle>
                                        <span class="mr-3">Participants: {{ `${round.participants} /
                                            ${round.participantLimit}` }}</span>
                                        <v-spacer></v-spacer>
                                        <span v-if="round.settleTime">Settled at {{ getDateText(round.settleTime)
                                            }}</span>
                                    </v-card-subtitle>
                                    <v-card class="mt-2" width="400" :disabled="round.ableToSettle || round.settle">
                                        <v-card-text class="bg-surface-light pt-3">
                                            <p>Start Time: {{ getDateText(round.startTime) }}</p>
                                            <p>End Time: {{ getDateText(round.endTime) }}</p>
                                            <h1>Prize Amount: {{ round.prizeAmount }}</h1>
                                        </v-card-text>
                                    </v-card>
                                </v-card>
                            </v-list-item>
                        </v-list>
                    </PageBottomElement>
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
            <JoinRoundPopup :round="data.joinRound" :onJoinSuccess="onJoinRoundSuccess" />
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
import PageBottomElement from '@/components/PageBottomElement.vue';

const data = ref({
    loginPopup: false,
    loginUser: null,

    userWallet: null,

    userInfoPopup: false,

    flipCoinRoundsLoading: false,
    flipCoinRoundsPageSize: 5,
    flipCoinRoundsTotal: 0,
    flipCoinRounds: [],

    joinRound: null,
    joinRoundPopup: false,
});

onLoginSuccess();

async function refreshAll() {
    refreshWallet();
    searchFlipCoinRounds(true);
}

function getDateText(timestamp) {
    return converter.transferFromTimestamp(timestamp);
}

function getJoinedMarkContent(round) {
    if (round.participant && round.settled) {
        return round.participant.winAmount > 0 ? 'Win !' : 'Lose';
    }
    return 'Joined !';
}

function getRoundColor(round) {
    if (round.settled) {
        return 'red-darken-2';
    } else if (round.ableToSettle) {
        return 'red-lighten-2';
    } else if (round.opening) {
        return 'green-darken-1';
    }
    return 'primary';
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
    } else {
        data.value.loginUser = null;
    }
    data.value.loginPopup = false;

    refreshAll();
}

function onLogoutSuccess() {
    data.value.loginUser = null;
    data.value.userWallet = null;
    data.value.userInfoPopup = false;
    refreshAll();
}

async function scrollPage() {
    if (data.value.flipCoinRoundsLoading) {
        return;
    }
    searchFlipCoinRounds();
}

async function searchFlipCoinRounds(isClickRefresh) {
    data.value.flipCoinRoundsLoading = true;

    try {
        const curRoundSize = data.value.flipCoinRounds.length;
        let request;
        let skipResultSize = 0;
        if (isClickRefresh) {
            request = {
                pageNo: 1,
                pageSize: curRoundSize,
            };
        } else {
            const pageSize = data.value.flipCoinRoundsPageSize;
            const curPage = Math.floor(curRoundSize / pageSize) + 1;
            skipResultSize = curRoundSize % pageSize;
            request = {
                pageNo: curPage,
                pageSize: pageSize,
            };
        }

        const result = await api.post('/user/game/flipCoin/findRounds', request);
        if (result) {
            if (isClickRefresh) {
                data.value.flipCoinRounds = result.content;
            } else {
                if (result.content.length > 0) {
                    const newAddedContent = result.content.slice(skipResultSize);
                    data.value.flipCoinRounds.push(...newAddedContent);
                    data.value.flipCoinRoundsPageSize = result.pageable.pageSize;
                    data.value.flipCoinRoundsTotal = result.totalElements;
                }
            }
        }
    } catch (err) {
        console.error(err);
        onLoginSuccess();
    }

    data.value.flipCoinRoundsLoading = false;
}

function onJoinRoundClick(round) {
    if (round.opening || round.participant) {
        data.value.joinRound = round;
        data.value.joinRoundPopup = true;
    }
}

function onJoinRoundSuccess() {
    data.value.joinRoundPopup = false;
    refreshAll();
}

</script>