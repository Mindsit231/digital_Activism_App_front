import {Component, Input, OnInit} from '@angular/core';
import {EditableElement} from "../../../misc/editable-element";
import {NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {EditableElementType} from "../../../misc/editable-element-type";
import {AuthenticationComponent} from "../../../authentication/authentication-component";
import {CurrentMemberService} from "../../../../service/member/current-member.service";
import {ACTION_FAILURE, ACTION_NULL, ACTION_SUCCESS, ActionStatus} from '../../../misc/action-status';
import {AuthenticationService} from '../../../../service/authentication.service';
import {TokenService} from '../../../../service/token.service';

@Component({
  selector: 'app-cs-elem',
  standalone: true,
  imports: [
    NgIf,
    FormsModule
  ],
  templateUrl: './connection-security-field.component.html',
  styleUrl: './connection-security-field.component.scss'
})
export class ConnectionSecurityFieldComponent extends AuthenticationComponent implements OnInit {
  @Input() editableElement!: EditableElement;

  newValue: string = "";
  passwordConfirmation: string = "";
  oldPassword: string = "";

  isEditingField = false;
  isEditingPassword = false;

  isConfirmed: ActionStatus = ACTION_NULL;

  isNewPasswordSame = false;
  isEditable: boolean = true;

  constructor(protected currentMemberService: CurrentMemberService,
              protected authenticationService: AuthenticationService,
              protected override tokenService: TokenService) {
    super();
  }

  ngOnInit(): void {
    this.isEditable = this.editableElement.isEditable;
  }

  setEditing(isEditing: boolean) {
    this.isEditingField = isEditing;
    this.isEditingPassword = isEditing;
  }

  onConfirm() {
    if (this.isPasswordElement()) {
      console.log(this.newValue)
      if (this.isPasswordProper(this.newValue)) {
        if (this.newValue === this.passwordConfirmation) {
          this.authenticationService.checkOldPassword(this.oldPassword, this.tokenService.getUserToken()).subscribe({
            next: (isNewPasswordSame: boolean) => {
              this.isNewPasswordSame = isNewPasswordSame;
              this.isConfirmed = isNewPasswordSame ? ACTION_SUCCESS : ACTION_FAILURE;
            },
            error: (error) => {
              this.isConfirmed = ACTION_FAILURE;
              console.error(error);
            }
          });
          this.isConfirmed = ACTION_SUCCESS;
        } else {
          console.log("Passwords do not match.")
          this.isConfirmed = ACTION_FAILURE;
        }
      } else {
        console.log("Password is not proper.")
        this.isConfirmed = ACTION_FAILURE;
      }
    } else {
      if(this.isFieldProper(this.newValue)) {
        this.isConfirmed = ACTION_SUCCESS;
      } else {
        console.log("Field is not proper.")
        this.isConfirmed = ACTION_FAILURE;
      }
    }
    if(this.isConfirmed === ACTION_SUCCESS) {
      this.setEditing(false);
      this.editableElement.value = this.newValue;
    }
  }

  onEdit() {
    this.setEditing(true);

    if (!this.isPasswordElement()) {
      this.newValue = this.editableElement.value;
    } else {
      this.newValue = "";
    }
  }

  onCancel() {
    this.resetValues();
  }

  getValue() {
    if (!this.isPasswordElement()) {
      return this.editableElement.value;
    } else {
      return "************";
    }
  }

  resetValues() {
    this.newValue = this.getValue();
    this.passwordConfirmation = "";
    this.oldPassword = "";

    this.setEditing(false);
    this.isConfirmed = ACTION_NULL;
    this.isNewPasswordSame = false;
  }


  isPasswordElement() {
    return this.editableElement.editableElementType === EditableElementType.PASSWORD;
  }

  isEditingPasswordElement() {
    return this.isPasswordElement() && this.isEditingField;
  }

  isFieldInvalid() {
    return this.isConfirmed === ACTION_FAILURE && !this.isFieldProper(this.newValue) && !this.isPasswordElement();
  }

  isPasswordInvalid(): boolean {
    return this.isConfirmed === ACTION_FAILURE && !this.isPasswordProper(this.newValue) && this.isPasswordElement();
  }

  isPasswordsNotMatch(): boolean {
    return this.isConfirmed === ACTION_FAILURE && this.newValue !== this.passwordConfirmation;
  }

  isNewPasswordInvalid() {
    return this.isConfirmed === ACTION_FAILURE && !this.isNewPasswordSame;
  }
}
