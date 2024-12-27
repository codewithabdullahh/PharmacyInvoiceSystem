import { Component } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ReportService } from '../Services/report.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportData } from '../Model/report';
import { NotificationService } from '../Services/notification.service';

@Component({
  selector: 'app-view-bill',
  templateUrl: './view-bill.component.html',
  styleUrl: './view-bill.component.css'
})
export class ViewBillComponent {

  reportDataRespone: ReportData[] = [];

  constructor(private reportService: ReportService,
    private route: ActivatedRoute,
    private notificationService: NotificationService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      debugger;
      const reportId = params.get('reportId');
      const customerId = params.get('customerId');
      debugger;
      this.getReportData(reportId, customerId);

    });
  }
  getReportData(reportId: string | null, customerId: string | null) {
    this.reportService.getReportData(reportId, customerId).subscribe({
      next: (data: any) => {
        debugger
        this.reportDataRespone = data;
      },
      error: (err: any) => {
        this.notificationService.excpetionHandle(err);
      }
    })
  }
  downloadPDF(): void {
    const content = document.getElementById('contentToDownload'); // Make sure this ID matches your HTML

    if (content) {
      html2canvas(content, { scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');

        // Adjust width and height of the PDF
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('invoice.pdf');
      });
    }
  }
  //printContent(): void {
  //  const printContents = document.getElementById('contentToDownload')?.innerHTML;
  //  if (printContents) {
  //    const originalContents = document.body.innerHTML;
  //    document.body.innerHTML = printContents;

  //    window.print();

  //    document.body.innerHTML = originalContents;
  //    window.location.reload();  // Optional: reloads to restore original state
  //  }
  //}
  printContent(): void {
    const printContents = document.getElementById('contentToDownload')?.innerHTML;
    if (printContents) {
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
    }
  }
  printContents(): void {
    window.print();
  }
}
