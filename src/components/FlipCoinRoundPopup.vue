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
                <h1 class="d-flex justify-center align-center">{{ props.round.prizeAmount }}</h1>
                <v-spacer class="my-5"></v-spacer>
                <v-card color="secondary" class="my-1">
                    <v-card-title class="d-flex justify-center align-center">
                        {{ getFlipContent(props.round.participant.flip, true) }}
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
                <h1 class="d-flex justify-center align-center">{{ props.round.prizeAmount }}</h1>
                <v-checkbox v-model="data.joinRoundParam.flip" :label="getFlipContent(data.joinRoundParam.flip, false)"
                    class="ma-auto d-flex flex-column" hide-details></v-checkbox>
                <div class="d-flex justify-center align-center">
                    <FlipCoin @flip="handleFlipEvent" :initialSide="data.joinRoundParam.betFlipResult" />
                    <span>You Bet On {{ getFlipResult(data.joinRoundParam.betFlipResult) }}</span>
                </div>
                <v-row class="my-1 d-flex align-center">
                    <v-col cols="8" class="pa-4">
                        <v-text-field v-model="data.joinRoundParam.betAmount" label="Bet Amount" clearable
                            hide-details></v-text-field>
                    </v-col>
                    <v-col cols="4" class="pa-1">
                        <v-btn color="red" @click="clickMaxBet" height="50">Max Bet</v-btn>
                    </v-col>
                </v-row>
                <v-btn color="green" @click="joinRound" block height="100" :disabled="joinRoundBtnDisabled()">
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
        flip: false,
        betAmount: null,
        betFlipResult: true,
    },
});

function handleFlipEvent(newState) {
    data.value.joinRoundParam.betFlipResult = newState;
}

function getFlipResult(result) {
    return converter.getFlipCoinResultText(result);
}

function getFlipContent(flip, isParticipantDetail) {
    if (isParticipantDetail) {
        return flip ? 'You decided to flip once !' : 'You decided to not to touch it';
    } else {
        return flip ? 'Flip once in this round !' : 'Just leave it as it is';
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
        !data.value.joinRoundParam.betAmount;
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
            flip: data.value.joinRoundParam.flip,
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