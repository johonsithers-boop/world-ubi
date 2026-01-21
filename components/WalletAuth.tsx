'use client'

import { MiniKit } from '@worldcoin/minikit-js'
import { Button } from './ui/Button'
import { useDictionary } from '@/components/providers/DictionaryProvider'

// Check if running inside World App (silently)
function isInWorldApp(): boolean {
    return typeof window !== 'undefined' && 'WorldApp' in window
}

interface WalletAuthProps {
    lang: string
    onError?: (error: string) => void
    onSuccess?: () => void
}

export function WalletAuth({ lang, onError, onSuccess }: WalletAuthProps) {
    const dictionary = useDictionary()

    const handleAuth = async () => {
        // Silent check - no console errors
        if (!isInWorldApp()) {
            // Demo mode for local development
            if (onSuccess) onSuccess()
            window.location.href = `/${lang}/earn`
            return
        }

        try {
            const { finalPayload } = await MiniKit.commandsAsync.walletAuth({
                nonce: crypto.randomUUID(),
                statement: 'Sign in to World UBI Coin'
            })

            if (finalPayload.status === 'success') {
                // In production, use NextAuth signIn here
                if (onSuccess) onSuccess()
                window.location.href = `/${lang}/earn`
            } else {
                if (onError) onError('Authentication cancelled')
            }
        } catch {
            // Fallback to demo mode
            if (onSuccess) onSuccess()
            window.location.href = `/${lang}/earn`
        }
    }

    return (
        <Button onClick={handleAuth} fullWidth size="lg">
            {dictionary.home.connectButton}
        </Button>
    )
}
