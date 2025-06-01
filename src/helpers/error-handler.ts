import toastr from "toastr";
import "toastr/build/toastr.min.css";
import { NavigateFunction } from "react-router-dom";
import i18next from "i18next";

interface ErrorHandlerOptions {
  shouldRedirect?: boolean;
  customMessage?: string;
  navigate?: NavigateFunction;
}

// Add custom CSS for toastr
const style = document.createElement('style');
style.textContent = `
  #toast-container > .toast {
    background-image: none !important;
    padding: 15px 15px 15px 50px;
    width: 300px;
    color: #ffffff !important;
  }
  #toast-container > .toast:before {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    font-family: 'Font Awesome 5 Free';
    font-size: 24px;
    font-weight: 900;
    color: #ffffff;
  }
  #toast-container > .toast-error {
    background-color: #f46a6a !important;
  }
  #toast-container > .toast-success {
    background-color: #34c38f !important;
  }
  #toast-container > .toast-info {
    background-color: #50a5f1 !important;
  }
  #toast-container > .toast-warning {
    background-color: #f1b44c !important;
  }
  #toast-container > .toast-error:before {
    content: '\\f071';
  }
  #toast-container > .toast-success:before {
    content: '\\f058';
  }
  #toast-container > .toast-info:before {
    content: '\\f05a';
  }
  #toast-container > .toast-warning:before {
    content: '\\f06a';
  }
`;
document.head.appendChild(style);

// Configure toastr defaults with proper styling
toastr.options = {
  closeButton: true,
  debug: false,
  newestOnTop: true,
  progressBar: true,
  positionClass: "toast-top-right",
  preventDuplicates: false,
  onclick: null,
  showDuration: "300",
  hideDuration: "1000",
  timeOut: "5000",
  extendedTimeOut: "1000",
  showEasing: "swing",
  hideEasing: "linear",
  showMethod: "fadeIn",
  hideMethod: "fadeOut",
  // Fix text visibility
  toastClass: 'toast',
  containerId: 'toast-container',
  iconClasses: {
    error: 'toast-error',
    info: 'toast-info',
    success: 'toast-success',
    warning: 'toast-warning'
  }
};

export const handleError = (error: any, options: ErrorHandlerOptions = {}) => {
  const { customMessage } = options;
  const t = i18next.t;

  // If a custom message is provided, use it instead of the error message
  const message = customMessage || error.message;

  switch (error.status) {
    case 500:
      toastr.error(t("errors.internal_server_error"));
      break;

    case 404:
      toastr.error(message || t("errors.not_found"));
      break;

    case 401:
      toastr.error(t("errors.session_expired"));
      // Just clear auth data, let the auth interceptor handle redirect
      localStorage.removeItem("authUser");
      break;

    case 403:
      toastr.error(t("errors.permission_denied"));
      break;

    case 400:
      // Bad request - usually validation errors from the server
      toastr.error(message || t("errors.invalid_request"));
      break;

    case 422:
      // Unprocessable Entity - usually validation errors
      toastr.error(message || t("errors.invalid_data"));
      break;

    default:
      // For network errors or other unhandled errors
      if (error.message === "Network Error") {
        toastr.error(t("errors.network_error"));
      } else {
        toastr.error(message || t("errors.unexpected_error"));
      }
  }

  // Log error for debugging
  console.error("API Error:", error);
}; 