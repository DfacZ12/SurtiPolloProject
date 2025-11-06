import { useEffect } from "react";

export default function SidebarScript() {
  useEffect(() => {
    const menuItems = document.querySelectorAll<HTMLAnchorElement>('#sidebar ul > li > div');

    menuItems.forEach((menu) => {
      menu.addEventListener('click', () => {
        const subMenu = menu.nextElementSibling as HTMLElement | null;
        if (!subMenu) return;

        const arrowIcon = menu.querySelector<HTMLElement>('.arrowIcon');
        if (!arrowIcon) return;

        if (subMenu.classList.contains('max-h-0')) {
          subMenu.classList.remove('max-h-0');
          subMenu.classList.add('max-h-[500px]');
        } else {
          subMenu.classList.remove('max-h-[500px]');
          subMenu.classList.add('max-h-0');
        }

        arrowIcon.classList.toggle('rotate-0');
        arrowIcon.classList.toggle('-rotate-90');
      });
    });

    const sidebarCloseBtn = document.getElementById('close-sidebar') as HTMLButtonElement | null;
    const sidebarOpenBtn = document.getElementById('open-sidebar') as HTMLButtonElement | null;
    const sidebarCollapseMenu = document.getElementById('sidebar-collapse-menu') as HTMLElement | null;

    if (sidebarOpenBtn && sidebarCollapseMenu) {
      sidebarOpenBtn.addEventListener('click', () => {
        sidebarCollapseMenu.style.cssText = 'width: 250px; visibility: visible; opacity: 1;';
      });
    }

    if (sidebarCloseBtn && sidebarCollapseMenu) {
      sidebarCloseBtn.addEventListener('click', () => {
        sidebarCollapseMenu.style.cssText = 'width: 32px; visibility: hidden; opacity: 0;';
      });
    }

    // 🧹 Limpieza: elimina los event listeners cuando el componente se desmonta
    return () => {
      menuItems.forEach((menu) => {
        menu.replaceWith(menu.cloneNode(true));
      });
      sidebarOpenBtn?.replaceWith(sidebarOpenBtn.cloneNode(true));
      sidebarCloseBtn?.replaceWith(sidebarCloseBtn.cloneNode(true));
    };
  }, []);

  return null; // No renderiza nada, solo ejecuta los efectos
}
