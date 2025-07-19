<template>
    <div class="form__item">
        <BFormInput 
            type="text" 
            v-model="formData.metka" 
            placeholder="Метки (через ;)"
            maxlength="100"
            class="form__item--input"
            :class="{ 'is-invalid': errors.metka }"
            @blur="validateMetka"
            @input="validateMetka"
        />
        <BFormSelect 
            :options="options" 
            value-field="type" 
            text-field="name" 
            v-model="formData.type"
            class="form__item--input" 
            :class="{ 'is-invalid': errors.type }"
            @update:model-value="validateType"
            @input="validateType"
        />
                <BFormInput
        type="text"
        v-model="formData.login"
        placeholder="Логин"
        maxlength="100"
        class="form__item--input"
        :class="[{ 'is-invalid': errors.login }]"
        :style="{ gridColumn: formData.type === 'local' ? '3' : '3 / 5' }"
        @blur="validateLogin"
        @input="validateLogin"
        />
                <BFormInput 
        v-if="formData.type === 'local'" 
        type="password" 
        v-model="formData.password" 
        placeholder="Пароль"
        maxlength="100"
        class="form__item--input"
        :class="{ 'is-invalid': errors.password }"
        style="grid-column: 4"
        @blur="validatePassword"
        @input="validatePassword"
        />
        <BButton
            variant="outline-danger" 
            size="sm" 
            @click="removeAccount"
            title="Удалить аккаунт"
        >
            <i class="bi bi-trash"></i>
        </BButton>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { Account, AccountType, MetkaItem } from '@/stores/accounts'
import { useAccountsStore } from '@/stores/accounts'

interface Props {
    account: Account
}

interface FormData {
    metka: string
    type: AccountType
    login: string
    password: string | null
}

interface Errors {
    metka: boolean
    type: boolean
    login: boolean
    password: boolean
}

interface SelectOption {
    type: AccountType
    name: string
}

const props = defineProps<Props>()
const accountsStore = useAccountsStore()

const formData = ref<FormData>({
    metka: props.account.metka.map(item => item.text).join('; '),
    type: props.account.type || 'local',
    login: props.account.login,
    password: props.account.password
})

const errors = ref<Errors>({
    metka: false,
    type: false,
    login: false,
    password: false
})

const options: SelectOption[] = [
    { type: 'LDAP', name: 'LDAP' },
    { type: 'local', name: 'Локальная' }
]

const parseMetka = (metkaString: string): MetkaItem[] => {
    if (!metkaString.trim()) return []
    return metkaString.split(';').map(item => ({ text: item.trim() })).filter(item => item.text)
}

const validateMetka = (): void => {
    // Метка необязательна, но если заполнена - проверяем длину
    const metkaValue = formData.value.metka.trim()
    errors.value.metka = metkaValue.length > 50
    
    if (!errors.value.metka) {
        saveAccount()
    }
}

const validateType = (): void => {        
    errors.value.type = !formData.value.type;
    
    // Если выбран LDAP, очищаем пароль
    if (formData.value.type === 'LDAP') {
        formData.value.password = null
    }
    
    // Валидируем пароль сразу после изменения типа
    validatePassword()
    
    if (!errors.value.type) {
        saveAccount()
    }
}

const validateLogin = (): void => {
    const loginValue = formData.value.login.trim()
    // Логин обязателен и максимум 100 символов
    errors.value.login = !loginValue || loginValue.length > 100
    if (!errors.value.login) {
        saveAccount()
    }
}

const validatePassword = (): void => {
    // Валидируем пароль только для локальных аккаунтов
    if (formData.value.type === 'local') {
        const passwordValue = formData.value.password?.trim() || ''
        // Пароль обязателен и максимум 100 символов
        errors.value.password = !passwordValue || passwordValue.length > 100
        if (!errors.value.password) {
            saveAccount()
        }
    } else {
        // Для LDAP пароль не требуется
        errors.value.password = false
    }
}

const saveAccount = (): void => {
    const isFormValid = !errors.value.type && !errors.value.login && 
                       (formData.value.type !== 'local' || !errors.value.password);
                       
    
    if (isFormValid) {
        const updatedAccount: Partial<Account> = {
            metka: parseMetka(formData.value.metka),
            type: formData.value.type,
            login: formData.value.login.trim(),
            password: formData.value.type === 'LDAP' ? null : formData.value.password?.trim() || null
        }
        
        accountsStore.updateAccount(props.account.id, updatedAccount);
        accountsStore.saveAccounts();
    }
}

watch(() => props.account, (newAccount) => {
    formData.value = {
        metka: newAccount.metka.map(item => item.text).join('; '),
        type: newAccount.type || 'LDAP',
        login: newAccount.login,
        password: newAccount.password
    }
}, { deep: true })

// Проверяем валидность аккаунта
const isAccountValid = computed(() => {
    const account = props.account
    const loginValid = account.login.trim() !== '' && account.login.length <= 100
    const passwordValid = account.type !== 'local' || (account.password && account.password.trim() !== '' && account.password.length <= 100)
    
    return loginValid && passwordValid
})

const removeAccount = (): void => {
    accountsStore.removeAccount(props.account.id)
}
</script>