import axios from 'axios';
const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;

// 創建一個 axios 實例
const api = axios.create({
  baseURL: apiEndpoint,
  timeout: 5000, // 請求超時時間
  headers: {
    'Content-Type': 'application/json',
    // 如果需要，可以在這裡添加其他默認headers
  }
});

// 處理響應
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      // 服務器響應了，但狀態碼不在 2xx 範圍內
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // 請求已經發出，但沒有收到響應
      return Promise.reject('No response received');
    } else {
      // 設置請求時發生了錯誤
      return Promise.reject(error.message);
    }
  }
);

export default {
  // GET 請求
  async get(url, params = {}, headers = {}) {
    try {
      const authHeader = this.getAuthHeader();
      const response = await api.get(url, {
        params,
        headers: { ...authHeader, ...headers }
      });
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  },

  // POST 請求
  async post(url, data = {}, headers = {}) {
    try {
      const authHeader = this.getAuthHeader();
      const response = await api.post(url, data, {
        headers: { ...authHeader, ...headers }
      });
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  },

  // 處理響應
  handleResponse(response) {
    const respCode = response.code;
    const errorCode = response.errorCode;
    if (respCode === 0) {
      return response.data;
    } else {
      if (respCode === 1000 && errorCode === '000006') {
        console.log('invalid token');
        localStorage.removeItem('localStorageUser');
      }
      throw new Error(response.message);
    }
  },

  // 處理錯誤
  handleError(error) {
    console.error('API error:', error);
    throw error;
  },

  // 取得authHeader
  getAuthHeader() {
    const localStorageUser = JSON.parse(localStorage.getItem('localStorageUser'));
    return localStorageUser ? { Authorization: localStorageUser.loginToken } : {};
  }
};