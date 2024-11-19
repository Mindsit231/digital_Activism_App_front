import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  editableElements,
  emailElement,
  passwordElement,
  usernameElement
} from "../../../misc/editable-element";
import {ConnectionSecurityFieldComponent} from "../connection-security-field/connection-security-field.component";
import {NgForOf, NgIf} from "@angular/common";
import {FormComponent} from "../../../misc/form-component";
import {MemberDTO} from "../../../../model/member/member-dto";
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {MemberService} from "../../../../service/member/member.service";
import {Subject} from "rxjs";
import {TokenService} from '../../../../service/token.service';
import {CurrentMemberService} from '../../../../service/member/current-member.service';
import {UpdateResponse} from '../../../../model/member/update-response';

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

  updateResponse: UpdateResponse = new UpdateResponse();

  @Input() memberDTO!: MemberDTO;

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
          editableElement.value = this.memberDTO?.username!;
          break;
        case emailElement.name:
          editableElement.value = this.memberDTO?.email!;
          break;
        case passwordElement.name:
          editableElement.value = this.memberDTO?.password!;
          break;
      }
    });
  }

  private setUserFields() {
    this.editableElements.forEach((editableElement) => {
      switch (editableElement.name) {
        case usernameElement.name:
          this.memberDTO.setUsername(editableElement.value);
          break;
        case emailElement.name:
          this.memberDTO.setEmail(editableElement.value);
          break;
        case passwordElement.name:
          this.memberDTO.setPassword(editableElement.value);
          break;
      }
    });
  }

  private updateCurrentMemberDTO(memberDTO: MemberDTO) {
    this.editableElements.forEach((editableElement) => {
      switch (editableElement.name) {
        case usernameElement.name:
          this.currentMemberService.member?.setUsername(editableElement.value);
          break;
        case emailElement.name:
          this.currentMemberService.member?.setEmail(editableElement.value);
          break;
        case passwordElement.name:
          this.currentMemberService.member?.setPassword(editableElement.value);
          break;
      }
    });
  }

  onApplyChanges() {
    this.setUserFields();
    let member: MemberDTO = MemberDTO.fromJson(this.memberDTO)

    this.memberService.update(member, this.tokenService.getUserToken()).subscribe({
      next: (updateResponse: UpdateResponse) => {
        console.log("Updated member.")
        this.updateResponse = updateResponse;
        this.updateCurrentMemberDTO(updateResponse.memberDTO);
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

  onCancel() {
    this.setEditableElementValues();
    this.updateResponse = new UpdateResponse();
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
