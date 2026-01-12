<template>
    <v-app>
        <v-main class="login-main">
            <div class="login-shell">
                <v-card class="login-card" elevation="10">
                    <v-card-text class="login-card-body">
                        <!-- Logo -->
                        <div class="container-logo">
                            <img class="logo-marica" src="../../public/prefeitura-maricá.png" alt="Logo prefeitura maricá">
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
                            </div>

                            <v-btn class="submit" type="submit" block size="large" color="blue" rounded="lg"
                                :loading="loading">
                                Entrar
                            </v-btn>

                            <div class="support">
                                <span>Ainda não tem acesso?</span>
                                <a class="link" href="#" @click.prevent="onContactAdmin">Contate o administrador</a>
                            </div>
                        </v-form>
                    </v-card-text>
                </v-card>

                <div class="footer">
                    <div>© 2024 PREFEITURA DE MARICÁ</div>
                    <div>TODOS OS DIREITOS RESERVADOS.</div>
                </div>
            </div>
        </v-main>
    </v-app>
</template>

<script setup lang="ts">
import { ref } from "vue";

const email = ref("");
const password = ref("");
const showPassword = ref(false);
const loading = ref(false);

async function onSubmit() {
    loading.value = true;
    try {
        // TODO: autenticar (API / Supabase / Firebase / etc.)
        // Exemplo:
        // await auth.login({ email: email.value, password: password.value });
        console.log("login", { email: email.value, password: password.value });
    } finally {
        loading.value = false;
    }
}

function onForgot() {
    // TODO: navegar para /forgot ou abrir modal
    console.log("forgot password");
}

function onContactAdmin() {
    // TODO: navegar para /contato ou abrir modal
    console.log("contact admin");
}
</script>

<style scoped>
/* Fundo e centralização (bem próximo do layout do print) */
.login-main {
    background: #f3f6fb;
    min-height: 100vh;
    display: flex;
    font-family: 'Montserrat';
}

.login-shell {
    width: 100%;
    max-width: 440px;
    margin: 0 auto;
    padding: 18px 14px 28px;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

/* Card principal */
.login-card {
    border-radius: 18px;
    overflow: hidden;
}

.login-card-body {
    padding: 22px 18px 16px;
}

.container-logo {
    display: flex;
    justify-content: center;
}

.logo-marica {
    width: 200px;
}

/* Headline */
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

/* Form */
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

.link {
    font-size: 12.5px;
    color: #2b7bd8;
    text-decoration: none;
    font-weight: 600;
}

.link:hover {
    text-decoration: underline;
}

/* Botão "visibility" como texto, igual ao print */
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

/* Botão Entrar */
.submit {
    margin-top: 6px;
    height: 46px;
    font-weight: 800;
    letter-spacing: 0.3px;
    text-transform: none;
}

/* Texto suporte */
.support {
    margin-top: 2px;
    display: flex;
    justify-content: center;
    gap: 6px;
    font-size: 12.5px;
    color: #6b7892;
}

/* Faixa do "mapa" */
.map-strip {
    margin-top: 16px;
}

.map-image {
    height: 78px;
    border-radius: 12px;
    overflow: hidden;
    position: relative;

    /* Troque por uma imagem real do seu projeto (asset local ou URL). */
    background-image: url("https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=60");
    background-size: cover;
    background-position: center;
    filter: saturate(1.05);
}

.map-caption {
    position: absolute;
    left: 10px;
    bottom: 10px;
    padding: 6px 10px;
    border-radius: 10px;
    font-size: 11px;
    font-weight: 900;
    letter-spacing: 0.6px;
    color: #ffffff;
    background: rgba(3, 18, 43, 0.55);
    backdrop-filter: blur(6px);
}

.footer {
    text-align: center;
    font-size: 11.5px;
    color: #8a94a8;
    line-height: 1.45;
    font-weight: 500;
}
</style>
