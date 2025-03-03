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
    //logo handler
    this.logoHandler(theme);
  }

  logoHandler(theme: string) {
    if (theme === 'light') {
      document.getElementById('light-logo').style.display = 'block';
      document.getElementById('dark-logo').style.display = 'none';
    } else {
      document.getElementById('light-logo').style.display = 'none';
      document.getElementById('dark-logo').style.display = 'block';
    }
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
    const existingThemes = document.querySelectorAll('#theme-style');
    existingThemes.forEach(theme => theme.remove());
  }
}
