<template>
    <v-container width="400">
        <v-card class="mx-auto" prepend-icon="mdi-account">
            <template v-slot:title>
                <span class="font-weight-black">Login</span>
            </template>
            <template v-slot:subtitle>
                <span>Welcome!</span>
                <v-switch v-model="data.isRegister" color="green" label="Register" hide-details
                    class="ma-5 position-absolute top-0 right-0"></v-switch>
            </template>
            <v-card-text v-if="data.greetings" class="d-flex justify-center align-center">
                {{ data.greetings }}
            </v-card-text>
            <v-card-text>
                <v-sheet class="mx-auto" width="300">
                    <v-form @submit.prevent>
                        <v-text-field v-model="data.inputAccount" :rules="data.accountRules"
                            label="account"></v-text-field>
                        <v-text-field v-model="data.inputPassword" :rules="data.passwordRules"
                            @click:append-inner="data.showPassword = !data.showPassword"
                            :append-inner-icon="data.showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="data.showPassword ? 'text' : 'password'" label="password"></v-text-field>
                        <v-btn color="primary" type="submit" @click="onMainBtnClick" block class="my-3" height="80"
                            :disabled="!isLegalLoginForm() || data.autoLoginProcess">{{ getMainBtnLabel() }}</v-btn>
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
    isRegister: false,
    autoLoginProcess: false,
    inputAccount: '',
    inputPassword: '',
    showPassword: false,
    accountRules: inputTextRules.accountRules,
    passwordRules: inputTextRules.passwordRules,
});

function getMainBtnLabel() {
    return data.value.isRegister ? "Register" : "Login";
}

function isLegalLoginForm() {
    const { inputAccount, inputPassword, accountRules, passwordRules } = data.value;
    const isAccountValid = accountRules.every(rule => rule(inputAccount) === true);
    const isPasswordValid = passwordRules.every(rule => rule(inputPassword) === true);
    return isAccountValid && isPasswordValid;
}

function getMainBtnUrl() {
    return data.value.isRegister ? "/user/create" : "/user/createToken";
}

async function onMainBtnClick() {
    try {
        const inputAccount = data.value.inputAccount;
        const inputPassword = data.value.inputPassword;
        const result = await api.post(getMainBtnUrl(), { account: inputAccount, password: inputPassword });

        if (result) {
            // register success, auto call login
            if (data.value.isRegister) {
                data.value.isRegister = false;
                data.value.autoLoginProcess = true;
                onMainBtnClick();
            } else {
                const token = result ? result.token : null;
                const tokenExpiredTime = result ? result.expiredTime : null;
                if (token) {
                    localStorage.setItem('localStorageUser', JSON.stringify({ account: inputAccount, loginToken: token, loginTokenExpiredTime: tokenExpiredTime }));
                }
            }

            props.onLoginSuccess();
        } else {
            data.value.autoLoginProcess = false;
        }

    } catch (err) {
        console.error(err);

        data.value.greetings = 'Login Failed!';
        data.value.inputPassword = '';
    }
}

</script>