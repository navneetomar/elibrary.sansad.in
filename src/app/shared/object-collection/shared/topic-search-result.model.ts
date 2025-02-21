import { Topic } from '../../../core/shared/topic.model';
import { SearchResult } from '../../search/models/search-result.model';
import { searchResultFor } from '../../search/search-result-element-decorator';

@searchResultFor(Topic)
export class TopicSearchResult extends SearchResult<Topic> {}
