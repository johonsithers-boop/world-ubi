'use client'

import { MiniKit } from '@worldcoin/minikit-js'
import { ReactNode, useEffect, useState } from 'react'

export function MiniKitProvider({ children }: { children: ReactNode }) {
    const [isInitialized, setIsInitialized] = useState(false)

    useEffect(() => {
        // Only initialize if we're definitely in World App
        if (typeof window !== 'undefined' && 'WorldApp' in window) {
            const appId = process.env.NEXT_PUBLIC_APP_ID
            if (appId) {
                try {
                    MiniKit.install(appId)
                } catch {
                    // Silently ignore installation errors
                }
            }
        }
        setIsInitialized(true)
    }, [])

    // Always render children - demo mode works without MiniKit
    return <>{children}</>
}
