<template>
    <v-container>
        <v-card width="400" height="400" class="mx-auto d-flex flex-column">
            <v-card-title class="d-flex justify-center align-center">Would you want to join {{ props.round.roundNumber }} !?</v-card-title>
            <v-card-text color="grey" class="d-flex justify-center align-center">
                Current Total Prize Amount:
            </v-card-text>
            <h1 class="d-flex justify-center align-center">{{ props.round.prizeAmount }}</h1>
            <v-spacer class="my-3"></v-spacer>
            <v-btn class="rounded-0 mt-auto" color="green" @click="joinRound" block width="200"
                height="200">Join Round</v-btn>
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

});

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