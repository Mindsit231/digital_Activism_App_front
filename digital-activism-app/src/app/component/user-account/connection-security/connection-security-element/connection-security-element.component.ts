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
import {MemberDto} from "../../../../model/member/member-dto";
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {MemberService} from "../../../../service/member.service";
import {Subject} from "rxjs";
import {EditingUserType} from '../../../misc/editing-user-type';

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

  @Input() user!: MemberDto;

  @Input() userSubject!: Subject<MemberDto>;

  @Input() editingUserType: EditingUserType = EditingUserType.USER;
  @Input() isModal: boolean = false
  @Output() onCloseModal = new EventEmitter<boolean>();

  constructor(protected override memberService: MemberService) {
    super();
  }

  ngOnInit(): void {
    this.setEditableElementValues();

    if (this.userSubject !== undefined) this.userSubject.subscribe({
      next: (user: MemberDto) => {
        this.user = user;
      }
    });
  }

  setEditableElementValues() {
    this.editableElements.forEach((editableElement) => {
      switch (editableElement.name) {
        case usernameElement.name:
          editableElement.value = this.user?.username!;
          break;
        case emailElement.name:
          editableElement.value = this.user?.email!;
          break;
        case passwordElement.name:
          editableElement.value = this.user?.password!;
          break;
      }
    });
  }

  private setUserFields() {
    this.editableElements.forEach((editableElement) => {
      switch (editableElement.name) {
        case usernameElement.name:
          this.user.setUsername(editableElement.value);
          break;
        case emailElement.name:
          this.user.setEmail(editableElement.value);
          break;
        case passwordElement.name:
          this.user.setPassword(editableElement.value);
          break;
      }
    });
  }

  onApplyChanges() {
    this.setUserFields();
    let member: MemberDto = MemberDto.fromJson(this.user)

    this.memberService.updateEntity(member).subscribe({
      next: (jsonUser: MemberDto) => {
        console.log("Updated member.")
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
