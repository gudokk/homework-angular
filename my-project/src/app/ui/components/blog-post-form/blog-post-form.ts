import {
  Component,
  computed,
  effect,
  EventEmitter,
  Output,
  Signal,
  input,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NewPost, Post } from '../../../dto/post';
import { FormMode } from '../../../dto/form-mode';
import { startWith } from 'rxjs';

type MinLengthValidationInfo = {
  requiredLength: number;
  actualLength: number;
};

@Component({
  selector: 'app-blog-post-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
  ],
  templateUrl: './blog-post-form.html',
  styleUrl: './blog-post-form.scss',
})
export class BlogPostForm {
  public post = input<Post | null>(null);
  public mode = input<FormMode>('add');
  public categoryOptions = input<string[]>([]);
  @Output() public save = new EventEmitter<NewPost>();
  @Output() public cancel = new EventEmitter<void>();

  protected postForm: FormGroup<{
    title: FormControl<string>;
    text: FormControl<string>;
    categoryName: FormControl<string>;
  }>;
  protected isSubmitted = false;
  protected selectedImage: File | null = null;
  protected imagePreviewUrl: string | null = null;

  private categoryInput!: Signal<string | undefined>;

  constructor(private fb: FormBuilder) {
    this.postForm = this.fb.nonNullable.group({
      title: ['', [Validators.required, Validators.minLength(25)]],
      text: ['', [Validators.required]],
      categoryName: ['', Validators.required],
    });

    this.categoryInput = toSignal(
      this.postForm.controls.categoryName.valueChanges.pipe(startWith('')),
      { initialValue: '' },
    );

    effect(() => {
      this.post();
      this.mode();
      this.fillForm();
    });
  }

  protected filteredCategoryOptions = computed(() => {
    const value = (this.categoryInput() ?? '').toLowerCase();
    const options = this.categoryOptions();
    if (!value) {
      return options;
    }
    return options.filter((name) => name.toLowerCase().includes(value));
  });

  protected isEditMode = computed<boolean>(() => this.mode() === 'edit');

  protected formTitle = computed<string>(() => (this.isEditMode() ? 'Изменить статью' : 'Добавить статью'));

  protected saveButtonTitle = computed<string>(() => (this.isEditMode() ? 'Сохранить' : 'Добавить'));

  protected onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.selectedImage = file;
    if (this.imagePreviewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(this.imagePreviewUrl);
    }
    this.imagePreviewUrl = file ? URL.createObjectURL(file) : null;
  }

  protected onSave(): void {
    this.isSubmitted = true;

    if (this.postForm.invalid) {
      this.postForm.markAllAsTouched();
      return;
    }

    const value = this.postForm.getRawValue() as {
      title: string;
      text: string;
      categoryName: string;
    };
    this.save.emit({
      title: value.title,
      text: value.text,
      categoryName: value.categoryName.trim(),
      imageFile: this.selectedImage,
    });
  }

  protected onCancel(): void {
    this.cancel.emit();
  }

  protected currentImageSrc(): string | null {
    if (this.imagePreviewUrl) {
      return this.imagePreviewUrl;
    }
    return this.post()?.imageUrl ?? null;
  }

  private fillForm(): void {
    this.isSubmitted = false;
    this.selectedImage = null;
    if (this.imagePreviewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(this.imagePreviewUrl);
    }
    this.imagePreviewUrl = null;

    this.postForm.reset({
      title: this.post()?.title ?? '',
      text: this.post()?.text ?? '',
      categoryName: this.post()?.categoryName ?? '',
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

    return Object.entries(errors).map(([errorKey, errorValue]) =>
      this.getErrorStr(controlName, errorKey, errorValue),
    );
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

    if (controlName === 'categoryName') {
      switch (errorCode) {
        case 'required':
          return 'Укажите категорию';
        default:
          return 'Ошибка при заполнении категории';
      }
    }

    return 'Ошибка при заполнении поля';
  }
}
