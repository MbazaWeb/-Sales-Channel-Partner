import { useEffect, useMemo, useState } from 'react'
import { ThemeContext } from './theme-context.js'

const THEME_STORAGE_KEY = 'scp-theme'

export function ThemeProvider({ children }) {
	const [theme, setTheme] = useState(() => localStorage.getItem(THEME_STORAGE_KEY) ?? 'light')

	useEffect(() => {
		localStorage.setItem(THEME_STORAGE_KEY, theme)
		document.documentElement.classList.toggle('theme-dark', theme === 'dark')
		document.documentElement.style.colorScheme = theme === 'dark' ? 'dark' : 'light'
	}, [theme])

	const value = useMemo(
		() => ({
			theme,
			setTheme,
			toggleTheme: () => setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark')),
		}),
		[theme],
	)

	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}