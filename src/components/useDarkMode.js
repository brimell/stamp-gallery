import { useEffect, useState } from 'react';
export const useDarkMode = () => {
    const [theme, setTheme] = useState('light');
    const [mountedComponent, setMountedComponent] = useState(false)

    const setMode = mode => {
        window.localStorage.setItem('theme', mode)
        setTheme(mode)
    };

    const themeToggler = () => {
        theme === 'light' ? setMode('dark') : setMode('light')
        console.log('theme toggled')
        const localTheme = window.localStorage.getItem('theme');
        setTheme(localTheme)
        setMountedComponent(true)
    };

    useEffect(() => {
        console.log('use effect called')
        const localTheme = window.localStorage.getItem('theme');
        localTheme && setTheme(localTheme)
        setMountedComponent(true)

    }, []);
    return [theme, themeToggler, mountedComponent]
};
