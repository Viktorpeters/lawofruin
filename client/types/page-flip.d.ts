/* Types for the page-flip library (StPageFlip, MIT). The package ships none of its own.
   Only the parts the reader uses are declared. */
declare module "page-flip" {
  export type FlipSettings = {
    width: number;
    height: number;
    size?: "fixed" | "stretch";
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    startPage?: number;
    drawShadow?: boolean;
    flippingTime?: number;
    usePortrait?: boolean;
    startZIndex?: number;
    autoSize?: boolean;
    maxShadowOpacity?: number;
    showCover?: boolean;
    mobileScrollSupport?: boolean;
    clickEventForward?: boolean;
    useMouseEvents?: boolean;
    swipeDistance?: number;
    showPageCorners?: boolean;
    disableFlipByClick?: boolean;
  };

  export type FlipEvent<T = unknown> = { data: T; object: PageFlip };

  export class PageFlip {
    constructor(element: HTMLElement, settings: FlipSettings);
    loadFromHTML(items: NodeListOf<HTMLElement> | HTMLElement[]): void;
    destroy(): void;
    turnToPage(page: number): void;
    flip(page: number, corner?: "top" | "bottom"): void;
    flipNext(corner?: "top" | "bottom"): void;
    flipPrev(corner?: "top" | "bottom"): void;
    getCurrentPageIndex(): number;
    getPageCount(): number;
    getOrientation(): "portrait" | "landscape";
    on(event: "flip", cb: (e: FlipEvent<number>) => void): PageFlip;
    on(event: "changeState", cb: (e: FlipEvent<"user_fold" | "fold_corner" | "flipping" | "read">) => void): PageFlip;
    on(event: "changeOrientation", cb: (e: FlipEvent<"portrait" | "landscape">) => void): PageFlip;
    on(event: "init" | "update", cb: (e: FlipEvent<{ page: number; mode: string }>) => void): PageFlip;
  }
}
