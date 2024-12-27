import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastr: ToastrService) { }

  success(msg: string, title: string) {
    this.toastr.success(msg, title, {
      progressBar: true,
      timeOut: 5000,
      progressAnimation: "decreasing"
    });
  }
  info(msg: string, title: string) {
    this.toastr.info(msg, title, {
      progressBar: true,
      timeOut: 5000,
      progressAnimation: "decreasing"
    });
  }
  error(msg: string, title: string) {
    this.toastr.error(msg, title, {
      progressBar: true,
      timeOut: 5000,
      progressAnimation: "decreasing"
    });
  }
  notifySomeWrong() {
    this.toastr.error("Something Went Wrong! please contact system administrator.", "Error", {
      enableHtml: true,
      progressBar: true,
      timeOut: 5000,
      progressAnimation: "decreasing"
    });
  }
  warning(msg: string, title: string) {
    this.toastr.warning(msg, title, {
      progressBar: true,
      timeOut: 5000,
      progressAnimation: "decreasing"
    });
  }


  addConfirmationRemarks(message: string): Promise<any> {
    return Swal.fire({
      icon: "question",
      text: message,
      input: 'textarea',
      inputPlaceholder: 'Enter your Remarks...',
      showCloseButton: true,
      confirmButtonText: 'Submit',
      preConfirm: (inputValue) => {
        return new Promise((resolve) => {
          if (inputValue === '') {
            Swal.showValidationMessage('Add Remarks');
            resolve(false);
          } else {
            resolve(inputValue);
          }
        });
      },
      allowOutsideClick: () => !Swal.isLoading() // Prevent closing the dialog when clicking outside if it's still loading
    }).then((result) => {
      return result;
    });
  }
  addConfirmationArrear(message: string): Promise<any> {
    return Swal.fire({
      icon: "question",
      text: message,
      input: 'number',
      inputPlaceholder: 'Please Enter Arrear Amount',
      showCloseButton: true,
      confirmButtonText: 'Submit',
      preConfirm: (inputValue) => {
        return new Promise((resolve) => {
          if (inputValue === '') {
            Swal.showValidationMessage('Add Arrear');
            resolve(false);
          } else {
            resolve(inputValue);
          }
        });
      },
      allowOutsideClick: () => !Swal.isLoading() // Prevent closing the dialog when clicking outside if it's still loading
    }).then((result) => {
      return result;
    });
  }
  addConfirmationConsolidation(message: string): Promise<any> {
    return Swal.fire({
      icon: "question",
      text: message,
      inputLabel: "Want to add in existing Consolidation then add consolidation Code here",
      input: 'text',
      inputPlaceholder: 'Consoldation Code',
      showCloseButton: true,
      confirmButtonText: 'Submit',
      preConfirm: (inputValue) => {
        return new Promise((resolve) => {
          if (inputValue === '') {
            resolve('');
          } else {
            resolve(inputValue);
          }
        });
      },
      allowOutsideClick: () => !Swal.isLoading() // Prevent closing the dialog when clicking outside if it's still loading
    }).then((result) => {
      return result;
    });
  }
  showConfirmation(message: string): Promise<boolean> {
    return Swal.fire({
      title: 'Confirmation',
      text: message,
      icon: 'question',
      showCancelButton: true,
    }).then((result) => {
      return result.isConfirmed;
    });
  }
  showSuccessMessage(message: string): void {
    Swal.fire({
      title: "Success",
      text: message,
      icon: "success",
      timer: 1500
    });
  }
  showErrorMessage(message: string): void {
    Swal.fire({
      title: 'Error',
      text: message,
      icon: 'error',
      timer: 1500
    });
  }
  showInforMessage(message: string): void {
    Swal.fire({
      title: 'Infor',
      text: message,
      icon: 'error',
      timer: 15000
    });
  }
  excpetionHandle(err: any) {
    if (err.status == 400) {
      debugger;
      this.warning(err.error.response, "Errors");
    } else {
      this.error("Error!!", "something went wrong.");
    }
  }




  private isRefreshingSource = new BehaviorSubject<boolean>(false);
  isRefreshing$ = this.isRefreshingSource.asObservable();
  isRefreshingInfo$(isRefreshing: boolean) {
    this.isRefreshingSource.next(isRefreshing);
  }

  private isErrorSource = new BehaviorSubject<boolean>(false);
  isError$ = this.isErrorSource.asObservable();
  isErrorInfo$(isError: boolean) {
    this.isErrorSource.next(isError);
  }
}
