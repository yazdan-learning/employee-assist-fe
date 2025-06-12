import React from 'react';
import { Row, Col } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { Check } from 'react-feather';

export interface Step {
  icon: React.ReactNode;
  title: string;
  description?: string;
}

interface StepIndicatorProps {
  currentStep: number;
  steps: Step[];
  onStepClick?: (stepIndex: number) => void;
  allowStepClick?: boolean;
  invalidSteps?: number[];
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ 
  currentStep, 
  steps, 
  onStepClick,
  allowStepClick = true,
  invalidSteps = []
}) => {
  const styles = {
    wrapper: {
      padding: '40px 0',
      marginBottom: '30px',
    },
    stepItem: {
      position: 'relative' as const,
      textAlign: 'center' as const,
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
    },
    stepCircle: {
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f8f9fa',
      border: '2px solid #e9ecef',
      color: '#6c757d',
      position: 'relative' as const,
      zIndex: 2,
      transition: 'all 0.3s ease',
      cursor: 'pointer',
    },
    activeCircle: {
      background: '#e3f2fd',
      border: '2px solid #2196f3',
      color: '#2196f3',
      boxShadow: '0 0 0 4px rgba(33, 150, 243, 0.1)',
    },
    completedCircle: {
      background: '#e8f5e9',
      border: '2px solid #4caf50',
      color: '#4caf50',
    },
    clickableCircle: {
      cursor: 'pointer',
      '&:hover': {
        transform: 'scale(1.05)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      },
    },
    disabledCircle: {
      cursor: 'not-allowed',
      opacity: 0.5,
    },
    stepInfo: {
      marginTop: '12px',
      textAlign: 'center' as const,
      maxWidth: '200px',
      cursor: 'pointer',
    },
    stepTitle: {
      margin: 0,
      fontSize: '14px',
      fontWeight: 600,
      color: '#2c3e50',
      transition: 'color 0.3s ease',
    },
    clickableTitle: {
      '&:hover': {
        color: '#2196f3',
      },
    },
    disabledTitle: {
      color: '#adb5bd',
      cursor: 'not-allowed',
    },
    stepDescription: {
      margin: '4px 0 0',
      fontSize: '12px',
      color: '#6c757d',
      display: 'none',
    },
    connector: {
      position: 'absolute' as const,
      top: '25px',
      left: 'calc(-50% + 25px)',
      right: 'calc(50% + 25px)',
      height: '2px',
      background: '#e9ecef',
      zIndex: 1,
    },
    completedConnector: {
      background: '#4caf50',
    },
    checkIcon: {
      position: 'absolute' as const,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    },
    invalidCircle: {
      background: '#ffebee',
      border: '2px solid #f44336',
      color: '#f44336',
      boxShadow: '0 0 0 4px rgba(244, 67, 54, 0.1)',
    },
    invalidTitle: {
      color: '#f44336',
    },
  };

  const handleStepClick = (index: number) => {
    if (!allowStepClick || !onStepClick) return;
    onStepClick(index + 1);
  };

  return (
    <div style={styles.wrapper}>
      <Row className="justify-content-center">
        {steps.map((step, index) => {
          const isClickable = allowStepClick && index + 1 <= currentStep;
          const isDisabled = index + 1 > currentStep;
          const isInvalid = invalidSteps.includes(index + 1);
          
          return (
            <Col key={index} style={styles.stepItem}>
              {index > 0 && (
                <div 
                  style={{
                    ...styles.connector,
                    ...(currentStep > index ? styles.completedConnector : {}),
                    ...(isInvalid ? { background: '#f44336' } : {})
                  }}
                />
              )}
              <div 
                style={{
                  ...styles.stepCircle,
                  ...(currentStep > index + 1 ? styles.completedCircle : {}),
                  ...(currentStep === index + 1 ? styles.activeCircle : {}),
                  ...(isClickable ? styles.clickableCircle : {}),
                  ...(isDisabled ? styles.disabledCircle : {}),
                  ...(isInvalid ? styles.invalidCircle : {})
                }}
                onClick={() => handleStepClick(index)}
              >
                {currentStep > index + 1 ? <Check size={20} /> : step.icon}
              </div>
              <div 
                style={styles.stepInfo}
                onClick={() => handleStepClick(index)}
              >
                <h5 
                  style={{
                    ...styles.stepTitle,
                    ...(isClickable ? styles.clickableTitle : {}),
                    ...(isDisabled ? styles.disabledTitle : {}),
                    ...(isInvalid ? styles.invalidTitle : {})
                  }}
                >
                  {step.title}
                </h5>
                {step.description && (
                  <p style={styles.stepDescription}>{step.description}</p>
                )}
              </div>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default StepIndicator; 