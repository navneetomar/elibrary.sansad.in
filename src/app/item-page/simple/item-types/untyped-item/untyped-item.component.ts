import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Item } from '../../../../core/shared/item.model';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { VersionedItemComponent } from '../versioned-item/versioned-item.component';

/**
 * Component that represents a publication Item page
 */

@listableObjectComponent(Item, ViewMode.StandalonePage)
@Component({
  selector: 'ds-untyped-item',
  styleUrls: ['./untyped-item.component.scss'],
  templateUrl: './untyped-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UntypedItemComponent extends VersionedItemComponent {
  showMore = false;
  metaData = ['dc.title.documentname', 'dc.right', 'dc.type', 'dc.type.subtype', 'dc.format.extent', 
'dc.type.subtypenonfiction', 'dc.description.abstract', 'dc.title', 'dc.title.hindi', 
'dc.title.trs', 'dc.identifier.accessionnumber', 'dc.identifier.sessionnumber', 
'dc.identifier.uri', 'dc.identifier.callno', 'dc.subject', 'dc.language.iso', 
'dc.language.regional', 'dc.language.others', 'dc.contributor.author', 
'dc.description.edition', 'dc.date.issued', 'dc.publisher', 'dc.publisher.place', 
'dc.relation.ispartofseries', 'dc.format.printedpages', 'dc.identifier.source', 
'dc.description.section', 'dc.description.currency', 'dc.description.price', 
'dc.description.remarks', 'dc.description.branch', 'dc.identifier.file', 
'dc.provenance', 'dc.coverage.spatial','dc.date', 'dc.date.created', 'dc.date.available', 
'dc.identifier.citation', 'dc.description.statementofresponsibility', 'dc.relation.ministry', 
'dc.rights.license', 'dc.language.rfc3066', 'dc.contributor.advisor', 
'dc.contributor.committeename', 'dc.contributor.editor', 'dc.contributor.illustrator', 
'dc.contributor.members', 'dc.contributor.other', 'dc.contributor.questionername', 
'dc.coverage.temporal', 'dc.creator', 'dc.date.accessioned', 'dc.date.answer', 
'dc.date.assent', 'dc.date.copyright', 'dc.date.date', 'dc.date.debate', 
'dc.date.introductionls', 'dc.date.introductionrs', 'dc.date.layingls', 
'dc.date.layingrs', 'dc.date.notification', 'dc.date.passingls', 'dc.date.passingrs', 
'dc.date.pmacollection', 'dc.date.submitted', 'dc.date.updated', 'dc.description.branchname', 
'dc.description.category', 'dc.description.legislativecouncil', 'dc.description.organisation', 
'dc.description.provenance', 'dc.description.publisher', 'dc.description.sponsorship', 
'dc.description.status', 'dc.description.tableofcontents', 'dc.description.uri', 
'dc.description.version', 'dc.format.medium', 'dc.format.mimetype', 'dc.identifier.billnumber', 
'dc.identifier.bnumber', 'dc.identifier.csnumber', 'dc.identifier.flipbook', 
'dc.identifier.govdoc', 'dc.identifier.gsrnumber', 'dc.identifier.isbn', 
'dc.identifier.ismn', 'dc.identifier.issn', 'dc.identifier.issueno', 
'dc.identifier.issuenumber', 'dc.identifier.keyword', 'dc.identifier.ladnumber', 
'dc.identifier.loksabhanumber', 'dc.identifier.ltnumber', 'dc.identifier.ministersname', 
'dc.identifier.notificationnumber', 'dc.identifier.other', 'dc.identifier.partandsection', 
'dc.identifier.questionnumber', 'dc.identifier.questiontype', 'dc.identifier.referencenumber', 
'dc.identifier.reportnumber', 'dc.identifier.serialnumber', 'dc.identifier.sici', 
'dc.identifier.slug', 'dc.identifier.sonumber', 'dc.identifier.sronumber', 
'dc.identifier.volume', 'dc.identifier.year', 'dc.identifier.yearofpublication', 
'dc.identifier.yearrange', 'dc.identifier.youtubeURL', 'dc.language', 
'dc.publisher.legislativebody', 'dc.relation.department', 'dc.relation.haspart', 
'dc.relation.hasversion', 'dc.relation.isbasedon', 'dc.relation.isformatof', 
'dc.relation.ispartof', 'dc.relation.isreferencedby', 'dc.relation.isreplacedby', 
'dc.relation.isversionof', 'dc.relation.replaces', 'dc.relation.requires', 
'dc.relation.uri', 'dc.relation', 'dc.rights.holder', 'dc.rights.uri', 
'dc.source.uri', 'dc.source', 'dc.subject.classification', 'dc.subject.ddc', 
'dc.subject.lcc', 'dc.subject.lcsh', 'dc.subject.mesh', 'dc.subject.other', 
'dc.title.alternative', 'dc.type.bill', 'dc.type.debate', 'dc.type.type', 
'dcterms.abstract', 'dcterms.accessRights', 'dcterms.accrualMethod', 
'dcterms.accrualPeriodicity', 'dcterms.accrualPolicy', 'dcterms.alternative', 
'dcterms.audience', 'dcterms.available', 'dcterms.bibliographicCitation', 
'dcterms.conformsTo', 'dcterms.contributor', 'dcterms.coverage', 'dcterms.created', 
'dcterms.creator', 'dcterms.date', 'dcterms.dateAccepted', 'dcterms.dateCopyrighted', 
'dcterms.dateSubmitted', 'dcterms.description', 'dcterms.educationLevel', 
'dcterms.extent', 'dcterms.format', 'dcterms.hasFormat', 'dcterms.hasPart', 
'dcterms.hasVersion', 'dcterms.instructionalMethod', 'dcterms.isFormatOf', 
'dcterms.isPartOf', 'dcterms.isReferencedBy', 'dcterms.isReplacedBy', 
'dcterms.isRequiredBy', 'dcterms.issued', 'dcterms.isVersionOf', 'dcterms.language', 
'dcterms.license', 'dcterms.mediator', 'dcterms.medium', 'dcterms.modified', 
'dcterms.provenance', 'dcterms.publisher', 'dcterms.references', 'dcterms.relation', 
'dcterms.replaces', 'dcterms.requires', 'dcterms.rights', 'dcterms.rightsHolder', 
'dcterms.source', 'dcterms.spatial', 'dcterms.subject', 'dcterms.tableOfContents', 
'dcterms.temporal', 'dcterms.title', 'dcterms.type', 'dcterms.valid', 
'eperson.firstname', 'eperson.language', 'eperson.lastname', 'eperson.phone'
  ];


  handleShowMore() {
    this.showMore = !this.showMore;
  }
}
