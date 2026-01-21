'use client'

import { useState, useEffect, useCallback } from 'react'
import { MiniKit } from '@worldcoin/minikit-js'

// Silent check for MiniKit - avoids console.error from the SDK
function isMiniKitAvailable(): boolean {
    try {
        // Check if we're in World App by looking for the bridge
        return typeof window !== 'undefined' &&
            'WorldApp' in window ||
            MiniKit.isInstalled()
    } catch {
        return false
    }
}

export function useWallet() {
    const [walletAddress, setWalletAddress] = useState<string | null>(null)
    const [tokenBalance, setTokenBalance] = useState<string>('0')
    const [isConnecting, setIsConnecting] = useState(false)
    const [isConnected, setIsConnected] = useState(false)
    const [isDemoMode, setIsDemoMode] = useState(false)

    const connect = useCallback(async () => {
        // Check silently first
        if (typeof window === 'undefined' || !('WorldApp' in window)) {
            // Demo mode for local development - no console warnings
            setWalletAddress('0x1234...demo')
            setTokenBalance('100.00')
            setIsConnected(true)
            setIsDemoMode(true)
            return
        }

        setIsConnecting(true)
        try {
            const { finalPayload } = await MiniKit.commandsAsync.walletAuth({
                nonce: crypto.randomUUID(),
                statement: 'Sign in to World UBI Coin'
            })

            if (finalPayload.status === 'success') {
                setWalletAddress(finalPayload.address)
                setIsConnected(true)
                setTokenBalance('0.00')
            }
        } catch (error) {
            // Fallback to demo mode on error
            setWalletAddress('0x1234...demo')
            setTokenBalance('100.00')
            setIsConnected(true)
            setIsDemoMode(true)
        } finally {
            setIsConnecting(false)
        }
    }, [])

    const disconnect = useCallback(() => {
        setWalletAddress(null)
        setTokenBalance('0')
        setIsConnected(false)
        setIsDemoMode(false)
    }, [])

    // Check connection on mount - silently, no errors
    useEffect(() => {
        // Only check if we're definitely in World App
        if (typeof window !== 'undefined' && 'WorldApp' in window) {
            try {
                const user = MiniKit.user
                if (user?.walletAddress) {
                    setWalletAddress(user.walletAddress)
                    setIsConnected(true)
                }
            } catch {
                // Silently ignore - not in World App
            }
        }
    }, [])

    return {
        walletAddress,
        tokenBalance,
        isConnecting,
        isConnected,
        isDemoMode,
        connect,
        disconnect
    }
}
