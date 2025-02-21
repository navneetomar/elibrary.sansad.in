import {
  Component,
  ViewChild,
  ViewContainerRef,
  ComponentRef,
  SimpleChanges,
  OnInit,
  OnDestroy,
  ComponentFactoryResolver,
  ChangeDetectorRef,
  OnChanges
} from '@angular/core';
import { hasValue, isNotEmpty } from '../empty.util';
import { from as fromPromise, Observable, of as observableOf, Subscription } from 'rxjs';
import { ThemeService } from './theme.service';
import { catchError, switchMap, map } from 'rxjs/operators';
import { GenericConstructor } from '../../core/shared/generic-constructor';

@Component({
  selector: 'ds-themed',
  styleUrls: ['./themed.component.scss'],
  templateUrl: './themed.component.html',
})
export abstract class ThemedComponent<T extends object> implements OnInit, OnDestroy, OnChanges {
  @ViewChild('vcr', { read: ViewContainerRef }) vcr: ViewContainerRef; // ViewContainerRef for dynamic component loading
  protected compRef: ComponentRef<T>; // Reference to the dynamically loaded component

  protected lazyLoadSub: Subscription; // Subscription for lazy loading components
  protected themeSub: Subscription; // Subscription for theme changes

  protected inAndOutputNames: (keyof T & keyof this)[] = []; // Names of inputs and outputs to connect

  constructor(
    protected resolver: ComponentFactoryResolver, // Resolver for creating component factories
    protected cdr: ChangeDetectorRef, // Change detector for the component
    protected themeService: ThemeService // Service for managing themes
  ) {
  }

  protected abstract getComponentName(): string; // Abstract method to get the component name

  protected abstract importThemedComponent(themeName: string): Promise<any>; // Abstract method to import themed component
  protected abstract importUnthemedComponent(): Promise<any>; // Abstract method to import unthemed component

  ngOnChanges(changes: SimpleChanges): void {
    // Check if any input or output has changed
    if (this.inAndOutputNames.some((name: any) => hasValue(changes[name]))) {
      this.connectInputsAndOutputs(); // Connect inputs and outputs
      if (this.compRef?.instance && 'ngOnChanges' in this.compRef.instance) {
        (this.compRef.instance as any).ngOnChanges(changes); // Call ngOnChanges on the component instance
      }
    }
  }

  ngOnInit(): void {
    this.destroyComponentInstance(); // Destroy any existing component instance
    this.themeSub = this.themeService.getThemeName$().subscribe(() => {
      this.renderComponentInstance(); // Render the component instance when theme changes
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from subscriptions and destroy component instance
    [this.themeSub, this.lazyLoadSub].filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
    this.destroyComponentInstance();
  }

  protected renderComponentInstance(): void {
    this.destroyComponentInstance(); // Destroy existing component instance

    if (hasValue(this.lazyLoadSub)) {
      this.lazyLoadSub.unsubscribe(); // Unsubscribe from lazy load subscription
    }

    this.lazyLoadSub = this.resolveThemedComponent(this.themeService.getThemeName()).pipe(
      switchMap((themedFile: any) => {
        if (hasValue(themedFile) && hasValue(themedFile[this.getComponentName()])) {
          // If the themed file exports a component with the specified name, return that component
          return [themedFile[this.getComponentName()]];
        } else {
          // Otherwise, import and return the default component
          return fromPromise(this.importUnthemedComponent()).pipe(
            map((unthemedFile: any) => {
              return unthemedFile[this.getComponentName()]; // Return the unthemed component
            })
          );
        }
      }),
    ).subscribe((constructor: GenericConstructor<T>) => {
      const factory = this.resolver.resolveComponentFactory(constructor); // Create component factory
      this.compRef = this.vcr.createComponent(factory); // Create component instance
      this.connectInputsAndOutputs(); // Connect inputs and outputs
      this.cdr.markForCheck(); // Mark for change detection
    });
  }

  protected destroyComponentInstance(): void {
    if (hasValue(this.compRef)) {
      this.compRef.destroy(); // Destroy the component instance
      this.compRef = null; // Clear the reference
    }
    if (hasValue(this.vcr)) {
      this.vcr.clear(); // Clear the ViewContainerRef
    }
  }

  protected connectInputsAndOutputs(): void {
    // Connect inputs and outputs to the component instance
    if (isNotEmpty(this.inAndOutputNames) && hasValue(this.compRef) && hasValue(this.compRef.instance)) {
      this.inAndOutputNames.forEach((name: any) => {
        this.compRef.instance[name] = this[name]; // Assign input/output values
      });
    }
  }

  /**
   * Attempt to import this component from the current theme or a theme it {@link NamedThemeConfig.extends}.
   * Recurse until we succeed or when until we run out of themes to fall back to.
   *
   * @param themeName The name of the theme to check
   * @param checkedThemeNames The list of theme names that are already checked
   * @private
   */
  private resolveThemedComponent(themeName?: string, checkedThemeNames: string[] = []): Observable<any> {
    if (isNotEmpty(themeName)) {
      return fromPromise(this.importThemedComponent(themeName)).pipe(
        catchError(() => {
          // Try the next ancestor theme instead
          const nextTheme = this.themeService.getThemeConfigFor(themeName)?.extends;
          const nextCheckedThemeNames = [...checkedThemeNames, themeName];
          if (checkedThemeNames.includes(nextTheme)) {
            throw new Error('Theme extension cycle detected: ' + [...nextCheckedThemeNames, nextTheme].join(' -> '));
          } else {
            return this.resolveThemedComponent(nextTheme, nextCheckedThemeNames); // Recurse to the next theme
          }
        }),
      );
    } else {
      // If we got here, we've failed to import this component from any ancestor theme → fall back to unthemed
      return observableOf(null); // Return null if no theme is found
    }
  }
}
