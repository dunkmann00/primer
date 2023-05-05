export declare class NavListElement extends HTMLElement {
    #private;
    items: HTMLElement[];
    showMoreItem: HTMLElement;
    focusMarkers: HTMLElement[];
    connectedCallback(): void;
    get showMoreDisabled(): boolean;
    set showMoreDisabled(value: boolean);
    set currentPage(value: number);
    get currentPage(): number;
    get totalPages(): number;
    get paginationSrc(): string;
    selectItemById(itemId: string | null): boolean;
    selectItemByHref(href: string | null): boolean;
    selectItemByCurrentLocation(): boolean;
    expandItem(item: HTMLElement): void;
    collapseItem(item: HTMLElement): void;
    itemIsExpanded(item: HTMLElement | null): boolean;
    handleItemWithSubItemClick(e: Event): void;
    handleItemWithSubItemKeydown(e: KeyboardEvent): void;
    private showMore;
    private setShowMoreItemState;
}
declare global {
    interface Window {
        NavListElement: typeof NavListElement;
    }
}
