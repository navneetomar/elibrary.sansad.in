import { Component } from '@angular/core';

@Component({
  selector: 'ds-colour-switcher',
  templateUrl: './colour-switcher.component.html',
  styleUrls: ['./colour-switcher.component.scss']
})
export class ColourSwitcherComponent {

  currentTheme: string = 'light';  // Default theme

  constructor() { 
    let theme = localStorage.getItem('theme') || 'light';
    let font = localStorage.getItem('font') || 'medium';
    let themefile = `${theme}-${font}`;
    this.loadTheme(themefile);
    this.currentTheme = theme;
    localStorage.setItem('theme', theme);
    localStorage.setItem('font', font);
  }

  switchTheme(theme: string) {
    this.removeExistingTheme();
    let font = localStorage.getItem('font') || 'medium';
    let themefile = `${theme}-${font}`;
    this.loadTheme(themefile);
    this.currentTheme = theme;
    localStorage.setItem('theme', theme);
  }

  loadTheme(theme: string) {
    const head = document.getElementsByTagName('head')[0];
    const link = document.createElement('link');
    link.id = 'theme-style';
    link.rel = 'stylesheet';
    link.href = `assets/${theme}.css`;  // Path to your CSS files
    head.appendChild(link);
  }

  removeExistingTheme() {
    const existingTheme = document.getElementById('theme-style');
    if (existingTheme) {
      existingTheme.remove();
    }
  }
}
