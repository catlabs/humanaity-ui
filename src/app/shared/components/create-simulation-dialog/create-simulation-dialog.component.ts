import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CityService } from '../../../city/city.service';
import { CityOutput } from '../../../api/model/models';

@Component({
  selector: 'app-create-simulation-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './create-simulation-dialog.component.html',
  styleUrl: './create-simulation-dialog.component.scss'
})
export class CreateSimulationDialogComponent {
  private fb = inject(FormBuilder);
  private cityService = inject(CityService);
  public dialogRef = inject(MatDialogRef<CreateSimulationDialogComponent>);

  simulationForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor() {
    this.simulationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]]
    });
  }

  onSubmit(): void {
    if (this.simulationForm.valid) {
      this.errorMessage = '';
      this.isLoading = true;
      const { name } = this.simulationForm.value;

      this.cityService.createCity({ name }).subscribe({
        next: (city: CityOutput) => {
          this.isLoading = false;
          // Close dialog and return the created city
          this.dialogRef.close(city);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Failed to create simulation. Please try again.';
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.simulationForm.controls).forEach(key => {
      const control = this.simulationForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.simulationForm.get(fieldName);
    if (control?.hasError('required')) {
      return `${fieldName} is required`;
    }
    if (control?.hasError('minlength')) {
      return 'Simulation name must be at least 1 character';
    }
    if (control?.hasError('maxlength')) {
      return 'Simulation name must not exceed 100 characters';
    }
    return '';
  }
}

