import { useEffect } from 'react';

export default function SecurityProtection() {
  useEffect(() => {
    const disableRightClick = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    const disableSelection = (e: Event) => {
      e.preventDefault();
      return false;
    };

    const disableCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      return false;
    };

    const disableKeyboardShortcuts = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && (e.key === 'c' || e.key === 'C')) ||
        (e.ctrlKey && (e.key === 'u' || e.key === 'U')) ||
        (e.ctrlKey && (e.key === 's' || e.key === 'S')) ||
        (e.ctrlKey && e.shiftKey && (e.key === 'i' || e.key === 'I')) ||
        e.key === 'F12'
      ) {
        e.preventDefault();
        return false;
      }
    };

    const disableDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    document.addEventListener('contextmenu', disableRightClick);
    document.addEventListener('selectstart', disableSelection);
    document.addEventListener('copy', disableCopy);
    document.addEventListener('cut', disableCopy);
    document.addEventListener('keydown', disableKeyboardShortcuts);
    document.addEventListener('dragstart', disableDragStart);

    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';

    const style = document.createElement('style');
    style.textContent = `
      * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
      }

      img {
        pointer-events: none !important;
        -webkit-user-drag: none !important;
        -khtml-user-drag: none !important;
        -moz-user-drag: none !important;
        -o-user-drag: none !important;
        user-drag: none !important;
      }
    `;
    document.head.appendChild(style);

    const watermarkStyle = document.createElement('style');
    watermarkStyle.textContent = `
      body::before {
        content: "Nexora";
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(-45deg);
        font-size: 6rem;
        font-weight: bold;
        color: rgba(255, 255, 255, 0.03);
        pointer-events: none;
        z-index: 9999;
        white-space: nowrap;
      }
    `;
    document.head.appendChild(watermarkStyle);

    return () => {
      document.removeEventListener('contextmenu', disableRightClick);
      document.removeEventListener('selectstart', disableSelection);
      document.removeEventListener('copy', disableCopy);
      document.removeEventListener('cut', disableCopy);
      document.removeEventListener('keydown', disableKeyboardShortcuts);
      document.removeEventListener('dragstart', disableDragStart);
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
      style.remove();
      watermarkStyle.remove();
    };
  }, []);

  return null;
}
