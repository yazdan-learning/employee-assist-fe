import { useState, useEffect } from 'react';
import { FormikProps } from 'formik';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

interface UseFormStepsProps<T> {
  formik: FormikProps<T>;
  totalSteps: number;
  getFieldsForStep: (stepNumber: number) => string[];
  onSave?: () => Promise<void>;
}

interface UseFormStepsReturn {
  currentStep: number;
  invalidSteps: number[];
  handleStepChange: (targetStep: number) => void;
  handleNext: () => void;
  handlePrevious: () => void;
  handleSave: () => Promise<void>;
  validateStep: (stepNumber: number) => boolean;
  validateCurrentStep: () => boolean;
  validateAllSteps: () => boolean;
}

export const useFormSteps = <T extends object>({
  formik,
  totalSteps,
  getFieldsForStep,
  onSave,
}: UseFormStepsProps<T>): UseFormStepsReturn => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [invalidSteps, setInvalidSteps] = useState<number[]>([]);

  // Watch for form changes and update invalid steps
  useEffect(() => {
    const validateAllSteps = () => {
      const invalidStepsList: number[] = [];
      
      // Validate each step
      for (let step = 1; step <= totalSteps; step++) {
        if (!validateStep(step)) {
          invalidStepsList.push(step);
        }
      }

      setInvalidSteps(invalidStepsList);
    };

    // Debounce the validation to avoid too many updates
    const timeoutId = setTimeout(validateAllSteps, 300);

    return () => clearTimeout(timeoutId);
  }, [formik.values, formik.errors]);

  const validateStep = (stepNumber: number): boolean => {
    const fields = getFieldsForStep(stepNumber);
    
    // Touch all fields in the step to show validation errors
    fields.forEach((field) => {
      formik.setFieldTouched(field, true);
    });

    // Check if there are any errors in the step's fields
    const hasErrors = fields.some((field) => formik.errors[field]);

    return !hasErrors;
  };

  const validateCurrentStep = (): boolean => {
    return validateStep(currentStep);
  };

  const validateAllSteps = (): boolean => {
    const invalidStepsList: number[] = [];
    
    // Validate each step
    for (let step = 1; step <= totalSteps; step++) {
      if (!validateStep(step)) {
        invalidStepsList.push(step);
      }
    }

    setInvalidSteps(invalidStepsList);
    return invalidStepsList.length === 0;
  };

  const handleStepChange = (targetStep: number) => {
    // Always validate current step before any navigation
    if (!validateCurrentStep()) {
      return;
    }
    
    setCurrentStep(targetStep);
  };

  const handleNext = () => {
    handleStepChange(currentStep + 1);
  };

  const handlePrevious = () => {
    handleStepChange(currentStep - 1);
  };

  const handleSave = async () => {
    try {
      // Validate all steps before saving
      if (!validateAllSteps()) {
        toast.error(t('form.messages.completeAllSteps'));
        return;
      }

      // Touch all fields to show all validation errors
      Object.keys(formik.values).forEach((field) => {
        formik.setFieldTouched(field, true);
      });

      // Validate all fields
      const errors = await formik.validateForm();
      const hasErrors = Object.keys(errors).length > 0;

      if (hasErrors) {
        return;
      }

      // Call the provided save function if it exists
      if (onSave) {
        await onSave();
      } else {
        // Otherwise submit the form
        await formik.submitForm();
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error(t("form.messages.saveError"));
    }
  };

  return {
    currentStep,
    invalidSteps,
    handleStepChange,
    handleNext,
    handlePrevious,
    handleSave,
    validateStep,
    validateCurrentStep,
    validateAllSteps,
  };
}; 