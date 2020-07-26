type CreteElementOptions = {
    className?: string;
    child?: Element;
};

export function createElement<K extends keyof HTMLElementTagNameMap>(key: K, options?: CreteElementOptions) {
    const element = document.createElement(key);

    if (options?.className) {
        element.className = options.className;
    }

    if (options?.child) {
        element.appendChild(options.child);
    }

    return element;
}
