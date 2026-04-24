import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NewPost, Post } from '../../../dto/post';

@Component({
  selector: 'app-blog-post-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './blog-post-form.html',
  styleUrl: './blog-post-form.scss',
})
export class BlogPostForm implements OnChanges {
  @Input() public post: Post | null = null;
  @Input() public mode: 'add' | 'edit' = 'add';
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
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['post'] || changes['mode']) {
      this.fillForm();
    }
  }

  protected get isEditMode(): boolean {
    return this.mode === 'edit';
  }

  protected get titleControl(): FormControl<string> {
    return this.postForm.controls.title;
  }

  protected get textControl(): FormControl<string> {
    return this.postForm.controls.text;
  }

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
      title: this.post?.title ?? '',
      text: this.post?.text ?? '',
    });
  }

  protected isInvalid(control: FormControl<string>): boolean {
    return control.invalid && (control.touched || this.isSubmitted);
  }
}