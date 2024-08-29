<template>
    <v-container>
        <v-card v-if="props.round" width="380" height="380" class="mx-auto d-flex flex-column">
            <!-- Title Section -->
            <v-card-title v-if="!props.participant" class="d-flex justify-center align-center">
                Would you want to join {{ props.round.roundNumber }} !?
            </v-card-title>
            <v-card-title v-else class="d-flex justify-center align-center">
                Participation Detail of {{ props.round.roundNumber }}
            </v-card-title>

            <!-- Participant Information -->
            <v-card-subtitle v-if="props.participant" class="d-flex justify-center align-center">
                {{ props.participant.traceId }}
            </v-card-subtitle>
            <v-card-text class="d-flex justify-center align-center">
                Current Total Prize Amount:
            </v-card-text>
            <h1 class="d-flex justify-center align-center">{{ props.round.prizeAmount }}</h1>

            <!-- Join Round Section -->
            <v-card v-if="!props.participant" class="mx-auto d-flex flex-column" width="300">
                <v-switch v-model="data.joinRoundParam.flip"
                    :label="data.joinRoundParam.flip ? 'You decide to flip once' : 'You decide to not to touch it'"
                    hide-details inset class="ma-auto d-flex flex-column"></v-switch>
                <v-switch v-model="data.joinRoundParam.betFlipResult"
                    :label="` You Bet On ${getFlipResult(data.joinRoundParam.betFlipResult)}`" hide-details inset
                    class="ma-auto d-flex flex-column"></v-switch>
                <v-text-field class="ma-auto d-flex flex-column" width="200" v-model="data.joinRoundParam.betAmount"
                    label="Bet Amount" clearable></v-text-field>
            </v-card>

            <v-btn v-if="!props.participant" class="rounded-0 ma-auto" color="green" @click="joinRound" block
                width="200" height="30" :disabled="!data.joinRoundParam.betAmount">
                Join Round
            </v-btn>
            <!-- Joined Information -->
            <v-card v-else color="red" height="200">
                <v-card-title class="d-flex justify-center align-center">
                    {{ getFlipContent(props.participant.flip) }}
                </v-card-title>
                <v-spacer></v-spacer>
                <v-card-text class="d-flex justify-center align-center">
                    and paid ${{ props.participant.betAmount }} to bet the result will be
                    {{ getFlipResult(props.participant.betAmount) }}
                </v-card-text>
            </v-card>
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
    participant: {
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
        betAmount: 0,
        betFlipResult: false,
    },
});

function getFlipResult(result) {
    return result ? 'Face' : 'Back';
}

function getFlipContent(flip) {
    return flip ? 'You decided to flip once!' : 'You decided to not to touch it...';
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