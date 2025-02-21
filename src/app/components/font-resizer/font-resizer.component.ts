import { Component } from '@angular/core';

@Component({
  selector: 'ds-font-resizer',
  templateUrl: './font-resizer.component.html',
  styleUrls: ['./font-resizer.component.scss']
})
export class FontResizerComponent {

  currentFont: string = 'medium'; 

  constructor() { }

  switchFont(font: string) {
    this.removeExistingTheme();  // Remove any existing theme
    let themefile = '';
    let theme = localStorage.getItem('theme');
    if(theme != undefined)
    {
      themefile = `${theme}-${font}`;
    } else {
      themefile = `light-theme-${font}`;
    }
    this.loadTheme(themefile);       // Load the new theme 
    this.currentFont = font;   // Update the current font
    localStorage.setItem('font', font);
    // if(theme=='light-theme'){
    //   document.getElementById('btnLight').style.display="none";
    //   document.getElementById('btnDark').style.display="block";
    // }else{
    //   document.getElementById('btnLight').style.display="block";
    //   document.getElementById('btnDark').style.display="none";
    // }
    
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
