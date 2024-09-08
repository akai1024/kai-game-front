import api from "./api";

export default {
    async getConfig(configKey) {
        return await api.get(`/user/common/getConfig?configType=${configKey}`);
    },
}