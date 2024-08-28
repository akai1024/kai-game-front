<template>
    <v-app>
        <v-main>
            <v-app-bar title="Game Nerd">
                <template v-slot:prepend>
                    <v-icon icon="mdi-nintendo-game-boy" class="mx-3"></v-icon>
                </template>

                <v-spacer></v-spacer>
                <v-chip class="ma-2" prepend-icon="mdi-account-circle" @click="clickUserChip">
                    Hello! {{ getUserName() }}
                </v-chip>
            </v-app-bar>
            <v-container width="600">
                <v-card title="Flip Coin">
                    <v-list density="compact">
                        <v-list-subheader>Total Rounds: {{ data.flipCoinRoundsTotal }}</v-list-subheader>
                        <v-list-item v-for="(round, i) in data.flipCoinRounds" :key="i" :value="round" color="primary">
                            <template v-slot:prepend>
                                <v-card :title="round.roundNumber" width="300">
                                    <v-card-text>Prize Amont: {{ round.prizeAmount }}</v-card-text>
                                    <v-card-text>Participants: {{ round.participants }} / {{ round.participantLimit
                                        }}</v-card-text>
                                </v-card>
                            </template>
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
</template>

<script setup>
import { ref } from 'vue';
import api from '@/services/api';
import LoginPopup from '@/components/LoginPopup.vue';

const data = ref({
    loginPopup: false,
    loginUser: null,

    flipCoinRoundsLoading: false,
    flipCoinRoundsCurPage: 1,
    flipCoinRoundsPageSize: 10,
    flipCoinRoundsTotal: 0,
    flipCoinRounds: [],
});

searchFlipCoinRounds();

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
    }
    data.value.loginPopup = false;
}

async function searchFlipCoinRounds() {
    data.value.flipCoinRoundsLoading = true;

    try {
        const request = {
            pageNo: data.value.flipCoinRoundsCurPage,
            pageSize: data.value.flipCoinRoundsPageSize,
        };

        const result = await api.post('/user/game/flipCoin/findRounds', request);
        data.value.flipCoinRounds = result.content;
        data.value.flipCoinRoundsCurPage = result.pageable.pageNumber + 1; // server page started from 0
        data.value.flipCoinRoundsPageSize = result.pageable.pageSize;
        data.value.flipCoinRoundsTotal = result.totalElements;
    } catch (err) {
        console.error(err);
    }

    data.value.flipCoinRoundsLoading = false;
}

</script>