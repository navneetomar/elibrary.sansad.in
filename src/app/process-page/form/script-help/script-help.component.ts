import { Component, Input } from '@angular/core';
import { Script } from '../../scripts/script.model';
import { ScriptParameterType } from '../../scripts/script-parameter-type.model';

/**
 * Components that represents a help section for the script use and parameters
 */
@Component({
  selector: 'ds-script-help',
  templateUrl: './script-help.component.html',
  styleUrls: ['./script-help.component.scss'],
})
export class ScriptHelpComponent {
  /**
   * The current script to show the help information for
   */
  @Input() script: Script;

  /**
   * The available script parameter types
   */
  parameterTypes = ScriptParameterType;

  checkDescription(text: string) {
    if (text) {
      if (
        text.includes('Word Text Extractor') &&
        text.includes('PDF Text Extractor')
      ) {
        return 'filter.media.plunins';
      } else if (text.includes('SKIP the bitstreams belonging to identifier')) {
        return 'filter.media.skip';
      } else {
        return text;
      }
    }
  }
}
