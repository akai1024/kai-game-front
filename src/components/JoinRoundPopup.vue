<template>
    <v-container class="pa-0">
        <v-card v-if="props.round" width="380">
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
                        {{ getFlipContent(props.round.participant.flip) }}
                    </v-card-title>
                    <v-card-text class="d-flex justify-center align-center">
                        and paid ${{ props.round.participant.betAmount }} to bet the result will be
                        {{ getFlipResult(props.round.participant.betAmount) }}
                    </v-card-text>
                    <v-card-text v-if="props.round.settled && props.round.participant.winAmount > 0"
                        class="d-flex justify-center align-center">
                        <h1>and WIN {{ props.round.participant.winAmount }} !!!</h1>
                    </v-card-text>
                </v-card>
            </v-container>
            <v-container v-else>
                <v-card-title class="d-flex justify-center align-center">
                    Do you want to join {{ props.round.roundNumber }} !?
                </v-card-title>
                <v-card-text class="d-flex justify-center align-center">
                    Current Total Prize Amount:
                </v-card-text>
                <h1 class="d-flex justify-center align-center my-3">{{ props.round.prizeAmount }}</h1>
                <v-spacer class="my-5"></v-spacer>
                <v-card class="my-1 d-flex flex-column">
                    <v-switch v-model="data.joinRoundParam.flip"
                        :label="data.joinRoundParam.flip ? 'You decide to flip once' : 'You decide to not to touch it'"
                        hide-details inset class="ma-auto d-flex flex-column"></v-switch>
                    <v-switch v-model="data.joinRoundParam.betFlipResult"
                        :label="` You Bet On ${getFlipResult(data.joinRoundParam.betFlipResult)}`" hide-details inset
                        class="ma-auto d-flex flex-column"></v-switch>
                    <v-text-field class="ma-auto d-flex flex-column" width="200" v-model="data.joinRoundParam.betAmount"
                        label="Bet Amount" clearable></v-text-field>
                </v-card>
                <v-btn color="green" @click="joinRound" block height="100" :disabled="joinRoundBtnDisabled()">
                    {{ getJoinBtnText() }}
                </v-btn>
            </v-container>
        </v-card>
    </v-container>
</template>


<script setup>
import { ref } from 'vue';
import api from '@/services/api';

const props = defineProps({
    round: {
        type: Object,
        required: true
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
        betFlipResult: false,
    },
});

function getFlipResult(result) {
    return result ? 'Face' : 'Back';
}

function getFlipContent(flip) {
    return flip ? 'You decided to flip once!' : 'You decided to not to touch it';
}

function getJoinBtnText() {
    return props.round.participants >= props.round.participantLimit ?
        'This round is full' : 'Join Round';
}

function joinRoundBtnDisabled() {
    return props.round.participants >= props.round.participantLimit || !data.value.joinRoundParam.betAmount;
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