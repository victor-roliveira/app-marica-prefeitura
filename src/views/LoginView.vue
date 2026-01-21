<template>
    <v-app>
        <v-main class="login-main">
            <div class="login-shell">
                <v-card class="login-card" elevation="2">
                    <v-card-text class="login-card-body">
                        <!-- Logo -->
                        <div class="container-logo">
                            <img class="logo-marica" src="../../public/prefeitura-maricá.png"
                                alt="Logo prefeitura maricá">
                        </div>

                        <!-- Title -->
                        <div class="headline">
                            <h1 class="title">Projetos Maricá</h1>
                            <p class="subtitle">Painel de Acompanhamento Executivo</p>
                        </div>

                        <!-- Form -->
                        <v-form @submit.prevent="onSubmit" class="form">
                            <div class="field">
                                <div class="label">E-mail</div>
                                <v-text-field v-model="email" placeholder="exemplo@marica.rj.gov.br" variant="outlined"
                                    density="comfortable" rounded="lg" hide-details autocomplete="email" />
                            </div>

                            <div class="field">
                                <div class="label-row">
                                    <div class="label">Senha</div>
                                </div>

                                <v-text-field v-model="password" :type="showPassword ? 'text' : 'password'"
                                    placeholder="Digite sua senha" variant="outlined" density="comfortable" rounded="lg"
                                    hide-details autocomplete="current-password">
                                    <template #append-inner>
                                        <v-btn variant="text" class="visibility-btn"
                                            @click="showPassword = !showPassword">
                                            <v-icon class="visibility-text">mdi-eye</v-icon>
                                        </v-btn>
                                    </template>
                                </v-text-field>
                                <p v-if="error" class="error-message">{{ error }}</p>
                            </div>

                            <v-btn class="submit" :disabled="loading" type="submit" block size="large" color="red"
                                rounded="lg" :loading="loading">
                                {{ loading ? "Entrando..." : "Entrar" }}
                            </v-btn>

                            <div class="support">
                                <span>Ainda não tem acesso?</span>

                                <a class="link" :href="gmailLink" target="_blank" rel="noopener">
                                    Contate o administrador
                                </a>
                            </div>

                        </v-form>
                    </v-card-text>
                </v-card>

                <footer class="footer">
                    <div>© 2024 PREFEITURA DE MARICÁ</div>
                    <div>TODOS OS DIREITOS RESERVADOS.</div>
                </footer>
            </div>
        </v-main>
    </v-app>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "../composables/useAuth"
import axios from "axios";

const email = ref("");
const password = ref("");
const showPassword = ref(false);
const loading = ref(false);
const error = ref("")

const router = useRouter()
const { login } = useAuth()

async function onSubmit() {
    error.value = ""
    loading.value = true

    try {
        await login({ email: email.value, password: password.value });
        router.replace({ name: "projetos-mapa" });
    } catch (e: unknown) {
        if (axios.isAxiosError(e)) {
            const apiMsg =
                (e.response?.data as any)?.message ||
                (e.response?.data as any)?.error ||
                e.message;

            error.value = apiMsg || "Falha no login.";
        } else if (e instanceof Error) {
            error.value = e.message || "Falha no login.";
        } else {
            error.value = "Falha no login.";
        }
    } finally {
        loading.value = false;
    }
}

const ADMIN_EMAIL = "victor.oliveira@quantaconsultoria.com";

const gmailLink = computed(() => {
    const to = encodeURIComponent(ADMIN_EMAIL);

    const subject = encodeURIComponent(
        "Solicitação de acesso – Projetos Maricá"
    );

    const body = encodeURIComponent(
        `Olá,

        Gostaria de solicitar acesso ao sistema "Projetos Maricá".

        Nome completo:
        Email desejado:
        Setor:

        Obrigado.`
    );

    return `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${subject}&body=${body}`;
});

</script>

<style scoped>
.login-main {
    overflow: hidden;
    background: #f3f6fb;
    display: flex;
    font-family: 'Montserrat';
}

.login-shell {
    height: 600px;
    width: 100%;
    max-width: 440px;
    margin: 0 auto;
    padding: 12px 14px 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.login-card {
    flex: 1;
    display: flex;
    flex-direction: column;
    border-radius: 18px;
    overflow: hidden;
    margin-top: 30px;
}

.login-card-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 18px 18px 14px;
    overflow: hidden;
}

.container-logo {
    display: flex;
    justify-content: center;
}

.logo-marica {
    width: 200px;
}

.headline {
    text-align: center;
    margin: 14px 0 8px;
}

.title {
    margin: 0;
    font-size: 26px;
    font-weight: 800;
    color: #0e1730;
}

.subtitle {
    margin: 6px 0 0;
    font-size: 13px;
    color: #63708a;
}

.form {
    margin-top: 14px;
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.field .label {
    font-size: 13px;
    color: #1c2a44;
    margin-bottom: 6px;
    font-weight: 600;
}

.label-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 6px;
}

.error-message {
    color: red;
    font-size: 10px;
    font-weight: 600;
    margin-top: 5px;
}

.link {
    font-size: 12.5px;
    color: orangered;
    text-decoration: none;
    font-weight: 600;
}

.link:hover {
    text-decoration: underline;
}

.visibility-btn {
    min-width: 0;
    padding: 0 2px;
}

.visibility-text {
    font-size: 12.5px;
    color: #6b7892;
    font-weight: 700;
    letter-spacing: 0.4px;
    padding: 10px 20px;
}

.submit {
    margin-top: 6px;
    height: 46px;
    font-weight: 800;
    letter-spacing: 0.3px;
    text-transform: none;
    font-weight: 500;
}

.support {
    margin-top: 2px;
    display: flex;
    justify-content: center;
    gap: 6px;
    font-size: 12.5px;
    color: #6b7892;
}

.footer {
    flex-shrink: 0;
    text-align: center;
    font-size: 11.5px;
    color: #8a94a8;
    line-height: 1.45;
    font-weight: 500;
    padding: 4px 0 2px;
}
</style>
