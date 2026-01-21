import { getDictionary } from '@/lib/dictionaries'
import { DictionaryProvider } from '@/components/providers/DictionaryProvider'

export async function generateStaticParams() {
    return [{ lang: 'en' }, { lang: 'es' }]
}

export default async function LangLayout({
    children,
    params
}: {
    children: React.ReactNode
    params: Promise<{ lang: string }>
}) {
    const { lang } = await params
    const dictionary = await getDictionary(lang)

    return (
        <DictionaryProvider dictionary={dictionary}>
            {children}
        </DictionaryProvider>
    )
}
