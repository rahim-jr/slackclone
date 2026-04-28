import { useState } from "react";

export function useSwipePanels() {
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const closePanels = () => {
    setIsLeftPanelOpen(false);
    setIsRightPanelOpen(false);
  };

  const openLeftPanel = () => {
    setIsLeftPanelOpen(true);
    setIsRightPanelOpen(false);
  };

  const openRightPanel = () => {
    setIsRightPanelOpen(true);
    setIsLeftPanelOpen(false);
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLElement>) => {
    setTouchStartX(event.changedTouches[0]?.clientX ?? null);
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLElement>) => {
    if (touchStartX === null) {
      return;
    }

    const touchEndX = event.changedTouches[0]?.clientX ?? touchStartX;
    const swipeDistance = touchEndX - touchStartX;
    const swipeThreshold = 70;

    if (swipeDistance > swipeThreshold) {
      openLeftPanel();
    } else if (swipeDistance < -swipeThreshold) {
      openRightPanel();
    }

    setTouchStartX(null);
  };

  return {
    closePanels,
    handleTouchEnd,
    handleTouchStart,
    isLeftPanelOpen,
    isRightPanelOpen,
    openLeftPanel,
    openRightPanel,
    setIsLeftPanelOpen,
    setIsRightPanelOpen,
  };
}
