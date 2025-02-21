import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dsItemsGroup',
  pure: false,
})
export class ItemGroupPipe implements PipeTransform {
  transform(items: any[]): any {
    if (items && items.length > 0) {
      let itemGroups = [];
      for (let i = 0; i < items.length; i += 3) {
        itemGroups.push(items.slice(i, i + 3));
      }
      return itemGroups;
    }
  }
}
