import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {NgForOf, NgIf} from "@angular/common";
import {PaginatorModule} from "primeng/paginator";
import {ModalComponent} from '../../misc/modal-component';
import {PostDTO} from '../../../model/post/post-dto';
import {CampaignDTO} from '../../../model/campaign/campaign-dto';
import {PostRequest} from '../../../model/post/post-request';
import {CampaignRequest} from '../../../model/campaign/campaign-request';
import {CampaignService} from '../../../service/campaign.service';
import {RouterService} from '../../../service/router.service';
import {faCheck, faXmark} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-add-campaign-modal',
  standalone: true,
  imports: [
    FaIconComponent,
    NgForOf,
    NgIf,
    PaginatorModule
  ],
  templateUrl: './add-campaign-modal.component.html',
  styleUrl: './add-campaign-modal.component.scss'
})
export class AddCampaignModalComponent extends ModalComponent {
  @Input() override isModalOpen = false
  @Output() override onModalChangeEmitter = new EventEmitter<boolean>();
  @Output() onCampaignAddedEmitter = new EventEmitter<CampaignDTO>();

  faXmark = faXmark;
  faCheck = faCheck;

  formStatusMsg: string = "";

  isPostAdded: boolean = false;
  isFailure: boolean = false;

  @Input() campaignRequest!: CampaignRequest;

  constructor(protected campaignService: CampaignService,
              protected routerService: RouterService) {
    super();
  }

  onAcceptClick() {
    console.log(this.campaignRequest)
    this.isFormValid().then(
      (isValid: boolean) => {
        if (isValid) {
          this.campaignService.addCampaign(this.campaignRequest)
            .then((campaignDTO: CampaignDTO) => {
              this.isPostAdded = true;
              this.closeModal();

              this.onCampaignAddedEmitter.emit(campaignDTO)
            })
            .catch((error: Error) => {
              console.log(error)
              this.isFailure = true;
            })
        } else {
          this.formStatusMsg = "Invalid form data!";
        }
      }
    )
  }

  override isFormValid(): Promise<boolean> {
    return Promise.resolve(
      this.campaignRequest.name.length > 0 &&
      this.campaignRequest.description.length > 0 &&
      this.campaignRequest.startDate.length > 0 &&
      this.campaignRequest.endDate.length > 0 &&
      this.campaignRequest.startDate < this.campaignRequest.endDate);
  }

  override closeModal() {
    this.resetMessages();
    super.closeModal();
  }

  checkIfPostAdded() {
    if (this.isPostAdded) {
      this.resetMessages()
      this.isPostAdded = false;
    }
  }

  private resetMessages() {
    this.formStatusMsg = "";
  }
}
