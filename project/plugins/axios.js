import Vue from "vue";
import axios from "axios";

let service = axios.create({
    timeout:5000,
    // 前缀
    baseURL:'/api'
})

// @todo拦截器 管理token

Vue.prototype.$http = service