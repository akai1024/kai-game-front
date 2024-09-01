<template>
    <v-container class="pa-0 mx-auto">
        <v-card v-if="props.round">
            <v-container v-if="props.round.participant">
                <v-card-title class="d-flex justify-center align-center">
                    Participation Detail of {{ props.round.roundNumber }}
                </v-card-title>
                <v-card-subtitle class="d-flex justify-center align-center">
                    Trace Id: {{ props.round.participant.traceId }}
                </v-card-subtitle>
                <v-card-text class="d-flex justify-center align-center">
                    Current Total Prize Amount:
                </v-card-text>
                <h1 class="d-flex justify-center align-center">$ {{ props.round.prizeAmount }}</h1>
                <v-spacer class="my-5"></v-spacer>
                <v-card color="secondary" class="my-1">
                    <v-card-title class="d-flex justify-center align-center">
                        {{ getFlipCountContent(props.round.participant.flipCount, true) }}
                    </v-card-title>
                    <div class="d-flex justify-center align-center my-3">
                        <FlipCoin :isDisabled="true" :initialSide="props.round.participant.betResult" />
                    </div>
                    <v-card-text class="d-flex justify-center align-center">
                        and paid ${{ props.round.participant.betAmount }} to bet the result will be
                        {{ getFlipResult(props.round.participant.betResult) }}
                    </v-card-text>
                    <v-card-text v-if="props.round.settled && props.round.participant.winAmount > 0"
                        class="d-flex justify-center align-center">
                        <h1>and WIN ${{ props.round.participant.winAmount }} !!!</h1>
                    </v-card-text>
                </v-card>
            </v-container>
            <v-container v-else class="d-flex flex-column">
                <v-card-title class="d-flex justify-center align-center">
                    Do you want to join {{ props.round.roundNumber }} !?
                </v-card-title>
                <v-card-text class="d-flex justify-center align-center">
                    Current Total Prize Amount:
                </v-card-text>
                <h1 class="d-flex justify-center align-center">$ {{ props.round.prizeAmount }}</h1>
                <div class="d-flex justify-center align-center">
                    <FlipCoin @flip="handleFlipEvent" :initialSide="data.joinRoundParam.betFlipResult" :randomFlip="true" />
                    <span>You Bet On {{ getFlipResult(data.joinRoundParam.betFlipResult) }}</span>
                </div>
                <v-card-text class="d-flex justify-center align-center">
                    {{ getFlipCountContent(data.joinRoundParam.flipCount) }}
                </v-card-text>
                <v-card>
                    <v-row class="d-flex align-center">
                        <v-col cols="8" class="pa-0">
                            <v-text-field v-model="data.joinRoundParam.flipCount" label="Flip Count" clearable
                                hide-details type="number"></v-text-field>
                        </v-col>
                        <v-col cols="4">
                            <v-btn color="red" @click="resetFlipCount" height="50" width="100">Clear</v-btn>
                        </v-col>
                        <v-col cols="8" class="pa-0">
                            <v-text-field v-model="data.joinRoundParam.betAmount" label="Bet Amount" clearable
                                hide-details type="number"></v-text-field>
                        </v-col>
                        <v-col cols="4">
                            <v-btn color="red" @click="clickMaxBet" height="50" width="100">Max Bet</v-btn>
                        </v-col>
                    </v-row>
                </v-card>
                <v-btn class="mt-4" color="green" @click="joinRound" block height="100"
                    :disabled="joinRoundBtnDisabled()">
                    {{ getJoinBtnText() }}
                </v-btn>
            </v-container>
        </v-card>
    </v-container>
</template>


<script setup>
import { ref, defineProps } from 'vue';
import api from '@/services/api';
import converter from '@/services/converter';
import FlipCoin from '@/assets/flipCoin/FlipCoin.vue';

const props = defineProps({
    round: {
        type: Object,
        required: true
    },
    loginUser: {
        type: Object,
        required: false
    },
    userWallet: {
        type: Object,
        required: false
    },
    onJoinSuccess: {
        type: Function,
        required: true
    },
});

const data = ref({
    joinRoundParam: {
        flipCount: 0,
        betAmount: null,
        betFlipResult: true,
    },
});

function handleFlipEvent(newState) {
    data.value.joinRoundParam.betFlipResult = newState;
    data.value.joinRoundParam.flipCount++;
}

function getFlipResult(result) {
    return converter.getFlipCoinResultText(result);
}

function getFlipCountContent(flipCount, isParticipantDetail) {
    if (isParticipantDetail) {
        return flipCount > 0 ? `You decided to flip ${flipCount} !` : 'You decided to not to touch it';
    } else {
        return flipCount > 0 ? `You are going to add ${flipCount} count in this round !`
            :
            'You just leave it as it is';
    }
}

function getJoinBtnText() {
    return data.value.joinRoundParam.betAmount && !isSufficientBalance() ? 'Insufficient Balance'
        :
        props.round.participants >= props.round.participantLimit ?
            'This round is full' : 'Join Round';
}

function isSufficientBalance() {
    return props.userWallet && Number(props.userWallet.balance) >= Number(data.value.joinRoundParam.betAmount);
}

function joinRoundBtnDisabled() {
    return !props.loginUser ||
        !isSufficientBalance() ||
        props.round.participants >= props.round.participantLimit ||
        data.value.joinRoundParam.flipCount == null ||
        !data.value.joinRoundParam.betAmount;
}

function resetFlipCount() {
    data.value.joinRoundParam.flipCount = 0;
}

function clickMaxBet() {
    if (props.userWallet) {
        const balance = Number(props.userWallet.balance);
        if (balance > 0) {
            data.value.joinRoundParam.betAmount = balance;
        }
    }
}

async function joinRound() {
    try {
        const request = {
            roundNumber: props.round.roundNumber,
            flipCount: data.value.joinRoundParam.flipCount,
            betFlipResult: data.value.joinRoundParam.betFlipResult,
            betAmount: data.value.joinRoundParam.betAmount,
        };

        const result = await api.post('/user/game/flipCoin/joinRound', request);
        if (result) {
            props.onJoinSuccess();
        }
    } catch (err) {
        console.error(err);
    }
}

</script>