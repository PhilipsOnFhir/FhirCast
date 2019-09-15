import { CapabilityStatementKindEnum } from './CapabilityStatementKindEnum'
import { CapabilityStatement_Document } from './CapabilityStatement_Document'
import { CapabilityStatement_Implementation } from './CapabilityStatement_Implementation'
import { CapabilityStatement_Messaging } from './CapabilityStatement_Messaging'
import { CapabilityStatement_Rest } from './CapabilityStatement_Rest'
import { CapabilityStatement_Software } from './CapabilityStatement_Software'
import { CodeableConcept } from './CodeableConcept'
import { ContactDetail } from './ContactDetail'
import { DomainResource } from './DomainResource'
import { FHIRVersionEnum } from './FHIRVersionEnum'
import { PublicationStatusEnum } from './PublicationStatusEnum'
import { UsageContext } from './UsageContext'

export class CapabilityStatement      extends DomainResource
{

   static def : string = 'CapabilityStatement';
   url : string ;
   version : string ;
   name : string ;
   title : string ;
   status : PublicationStatusEnum ;
   experimental : boolean ;
   date : string ;
   publisher : string ;
   contact : ContactDetail [];
   description : string ;
   useContext : UsageContext [];
   jurisdiction : CodeableConcept [];
   purpose : string ;
   copyright : string ;
   kind : CapabilityStatementKindEnum ;
   instantiates : string [];
   imports : string [];
   software : CapabilityStatement_Software ;
   implementation : CapabilityStatement_Implementation ;
   fhirVersion : FHIRVersionEnum ;
   format : string [];
   patchFormat : string [];
   implementationGuide : string [];
   rest : CapabilityStatement_Rest [];
   messaging : CapabilityStatement_Messaging [];
   document : CapabilityStatement_Document [];
}
