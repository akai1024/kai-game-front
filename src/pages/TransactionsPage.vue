<template>
    <v-card max-width="600">
        <v-card-title class="d-flex align-center">
            <v-icon>mdi-wallet</v-icon>
            <span class="mx-5">Transactions</span>
            <v-spacer></v-spacer>
            <v-chip>{{ `Total Records: ${data.totalItems}` }}</v-chip>
        </v-card-title>

        <ScrollTrigger :topTriggerMethod="scrollTop" :bottomTriggerMethod="scrollPage">
            <v-list density="compact" width="400" class="pa-0">
                <v-list-item v-for="(tx, i) in data.transactions" :key="i" :value="tx" color="primary"
                    class="d-flex justify-center">
                    <v-card class="my-1" width="368" :color="getTxColor(tx)">
                        <v-card-title>
                            <v-row>
                                <v-col>
                                    <v-chip>
                                        <h2>{{ converter.moneyChangeTypeText(tx.changeType) }}</h2>
                                    </v-chip>
                                </v-col>
                                <v-col class="d-flex flex-row-reverse pa-4">
                                    <v-chip variant="outlined px-3">
                                        <h1>{{ getMoneyChangeAmountText(tx) }}</h1>
                                    </v-chip>
                                </v-col>
                            </v-row>
                        </v-card-title>
                        <v-card-subtitle>
                            <p class="mr-3">Trace Id: {{ tx.id }}</p>
                        </v-card-subtitle>
                        <v-card class="mt-2">
                            <v-card-text class="bg-surface-light pt-3">
                                <p>Change Time: {{ getDateText(tx.createTime) }}</p>
                                <p>Before Balance: {{ tx.beforeBalance }}</p>
                                <p>After Balance: {{ tx.afterBalance }}</p>
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