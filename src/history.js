/**
 * @name createHistory
 * @description 
 *   This function is called to create a new instsance of history and expose methods for
 *   listening to and pushing changes to
 * @returns Object - {push, listen, goBack}
 *   This function returns an object with 3 functions on it for history related features.
 */
export const createHistory = () => {
    const listeners = [];
    const browserSupportsHistory = () => window.history && 'pushState' in window.history;
    const listen = cb => listeners.push(cb);
    const goBack = () => browserSupportsHistory() && window.history.go(-1);
    
    const push = pathname => {
        browserSupportsHistory() ? window.history.pushState({ pathname }, '', pathname) : window.location.href = `${window.location.origin}${pathname}`;
        listeners.forEach(callback => callback(pathname))
    }

    const redirect = pathname => {
        if (browserSupportsHistory() && pathname) {
            window.history.replaceState({ pathname }, '', pathname);
            push(pathname);
        }
    }

    !browserSupportsHistory() && console.warn('Warning! Your browser does not support the HTML5 History spec!');

    const loadMainRoute = pathname => browserSupportsHistory() && window.history.pushState({ pathname }, '', pathname);

    window.onpopstate = e => {
        e.preventDefault();
        listeners.forEach(callback => callback(document.location.pathname));
    }

    return { push, redirect, listen, goBack, loadMainRoute };
}