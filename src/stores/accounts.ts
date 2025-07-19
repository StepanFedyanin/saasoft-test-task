import { ref } from 'vue'
import { defineStore } from 'pinia'

export interface MetkaItem {
    text: string
}

export interface Account {
    id: number
    metka: MetkaItem[]
    type: AccountType
    login: string
    password: string | null
}

export type AccountType = 'local' | 'LDAP'

export interface NewAccount {
    metka: MetkaItem[]
    type: AccountType
    login: string
    password: string | null
    isAdded: boolean
}

export const useAccountsStore = defineStore('accounts', () => {
    const loadAccounts = (): Account[] => {
        const saved = localStorage.getItem('accounts')
        if (saved) {
            try {
                return JSON.parse(saved)
            } catch {
                return []
            }
        }
        return []
    }

    const accounts = ref<Account[]>(loadAccounts())


    const saveAccounts = (): void => {
        localStorage.setItem('accounts', JSON.stringify(accounts.value))
    }

    const addAccount = (account: Omit<Account, 'id'>) => {
        const newId = Math.max(...accounts.value.map(a => a.id), 0) + 1
        accounts.value.push({
            ...account,
            id: newId
        })
        saveAccounts()
    }

    const removeAccount = (id: number) => {
        const index = accounts.value.findIndex(account => account.id === id)
        if (index > -1) {
            accounts.value.splice(index, 1)
            saveAccounts()
        }
    }

    const updateAccount = (id: number, updates: Partial<Account>) => {
        const account = accounts.value.find(a => a.id === id)
        if (account) {
            Object.assign(account, updates)
            saveAccounts()
        }
    }

    return {
        accounts,
        saveAccounts,
        addAccount,
        removeAccount,
        updateAccount
    }
}) 