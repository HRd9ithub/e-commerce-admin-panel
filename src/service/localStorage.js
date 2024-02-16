

export const addLocalStorgeData = (name, value) => {
    localStorage.setItem(name,value);
}

export const getLocalStorgeData = (name) => {
    return localStorage.getItem(name);
}

export const removeLocalStorgeData = (name) => {
    return localStorage.removeItem(name);
}

export const clearLocalStorgeData = () => {
    return localStorage.clear();
}