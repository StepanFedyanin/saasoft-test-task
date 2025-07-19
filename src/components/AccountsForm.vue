<template>
    <div class="form">
        <div class="form__header">
            <h2 class="h3">Учетные записи</h2>
            <BButton variant="outline-primary" size="sm" @click="addAccount" :disabled="!canAddAccount">
                <i class="bi bi-plus me-1"></i>
                {{ canAddAccount ? 'Добавить аккаунт' : 'Заполните все аккаунты' }}
            </BButton>
        </div>
        <div class="form__hint h5">
            <i class="bi bi-info-circle me-1"></i>
            Для указания меток для одной пары логин/пароль используйте разделитель ;
        </div>
        <form class="form__content">
            <div class="form__labels">
                <p class="form__label">Метки</p>
                <p class="form__label">Тип значения *</p>
                <p class="form__label">Логин *</p>
                <p class="form__label">Пароль (если есть)*</p>
            </div>
            <AccountFormItem v-for="account in accountsStore.accounts" :key="account.id" :account="account" />
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import AccountFormItem from '@/components/AccountFormItem.vue'
import { useAccountsStore } from '@/stores/accounts'
import type { MetkaItem } from '@/stores/accounts'

const accountsStore = useAccountsStore()

const isLastAccountValid = ref(false)

const addAccount = (): void => {
    accountsStore.addAccount({
        metka: [] as MetkaItem[],
        type: 'local',
        login: '',
        password: ''
    })
}

const canAddAccount = computed(() => {
    const accounts = accountsStore.accounts
    if (accounts.length === 0) return true

    // Проверяем, что ВСЕ аккаунты валидны
    return accounts.every(account => {
        const hasLogin = account.login.trim() !== '' && account.login.length <= 100
        const hasPassword = account.type !== 'local' || (account.password && account.password.trim() !== '' && account.password.length <= 100)

        return hasLogin && hasPassword
    })
})
</script>
