const generateTab = (tabName: string, isSelected: boolean) =>
    `<a class="nav-item nav-link ${
        isSelected ? 'active' : ''
    }" id="nav-${tabName}" data-toggle="tab" href="#${tabName}" role="tab" aria-controls="nav-home" aria-selected="${
        isSelected ? true : false
    }">${tabName}</a>`;

const generateContent = (tabName: string, isSelected: boolean, tabContent: string) =>
    `<div class="tab-pane fade ${isSelected ? 'show active' : ''}" id="${tabName}" role="tabpanel"> ${tabContent} </div>`;

const generatePage = (tabName: string, isSelected: boolean, tabContent: string) => ({
    tab: generateTab(tabName, isSelected),
    content: generateContent(tabName, isSelected, tabContent),
});

const append = (content: string, targetNode: HTMLElement) => {
    targetNode.insertAdjacentHTML('beforeend', content);
};

const render = (tabC: HTMLElement, contentC: HTMLElement, pages: { tab: string; content: string }[]) =>
    pages.forEach(({ tab, content }) => {
        append(tab, tabC);
        append(content, contentC);
    });

export const renderPages = (tabC: HTMLElement, contentC: HTMLElement, data: { tabName: string; content: string }[]) => {
    const pages = data.map(({ tabName, content }, i) => generatePage(tabName, i === 0, content));
    render(tabC, contentC, pages);
};
