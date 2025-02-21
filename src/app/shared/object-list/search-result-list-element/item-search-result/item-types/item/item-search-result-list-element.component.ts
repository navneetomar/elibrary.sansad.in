import { Component, Input } from '@angular/core';
import { listableObjectComponent } from '../../../../../object-collection/shared/listable-object/listable-object.decorator';
import { ViewMode } from '../../../../../../core/shared/view-mode.model';
import { ItemSearchResult } from '../../../../../object-collection/shared/item-search-result.model';
import { SearchResultListElementComponent } from '../../../search-result-list-element.component';
import { Item } from '../../../../../../core/shared/item.model';
import { getItemPageRoute } from '../../../../../../item-page/item-page-routing-paths';

@listableObjectComponent('PublicationSearchResult', ViewMode.ListElement)
@listableObjectComponent(ItemSearchResult, ViewMode.ListElement)
@Component({
  selector: 'ds-item-search-result-list-element',
  styleUrls: ['./item-search-result-list-element.component.scss'],
  templateUrl: './item-search-result-list-element.component.html',
})
/**
 * The component for displaying a list element for an item search result of the type Publication
 */
export class ItemSearchResultListElementComponent extends SearchResultListElementComponent<
  ItemSearchResult,
  Item
> {
  /**
   * Route to the item's page
   */
  itemPageRoute: string;

  /**
   * Display thumbnails if required by configuration
   */
  showThumbnails: boolean;
  fullTime:any;
  @Input() isRecentItem: boolean;

  ngOnInit(): void {
    super.ngOnInit();
    this.showThumbnails = this.appConfig.browseBy.showThumbnails;
    this.itemPageRoute = getItemPageRoute(this.dso);
    this.fullTime = this.formatDateTime(this.dso.firstMetadataValue('dc.date.issued'));
  }
  // convertDate(time){
  //   if (time){
  //     let date = new Date(time);
  //     const monthNames = [
  //       "Jan",
  //       "Feb",
  //       "Mar",
  //       "Apr",
  //       "May",
  //       "Jun",
  //       "Jul",
  //       "Aug",
  //       "Sep",
  //       "Oct",
  //       "Nov",
  //       "Dec"
  //     ];
  //     let day = date.getDate();
  //     let month = monthNames[date.getMonth()];
  //     let year = date.getFullYear();
  //     let fullTime = `${day}-${month}-${year}`;
  //     return fullTime;
  //   } else {
  //     return null;
  //   }
  // }
  formatDateTime(inputDateString){
   if (inputDateString){
     if (inputDateString.toString().length > 4 ){
      // Create a Date object from the input string
     const inputDate = new Date(inputDateString);

     // Define the months as an array for formatting
     const months = [
       'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
     ];
     // Format the date
     const formattedDate = `${inputDate.getDate()}-${months[inputDate.getMonth()]}-${inputDate.getFullYear()}`;
     return formattedDate;
     } else {
      return inputDateString;
     }
   } else {
    return null;
   }
  }

}
