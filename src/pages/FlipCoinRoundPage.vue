<template>
    <v-card max-width="600">
        <v-card-title class="d-flex align-center">
            <v-icon>mdi-alpha-c-circle</v-icon>
            <span class="mx-5">Flip Coin</span>
            <v-spacer></v-spacer>
            <v-chip>{{ `Total Rounds: ${data.flipCoinRoundsTotal}` }}</v-chip>
        </v-card-title>

        <ScrollTrigger :topTriggerMethod="scrollTop" :bottomTriggerMethod="scrollPage">
            <v-list density="compact" width="400" class="pa-0">
                <v-list-item v-for="(round, i) in data.flipCoinRounds" :key="i" :value="round" color="primary"
                    class="d-flex justify-center">
                    <v-card class="my-1" width="400" :color="getRoundColor(round)" @click="onJoinRoundClick(round)">
                        <v-card-title>
                            <v-chip variant="outlined">
                                <h2>{{ round.roundNumber }}</h2>
                            </v-chip>
                            <v-chip v-if="round.participant" variant="elevated" color="yellow-darken-4"
                                class="flip-scale-up-ver ml-3 opacity-90">
                                {{ getJoinedMarkContent(round) }}
                            </v-chip>
                        </v-card-title>
                        <v-card-subtitle>
                            <span class="mr-3">Participants: {{ `${round.participants} /
                                ${round.participantLimit}` }}</span>
                            <span v-if="round.settleTime">Settled at {{ getDateText(round.settleTime)
                                }}</span>
                        </v-card-subtitle>
                        <v-card class="mt-2" :disabled="round.ableToSettle || round.settle">
                            <v-card-text class="bg-surface-light pt-3">
                                <p>Start Time: {{ getDateText(round.startTime) }}</p>
                                <p>End Time: {{ getDateText(round.endTime) }}</p>
                                <h1 class="my-2">Prize Amount: {{ round.prizeAmount }}</h1>
                                <p>
                                    <v-spacer></v-spacer>
                                    <v-chip>updated {{ getTimeAgo(round.updateTime) }}</v-chip>
                                </p>
                            </v-card-text>
                        </v-card>
                    </v-card>
                </v-list-item>
            </v-list>
        </ScrollTrigger>
    </v-card>

    <v-dialog v-model="data.joinRoundPopup">
        <template v-slot:default="">
            <JoinRoundPopup :round="data.joinRound" :onJoinSuccess="onJoinRoundSuccess" />
        </template>
    </v-dialog>
</template>

<script setup>
import { ref, defineProps, watch } from 'vue';
import api from '@/services/api';
import converter from '@/services/converter';
import JoinRoundPopup from '@/components/JoinRoundPopup.vue';
import ScrollTrigger from '@/components/ScrollTrigger.vue';

const props = defineProps({
    loginUser: {
        type: Object,
        required: false
    },
});

// 監聽 loginUser 的變化
watch(() => props.loginUser, (loginUser) => {
    // 當 loginUser 變化時，更新搜索條件並重新搜索
    searchFlipCoinRounds(true);
});

const data = ref({
    flipCoinRoundsLoading: false,
    flipCoinRoundsPageSize: 5,
    flipCoinRoundsTotal: 0,
    flipCoinRounds: [],

    joinRound: null,
    joinRoundPopup: false,
});

function getDateText(timestamp) {
    return converter.transferFromTimestamp(timestamp);
}

function getTimeAgo(timestamp) {
    return converter.timeAgo(timestamp);
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

async function scrollTop() {
    if (data.value.flipCoinRoundsLoading) {
        return;
    }
    searchFlipCoinRounds(true);
}

async function scrollPage() {
    if (data.value.flipCoinRoundsLoading) {
        return;
    }
    searchFlipCoinRounds(false);
}

async function searchFlipCoinRounds(isRefreshTop) {
    data.value.flipCoinRoundsLoading = true;

    try {
        let request;
        let skipResultSize = 0;
        if (isRefreshTop) {
            request = {
                pageNo: 1,
                pageSize: null, // not assigned, let server return the default size
            };
        } else {
            const curRoundSize = data.value.flipCoinRounds.length;
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
            if (isRefreshTop) {
                data.value.flipCoinRounds = result.content;
            } else {
                if (result.content.length > 0) {
                    const newAddedContent = result.content.slice(skipResultSize);
                    data.value.flipCoinRounds.push(...newAddedContent);
                    data.value.flipCoinRoundsPageSize = result.pageable.pageSize;
                }
            }
            data.value.flipCoinRoundsTotal = result.totalElements;
        }
    } catch (err) {
        console.error(err);
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
    searchFlipCoinRounds(true);
}

</script>