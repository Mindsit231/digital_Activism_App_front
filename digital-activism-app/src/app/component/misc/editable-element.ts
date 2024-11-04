import {EditableElementType} from "./editable-element-type";

export class EditableElement {
  name: string;
  private _value: string;

  editableElementType: EditableElementType;
  isEditable: boolean = true;

  constructor(name: string, value: string, editableElementType: EditableElementType, isEditable?: boolean) {
    this.name = name;
    this._value = value;
    this.editableElementType = editableElementType;

    if (isEditable !== undefined) {
      this.isEditable = isEditable;
    }
  }

  get value(): string {
    return this._value;
  }

  set value(value: string) {
    this._value = value;
  }
}

export const usernameElement = new EditableElement('Username', '', EditableElementType.TEXT);
export const passwordElement = new EditableElement('Password', '', EditableElementType.PASSWORD);
export const emailElement = new EditableElement('Email', '', EditableElementType.EMAIL, false);

export const editableElements: EditableElement[] = [
  usernameElement,
  emailElement,
  passwordElement,
];
