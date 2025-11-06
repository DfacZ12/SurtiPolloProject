import { menuItems } from "../interfaces/MenuConfigSideBar"
import type { IconProp } from "@fortawesome/fontawesome-svg-core";

export interface FlatMenuItem {
  label: string;
  title: string;
  path: string;
  icon: IconProp;
}

export const flattenMenu = (): FlatMenuItem[] => {
  const result: FlatMenuItem[] = [];

  menuItems.forEach((menu) => {
    if (menu.path && menu.title) {
      result.push({
        label: menu.label,
        title: menu.title,
        path: menu.path,
        icon: menu.icon,
      });
    }

    if (menu.submenus) {
      menu.submenus.forEach((sub) => {
        result.push({
          label: sub.label,
          title: sub.title,
          path: sub.path,
          icon: menu.icon,
        });
      });
    }
  });

  return result;
};
