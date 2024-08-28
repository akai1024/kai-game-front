<template>
    <v-app>
      <v-main>
        <v-container width="600">
          <v-card title="Flip Coin">
            <v-list density="compact">
              <v-list-subheader>Total Rounds: {{ data.flipCoinRoundsTotal }}</v-list-subheader>
              <v-list-item v-for="(round, i) in data.flipCoinRounds" :key="i" :value="round" color="primary">
                <template v-slot:prepend>
                  <v-card :title="round.roundNumber" width="300">
                    <v-card-text>Prize Amont: {{ round.prizeAmount }}</v-card-text>
                    <v-card-text>Participants: {{ round.participants }} / {{ round.participantLimit }}</v-card-text>
                  </v-card>
                </template>
              </v-list-item>
            </v-list>
          </v-card>
        </v-container>
      </v-main>
    </v-app>
  </template>
  
  <script setup>
  import api from '@/services/api';
  import { ref } from 'vue';
  
  const data = ref({
    flipCoinRoundsLoading: false,
    flipCoinRoundsCurPage: 1,
    flipCoinRoundsPageSize: 10,
    flipCoinRoundsTotal: 0,
    flipCoinRounds: [],
  });
  
  searchFlipCoinRounds();
  
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