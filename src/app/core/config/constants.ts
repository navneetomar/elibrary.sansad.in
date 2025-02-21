import { BITSTREAM_NUMBER } from './../../admin/admin-policies/tree-drop-drag/data_number';
import { Community } from './../shared/community.model';
import { Collection } from './../shared/collection.model';
import { Bitstream } from './../shared/bitstream.model';
import { HttpHeaders } from '@angular/common/http';
import {
  COLLECTION_NUMBER,
  ITEM_NUMBER,
  SUBCOMMUNTIES_NUMBER,
} from 'src/app/admin/admin-policies/tree-drop-drag/data_number';

export const recaptcha =  {
  siteKey: '6LfRrK4oAAAAABlD_TGm09kMk4dLahp6lZIQIagw',
};
export const SUBCOMMUNITY_TYPE = 'subcommunity';
export const COLLECTION_TYPE = 'collection';
export const COMMUNITIES_TYPE = 'communities';
export const ITEM_TYPE = 'item';
export const BITSTREAM_TYPE = 'bitstream';
export const COMMUNITY_TYPE = 'community';
export const COMMUNITY_TO_TOP = 'isTop';

export const TOP_COUNTRIES = 'TopCountries';
export const TOTAL_VISITSPERMONTH = 'TotalVisitsPerMonth';
export const TOTAL_VIEWONLINE_AND_DOWNLOAD_PER_MONTH =
  'TotalViewOnlineAndDownloadPermonth';

export const OVERALL_PIE = 'overallpie';
export const STATISTICS_TYPE = 'statistics_type';
export const BY_STAT_TYPE_BAR = 'bystattypebar';
export const BY_STAT_TYPE_PROGRESS_LINE = 'bystattypeprogressline';

// dinh dang type
export const ENUM_BITSTREAM = '0';
export const ENUM_BUNDLE = '1';
export const ENUM_ITEM = '2';
export const ENUM_COLLECTION = '3';
export const ENUM_COMMUNITY = '4';
export const ENUM_SITES = '5';
export const ENUM_PERSON = '9';
// dinh dang type label
export const ENUM_BITSTREAM_LABEL_VN = 'Chuỗi dữ liệu số';
export const ENUM_BITSTREAM_LABEL_EN = 'Bitstream';
export const ENUM_ITEM_LABEL_VN = 'Tài liệu';
export const ENUM_ITEM_LABEL_EN = 'Item';
export const ENUM_COLLECTION_LABEL_VN = 'Bộ sưu tập';
export const ENUM_COLLECTION_LABEL_EN = 'Collection';
export const ENUM_COMMUNITY_LABEL_VN = 'Đơn vị';
export const ENUM_COMMUNITY_LABEL_EN = 'Community';

//
export const TOTAL_ITEM_VISITS = 'TotalVisits_TotalVisits';
export const TOTAL_COMM_VISITS = 'TotalVisits_TotalVisitsComm';
export const TOTAL_COLL_VISITS = 'TotalVisits_TotalVisitsColl';
//
export const JANUARY = 'January';
export const FEBRUARY = 'February';
export const MARCH = 'March';
export const APRIL = 'April';
export const MAY = 'May';
export const JUNE = 'June';
export const JULY = 'July';
export const AUGUST = 'August';
export const SEPTEMBER = 'September';
export const OCTOBER = 'October';
export const NOVEMBER = 'November';
export const DECEMBER = 'December';
//
export const getValueNameCookie = (name: any) => {
  let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) {
    return match[2];
  } else {
    return null;
  }
};
export const getOptionsSystem = () => {
  let match = getValueNameCookie('XSRF-TOKEN');
  let headers = new HttpHeaders({
    'X-XSRF-TOKEN': match,
  });
  let options = { headers: headers };
  return options;
};
export const getOptionsSystemStatics = () => {
  let headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  let options = { headers: headers, params: {} };
  return options;
};
export const handleMoveCollectionToSubcommunity = (
  idCollection: string,
  idSubParent: string,
  applytosub: boolean,
  inherit: number
) => {
  return {
    // move collection to subcomm (inside or outside) in 1 community
    inherit: inherit,
    dsobjtypeint: COLLECTION_NUMBER,
    dsobjid: idCollection,
    applytosub: applytosub,
    parenttypeint: SUBCOMMUNTIES_NUMBER,
    parentid: idSubParent,
  };
};
export const handleMoveItemToCollection = (
  idItem: string,
  idCollParent: string,
  applytosub: boolean,
  inherit: number
) => {
  return {
    // item to collection
    inherit: inherit,
    dsobjtypeint: ITEM_NUMBER,
    dsobjid: idItem,
    applytosub: applytosub,
    parenttypeint: COLLECTION_NUMBER,
    parentid: idCollParent,
  };
};
export const handleMoveBitstreamToItem = (
  idItem: string,
  idItemParent: string,
  applytosub: boolean,
  inherit: number
) => {
  return {
    // bistream to item
    inherit: inherit,
    dsobjtypeint: BITSTREAM_NUMBER,
    dsobjid: idItem,
    applytosub: applytosub,
    parenttypeint: ITEM_NUMBER,
    parentid: idItemParent,
  };
};
export const handleMoveSubcommunityToSubcommunity = (
  idSubcomm: string,
  idSubParent: string,
  applytosub: boolean,
  inherit: number
) => {
  return {
    // move collection to subcomm (inside or outside) in 1 community
    inherit: inherit,
    dsobjtypeint: SUBCOMMUNTIES_NUMBER,
    dsobjid: idSubcomm,
    applytosub: applytosub,
    parenttypeint: SUBCOMMUNTIES_NUMBER,
    parentid: idSubParent,
  };
};
export const handleMoveCommunityToTop = (
  idSubcomm: string,
  applytosub: boolean,
  inherit: number
) => {
  return {
    // move community to top
    inherit: inherit,
    applytosub: applytosub,
    dsobjtypeint: SUBCOMMUNTIES_NUMBER,
    dsobjid: idSubcomm,
  };
};
