<template>
    <v-container width="400">
        <v-card class="mx-auto" prepend-icon="mdi-account">
            <template v-slot:title>
                <span class="font-weight-black">Login</span>
            </template>
            <template v-slot:subtitle>
                <span>Welcome!</span>
            </template>

            <v-card-text>
                <v-sheet class="mx-auto" width="300">
                    <v-form @submit.prevent>
                        <v-text-field v-model="data.inputAccount" :rules="data.accountRules"
                            label="account"></v-text-field>
                        <v-text-field v-model="data.inputPassword" :rules="data.passwordRules"
                            @click:append-inner="data.showPassword = !data.showPassword"
                            :append-inner-icon="data.showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="data.showPassword ? 'text' : 'password'" label="password"></v-text-field>
                        <v-btn color="primary" type="submit" @click="login" block class="my-3" height="80"
                            :disabled="!isLegalLoginForm()">Login</v-btn>
                        <v-btn color="grey" @click="props.onCancelClick" block class="my-3">Cancel</v-btn>
                    </v-form>
                </v-sheet>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script setup>
import { ref, defineProps } from 'vue';
import api from '@/services/api';
import inputTextRules from '@/services/inputTextRules';
import converter from '@/services/converter';

const props = defineProps({
    onCancelClick: {
        type: Function,
        required: true
    },
    onLoginSuccess: {
        type: Function,
        required: true
    },
});

const data = ref({
    greetings: null,
    inputAccount: '',
    inputPassword: '',
    showPassword: false,
    accountRules: inputTextRules.accountRules,
    passwordRules: inputTextRules.passwordRules,
});

function isLegalLoginForm() {
    const { inputAccount, inputPassword, accountRules, passwordRules } = data.value;
    const isAccountValid = accountRules.every(rule => rule(inputAccount) === true);
    const isPasswordValid = passwordRules.every(rule => rule(inputPassword) === true);
    return isAccountValid && isPasswordValid;
}

async function login() {
    try {
        const inputAccount = data.value.inputAccount;
        const inputPassword = data.value.inputPassword;
        const tokenInfo = await api.post('/user/createToken', { account: inputAccount, password: inputPassword });
        const token = tokenInfo ? tokenInfo.token : null;
        const tokenExpiredTime = tokenInfo ? tokenInfo.expiredTime : null;
        if (token) {
            localStorage.setItem('localStorageUser', JSON.stringify({ account: inputAccount, loginToken: token, loginTokenExpiredTime: tokenExpiredTime }));
            props.onLoginSuccess();
        }
    } catch (err) {
        console.error(err);

        data.value.greetings = 'Login Failed!';
        data.value.inputPassword = '';
    }
}

</script>