import {
  Component,
  computed,
  effect,
  EventEmitter,
  Output,
  input,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NewPost, Post } from '../../../dto/post';
import { FormMode } from '../../../dto/form-mode';

type MinLengthValidationInfo = {
  requiredLength: number;
  actualLength: number;
};

@Component({
  selector: 'app-blog-post-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './blog-post-form.html',
  styleUrl: './blog-post-form.scss',
})
export class BlogPostForm {
  public post = input<Post | null>(null);
  public mode = input<FormMode>('add');
  @Output() public save = new EventEmitter<NewPost>();
  @Output() public cancel = new EventEmitter<void>();

  protected postForm: FormGroup<{
    title: FormControl<string>;
    text: FormControl<string>;
  }>;
  protected isSubmitted = false;

  constructor(private fb: FormBuilder) {
    this.postForm = this.fb.nonNullable.group({
      title: ['', [Validators.required, Validators.minLength(25)]],
      text: ['', [Validators.required]],
    });

    effect(() => {
      this.post();
      this.mode();
      this.fillForm();
    });
  }

  protected isEditMode = computed<boolean>(() => this.mode() === 'edit');

  protected formTitle = computed<string>(() => this.isEditMode() ? 'Изменить статью' : 'Добавить статью');

  protected saveButtonTitle = computed<string>(() => this.isEditMode() ? 'Сохранить' : 'Добавить');

  protected onSave(): void {
    this.isSubmitted = true;

    if (this.postForm.invalid) {
      this.postForm.markAllAsTouched();
      return;
    }

    const value = this.postForm.getRawValue();
    this.save.emit({
      title: value.title,
      text: value.text,
    });
  }

  protected onCancel(): void {
    this.cancel.emit();
  }

  private fillForm(): void {
    this.isSubmitted = false;
    this.postForm.reset({
      title: this.post()?.title ?? '',
      text: this.post()?.text ?? '',
    });
  }

  protected hasError(controlName: string): boolean {
    const control = this.postForm.get(controlName);
    const isInvalid = control?.invalid && (control.touched || this.isSubmitted);

    return Boolean(isInvalid);
  }

  protected getControlErrors(controlName: string): string[] {
    const control = this.postForm.get(controlName);
    const errors: Record<string, unknown> | null = control?.errors ?? null;

    if (!errors) {
      return [];
    }

    return Object.entries(errors).map(([errorKey, errorValue]) => this.getErrorStr(controlName, errorKey, errorValue));
  }

  private getErrorStr(controlName: string, errorCode: string, errorData: unknown): string {
    if (controlName === 'title') {
      switch (errorCode) {
        case 'required':
          return 'Название статьи обязательно';
        case 'minlength': {
          const { requiredLength, actualLength } = errorData as MinLengthValidationInfo;
          return `Нужно еще ${requiredLength - actualLength} символов`;
        }
        default:
          return 'Ошибка при заполнении заголовка';
      }
    }

    if (controlName === 'text') {
      switch (errorCode) {
        case 'required':
          return 'Текст статьи обязателен';
        default:
          return 'Ошибка при заполнении текста';
      }
    }

    return 'Ошибка при заполнении поля';
  }
}