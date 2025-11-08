import {
  rootContainerStyles,
  containerStyles,
  menuTitleStyles,
  heroContainerStyles,
  heroButtonStyles,
} from './styles';

import { game } from '@core/global';

export class GameMenu {
  private readonly _element: HTMLDivElement;

  constructor() {
    this._element = document.getElementById('menu') as HTMLDivElement;
    // Initialize root styles
    this.applyStyles(this._element, rootContainerStyles);
  }

  public showChooseHeroMenu(): void {
    game.pause();

    // Show menu
    this.applyStyles(this._element, { display: 'flex' });

    // Create container for menu items to not change root container styles
    const container = document.createElement('div');
    this.applyStyles(container, containerStyles);
    this._element.appendChild(container);

    // Menu title
    const menuTitle = document.createElement('h2');
    menuTitle.innerText = 'Choose your hero';
    this.applyStyles(menuTitle, menuTitleStyles);
    container.appendChild(menuTitle);

    // Hero buttons container
    const heroContainer = document.createElement('div');
    this.applyStyles(heroContainer, heroContainerStyles);
    container.appendChild(heroContainer);

    // Create a button for each available hero
    game.availableHeroes.forEach(hero => {
      const heroButton = document.createElement('button');
      heroButton.innerText = hero.title;
      this.applyStyles(heroButton, heroButtonStyles(hero.color));
      heroButton.onclick = () => {
        game.init(new hero.class());
        this.hideMenu();
      };
      heroContainer.appendChild(heroButton);
    });
  }

  public hideMenu() {
    // Hide menu and clear its content
    this._element.textContent = '';
    this.applyStyles(this._element, { display: 'none' });
    game.resume();
  }

  /** Apply styles to an element */
  private applyStyles(element: HTMLElement, styles: Partial<CSSStyleDeclaration>): void {
    for (const key in styles) {
      const value = styles[key];
      if (value !== undefined) element.style[key] = value;
    }
  }
}
