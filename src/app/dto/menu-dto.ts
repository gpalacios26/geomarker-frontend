export class Menu {
  label: string;
  link?: string;
  icon?: string;
  items?: SubMenu[];
}

export class SubMenu {
  label: string;
  link: string;
  icon: string;
}
