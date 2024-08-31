<template>
    <v-card max-width="600" class="mx-auto">
        <v-card-title class="d-flex align-center pa-4">
            <v-icon size="28" class="mr-2">mdi-alpha-c-circle</v-icon>
            <span class="text-h6">Flip Coin</span>
            <v-spacer></v-spacer>
            <v-chip>{{ `Total Rounds: ${data.flipCoinRoundsTotal}` }}</v-chip>
        </v-card-title>
        <ScrollTrigger :topTriggerMethod="scrollTop" :bottomTriggerMethod="scrollPage">
            <v-list density="compact" class="pa-0" width="400">
                <v-list-item v-for="(round, i) in data.flipCoinRounds" :key="i" :value="round" color="primary">
                    <v-card class="my-1 w-100" :color="getRoundColor(round)" @click="onJoinRoundClick(round)">
                        <v-card-title class="py-2">
                            <v-chip variant="outlined" class="mr-2">
                                <span class="text-h6">{{ round.roundNumber }}</span>
                            </v-chip>
                            <v-chip v-if="round.participant" variant="elevated" color="yellow-darken-4"
                                class="flip-scale-up-ver mr-2">
                                {{ getJoinedMarkContent(round) }}
                            </v-chip>
                        </v-card-title>
                        <v-card-subtitle class="py-1">
                            <p class="mr-3">Participants: {{ `${round.participants} / ${round.participantLimit}`
                                }}</p>
                            <p v-if="round.settleTime">Settled at {{ getDateText(round.settleTime) }}</p>
                        </v-card-subtitle>
                        <v-card class="mt-2" :disabled="round.ableToSettle || round.settle">
                            <v-card-text class="bg-surface-light pa-3">
                                <p class="mb-1">Start Time: {{ getDateText(round.startTime) }}</p>
                                <p class="mb-1">End Time: {{ getDateText(round.endTime) }}</p>
                                <h3 class="my-2">Prize Amount: {{ round.prizeAmount }}</h3>
                                <div class="d-flex justify-end mt-2">
                                    <v-chip size="small">updated {{ getTimeAgo(round.updateTime) }}</v-chip>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-card>
                </v-list-item>
            </v-list>
        </ScrollTrigger>
    </v-card>

    <v-dialog v-model="data.joinRoundPopup">
        <template v-slot:default="">
            <JoinRoundPopup :round="data.joinRound" :loginUser="props.loginUser" :onJoinSuccess="onJoinRoundSuccess" />
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
    onBetSuccess: {
        type: Function,
        required: false,
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

    if (props.onBetSuccess) {
        props.onBetSuccess();
    }
}

</script>