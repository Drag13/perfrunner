import { hash } from '../../../utils';

const generateTab = (tabName: string, contentId: string, isSelected: boolean) =>
    `<li class="nav-item">
    <a class="nav-link ${
        isSelected ? 'active' : ''
    }" data-toggle="tab" href="#${contentId}" role="tab" aria-controls="nav-home" aria-selected="${
        isSelected ? true : false
    }">${tabName}</a></li>`;

const generateContent = (contentId: string, isSelected: boolean, tabContent: string) =>
    `<div class="tab-pane fade ${isSelected ? 'show active' : ''}" id="${contentId}" role="tabpanel"> ${tabContent} </div>`;

const generatePage = (tabName: string, isSelected: boolean, tabContent: string) => ({
    tab: generateTab(tabName, hash(tabName), isSelected),
    content: generateContent(hash(tabName), isSelected, tabContent),
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
