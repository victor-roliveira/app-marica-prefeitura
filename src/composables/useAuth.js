import { ref, computed } from "vue"
import { api } from "../services/api"
import { jwtDecode } from "jwt-decode"

const token = ref(localStorage.getItem("auth_token") || "")
const user = ref(null)

const isAuthenticated = computed(() => Boolean(token.value))

function decodeUser(accessToken) {
    try {
        const decoded = jwtDecode(accessToken)
        return {
            id: decoded.sub,     
            role: decoded.role,  
            ...decoded           
        }
    } catch (error) {
        console.error("Token inválido:", error)
        return null
    }
}

function setSession(accessToken) {
    token.value = accessToken
    localStorage.setItem("auth_token", accessToken)
    user.value = decodeUser(accessToken)
}

function loadSession() {
    const tk = localStorage.getItem("auth_token")

    if (tk) {
        token.value = tk
        const userDecoded = decodeUser(tk)

        if (userDecoded) {
            user.value = userDecoded
        } else {
            logout()
        }
    } else {
        token.value = ""
        user.value = null
    }
}

async function login({ email, password }) {
    const { data } = await api.post("auth/login", { email, password })

    const accessToken = data.token ?? data.accessToken

    if (!accessToken) throw new Error("Token não retornado pela API.");

    setSession(accessToken)
    
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
    
    return { accessToken, user: user.value }
}

function logout() {
    token.value = ""
    user.value = null
    localStorage.removeItem("auth_token")
    
    delete api.defaults.headers.common['Authorization']
}

export function useAuth() {
    if (token.value && !user.value) loadSession();

    return {
        token,
        user,
        isAuthenticated,
        login,
        logout,
        loadSession
    }
}