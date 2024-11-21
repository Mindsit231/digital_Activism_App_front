import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {editableElements, emailElement, passwordElement, usernameElement} from "../../../misc/editable-element";
import {ConnectionSecurityFieldComponent} from "../connection-security-field/connection-security-field.component";
import {NgForOf, NgIf} from "@angular/common";
import {FormComponent} from "../../../misc/form-component";
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {MemberService} from "../../../../service/member/member.service";
import {TokenService} from '../../../../service/token.service';
import {CurrentMemberService} from '../../../../service/member/current-member.service';
import {UpdateResponse} from '../../../../model/member/update-response';
import {UpdateRequest} from '../../../../model/member/update-request';

@Component({
  selector: 'app-connection-security-element',
  standalone: true,
  imports: [
    ConnectionSecurityFieldComponent,
    NgForOf,
    NgIf,
    FaIconComponent
  ],
  templateUrl: './connection-security-element.component.html',
  styleUrl: './connection-security-element.component.scss'
})
export class ConnectionSecurityElementComponent extends FormComponent implements OnInit {
  faXmark = faXmark;

  editableElements = editableElements;
  changesSuccess: boolean = false;

  @Input() isModal: boolean = false
  @Output() onCloseModal = new EventEmitter<boolean>();

  constructor(protected memberService: MemberService,
              protected currentMemberService: CurrentMemberService,
              protected override tokenService: TokenService) {
    super();
  }

  ngOnInit(): void {
    this.setEditableElementValues();
  }

  setEditableElementValues() {
    this.editableElements.forEach((editableElement) => {
      switch (editableElement.name) {
        case usernameElement.name:
          editableElement.value = this.currentMemberService.member?.username!;
          break;
        case emailElement.name:
          editableElement.value = this.currentMemberService.member?.email!;
          break;
      }
    });
  }

  private setUserFields(): UpdateRequest {
    let updateRequest = new UpdateRequest();

    this.editableElements.forEach((editableElement) => {
      if (editableElement.isChanged) {
        switch (editableElement.name) {
          case usernameElement.name:
            updateRequest.username = editableElement.value;
            break;
          case emailElement.name:
            updateRequest.email = editableElement.value;
            break;
          case passwordElement.name:
            updateRequest.password = editableElement.value;
            break;
        }
      }
    });

    return updateRequest;
  }

  private updateCurrentMemberDTO() {
    this.editableElements.forEach((editableElement) => {
      editableElement.isChanged = false;
      switch (editableElement.name) {
        case usernameElement.name:
          this.currentMemberService.member?.setUsername(editableElement.value);
          break;
        case emailElement.name:
          this.currentMemberService.member?.setEmail(editableElement.value);
          break;
      }
    });
  }

  onApplyChanges() {
    let updateRequest: UpdateRequest = this.setUserFields();
    let hasModifications: boolean = false;
    this.editableElements.forEach((editableElement) => {
      if (editableElement.isChanged) hasModifications = true;
    });

    if (hasModifications) {
      console.log(updateRequest);
      this.memberService.update(updateRequest, this.tokenService.getUserToken()).subscribe({
        next: (updateResponse: UpdateResponse) => {
          console.log(updateResponse);
          this.updateCurrentMemberDTO();
          this.changesSuccess = true;
        },
        error: (error) => {
          this.changesSuccess = false;
          console.log("HTTP ERROR: Failed to update member.");
        },
        complete: () => {
          super.onSubmit();
        }
      });
    }
  }

  onCancel() {
    this.setEditableElementValues();
    this.isSubmitted = false;
  }

  isNotSuccess() {
    return !this.changesSuccess && this.isSubmitted;
  }

  isSuccess() {
    return this.changesSuccess && this.isSubmitted;
  }

  closeModal() {
    this.onCloseModal.emit(false);
  }
}
