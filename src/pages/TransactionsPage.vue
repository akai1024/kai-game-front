<template>
    <v-card max-width="600" class="mx-auto">
        <v-card-title class="d-flex align-center">
            <v-icon>mdi-wallet</v-icon>
            <span class="mx-5">Transactions</span>
            <v-spacer></v-spacer>
            <v-chip>{{ `Total Records: ${data.totalItems}` }}</v-chip>
        </v-card-title>

        <ScrollTrigger :topTriggerMethod="scrollTop" :bottomTriggerMethod="scrollPage">
            <v-list density="compact" class="pa-0" width="400">
                <v-list-item v-for="(tx, i) in data.transactions" :key="i" :value="tx" color="primary">
                    <v-card :color="getTxColor(tx)" class="my-1 w-100">
                        <v-card-title>
                            <v-row no-gutters align="center">
                                <v-col cols="auto">
                                    <v-chip>
                                        <h3>{{ converter.moneyChangeTypeText(tx.changeType) }}</h3>
                                    </v-chip>
                                </v-col>
                                <v-spacer></v-spacer>
                                <v-col cols="auto">
                                    <v-chip variant="outlined" class="px-3">
                                        <h3>{{ getMoneyChangeAmountText(tx) }}</h3>
                                    </v-chip>
                                </v-col>
                            </v-row>
                        </v-card-title>

                        <v-card-subtitle>
                            <p class="mb-0">Trace Id: {{ tx.id }}</p>
                        </v-card-subtitle>

                        <v-card class="mt-2">
                            <v-card-text class="bg-surface-light pt-3">
                                <p class="mb-1">Change Time: {{ getDateText(tx.createTime) }}</p>
                                <p class="mb-1">Before Balance: {{ tx.beforeBalance }}</p>
                                <p class="mb-0">After Balance: {{ tx.afterBalance }}</p>
                            </v-card-text>
                        </v-card>
                    </v-card>
                </v-list-item>
            </v-list>
        </ScrollTrigger>
    </v-card>
</template>

<script setup>
import ScrollTrigger from '@/components/ScrollTrigger.vue';
import api from '@/services/api';
import converter from '@/services/converter';
import { defineProps, ref, watch } from 'vue';

const props = defineProps({
    loginUser: {
        type: Object,
        required: false
    },

    onLoginUserChange: {
        type: Function,
        required: false
    },
});

// 監聽 loginUser 的變化
watch(() => props.loginUser, (loginUser) => {
    // 當 loginUser 變化時，跳回首頁
    if (props.onLoginUserChange) {
        props.onLoginUserChange();
    }
});

const data = ref({
    loading: true,
    itemsPerPage: 0,
    page: 1,
    totalItems: 0,
    transactions: [],
});

searchTransactions(true);

function getDateText(timestamp) {
    return converter.transferFromTimestamp(timestamp);
}

function getTxColor(tx) {
    return tx.add ? 'green' : 'red';
}

function getMoneyChangeAmountText(tx) {
    const prefix = tx.add ? '+' : '-';
    return `${prefix} ${tx.changeAmount}`;
}

async function scrollTop() {
    if (data.value.loading) {
        return;
    }
    searchTransactions(true);
}

async function scrollPage() {
    if (data.value.loading) {
        return;
    }
    searchTransactions(false);
}

async function searchTransactions(isRefreshTop) {
    data.value.loading = true;

    try {
        let request;
        let skipResultSize = 0;
        if (isRefreshTop) {
            request = {
                pageNo: 1,
                pageSize: data.value.itemsPerPage,
            };
        } else {
            const curRoundSize = data.value.transactions.length;
            const pageSize = data.value.itemsPerPage;
            const curPage = Math.floor(curRoundSize / pageSize) + 1;
            skipResultSize = curRoundSize % pageSize;
            request = {
                pageNo: curPage,
                pageSize: pageSize,
            };
        }

        request.userId = props.loginUser.userId;

        const result = await api.post('/user/money/findMoneyChange', request);
        if (result) {
            if (isRefreshTop) {
                data.value.transactions = result.content;
            } else {
                if (result.content.length > 0) {
                    const newAddedContent = result.content.slice(skipResultSize);
                    data.value.transactions.push(...newAddedContent);
                    data.value.itemsPerPage = result.pageable.pageSize;
                }
            }
            data.value.totalItems = result.totalElements;
        }
    } catch (err) {
        console.error(err);
    }

    data.value.loading = false;
}

</script>