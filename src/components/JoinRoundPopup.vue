<template>
    <v-container>
        <v-card width="400" height="400" class="mx-auto d-flex flex-column" v-if="props.round">
            <v-card-title v-if="!props.participant" class="d-flex justify-center align-center">Would you want to join {{
                props.round.roundNumber }} !?</v-card-title>
            <v-card-title v-if="props.participant" class="d-flex justify-center align-center">Participation Detail of {{
                props.round.roundNumber }}</v-card-title>
            <v-card-subtitle v-if="props.participant" class="d-flex justify-center align-center">
                {{ props.participant.traceId }}
            </v-card-subtitle>
            <v-card-text class="d-flex justify-center align-center">
                Current Total Prize Amount:
            </v-card-text>
            <h1 class="d-flex justify-center align-center">{{ props.round.prizeAmount }}</h1>
            <v-spacer class="my-3"></v-spacer>
            <!-- joinRound params -->

            <!-- joined information -->
            <v-card color="grey" v-if="props.participant">
                <v-card-title class="d-flex justify-center align-center">
                    {{ getFlipContent(props.participant.flip) }}
                </v-card-title>
                <v-card-text class="d-flex justify-center align-center">
                    and paid ${{ props.participant.betAmount }} to bet the result is
                    {{ getFlipResult(props.participant.betAmount) }}
                </v-card-text>
            </v-card>
            <v-btn v-if="!props.participant" class="rounded-0 mt-auto" color="green" @click="joinRound" block
                width="200" height="200">Join Round</v-btn>
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
            flip: true,
            betFlipResult: true,
            betAmount: '3.00',
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