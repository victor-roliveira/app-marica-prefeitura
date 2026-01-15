import { ref, computed } from "vue"
import { api } from "../services/api"

const token = ref(localStorage.getItem("auth_token") || "")
const user = ref(null)

const isAuthenticated = computed(() => Boolean(token.value))

function setSession({ accessToken, user: userPayload }) {
    token.value = accessToken
    user.value = userPayload ?? null
    localStorage.setItem("auth_token", accessToken)
    if (userPayload) localStorage.setItem("auth_user", JSON.stringify(userPayload))
}

function loadSession() {
    const tk = localStorage.getItem("auth_token")
    const us = localStorage.getItem("auth_user")
    token.value = tk || ""
    user.value = us ? JSON.parse(us) : null
}

async function login({ email, password }) {
    const { data } = await api.post("/login", { email, password })

    const accessToken = data.token ?? data.accessToken
    const userPayload = data.user ?? null

    if (!accessToken) throw new Error("Token não retornado pela API.");

    setSession({ accessToken, user: userPayload })
    return { accessToken, user: userPayload }
}

function logout() {
    token.value = ""
    user.value = null
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user_token")
}

export function useAuth() {
    if (!token.value) loadSession();

    return {
        token,
        user,
        isAuthenticated,
        login,
        logout,
        loadSession
    }
}