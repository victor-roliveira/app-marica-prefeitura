import { ref, computed } from "vue"
import { api } from "../services/api"
import { jwtDecode } from "jwt-decode"

const token = ref(localStorage.getItem("auth_token") || "")
const user = ref(null)

const isAuthenticated = computed(() => Boolean(token.value))

function decodeUser(accessToken) {
    try {
        const decoded = jwtDecode(accessToken)

        // Mapeia os campos do seu JWT (sub, role) para o objeto user
        return {
            id: decoded.sub,     // 'sub' é o padrão JWT para ID
            role: decoded.role,  // 'ADMIN' ou 'USER'
            ...decoded           // Outros dados que virem no payload
        }
    } catch (error) {
        console.error("Token inválido:", error)
        return null
    }
}

function setSession(accessToken) {
    token.value = accessToken
    localStorage.setItem("auth_token", accessToken)

    // Decodifica o token para preencher o user.value
    // NADA é salvo no localStorage como 'auth_user'
    user.value = decodeUser(accessToken)
}

function loadSession() {
    const tk = localStorage.getItem("auth_token")

    if (tk) {
        token.value = tk
        // Tenta recuperar o usuário decodificando o token salvo
        const userDecoded = decodeUser(tk)

        if (userDecoded) {
            user.value = userDecoded
        } else {
            // Se o token estiver corrompido no storage, faz logout
            logout()
        }
    } else {
        token.value = ""
        user.value = null
    }
}

async function login({ email, password }) {
    const { data } = await api.post("auth/login", { email, password })

    // A API pode retornar só o token, pois o user está dentro dele
    const accessToken = data.token ?? data.accessToken

    if (!accessToken) throw new Error("Token não retornado pela API.");

    setSession(accessToken)
    
    // Configura o header do axios para as próximas chamadas
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
    
    return { accessToken, user: user.value }
}

function logout() {
    token.value = ""
    user.value = null
    localStorage.removeItem("auth_token")
    
    // Removemos o header do axios ao sair
    delete api.defaults.headers.common['Authorization']
}

export function useAuth() {
    // Carrega a sessão apenas se tiver token mas não tiver user (ex: F5 na página)
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