import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface Invoice {
  id?: number;
  orderNumber: number;
  invoiceNumber: number;
  items: any[];
  total: number;
  userInfo: {
    nombre: string;
    email: string;
    direccion: string;
  };
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private apiUrl = 'https://api-jogo-qucx.onrender.com';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  private invoices: Invoice[] = [];
  private invoicesSubject = new BehaviorSubject<Invoice[]>(this.invoices);
  invoices$ = this.invoicesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadInvoices();
  }

  private loadInvoices() {
    this.http.get<Invoice[]>(`${this.apiUrl}/invoices`).subscribe(data => {
      this.invoices = data;
      this.invoicesSubject.next(this.invoices);
    });
  }

  getInvoices(): Invoice[] {
    return this.invoices;
  }

  addInvoice(invoice: Invoice) {
    this.http.post<Invoice>(`${this.apiUrl}/invoices`, invoice, this.httpOptions).subscribe({
      next: (response) => {
        this.invoices.push(response);
        this.invoicesSubject.next(this.invoices);
        console.log('Factura agregada con éxito');
      },
      error: (error) => {
        console.error('Error al agregar factura', error);
      }
    });
  }

  updateInvoice(invoice: Invoice) {
    this.http.put(`${this.apiUrl}/invoices/${invoice.id}`, invoice, this.httpOptions).subscribe({
      next: () => {
        const index = this.invoices.findIndex(i => i.id === invoice.id);
        if (index !== -1) {
          this.invoices[index] = invoice;
          this.invoicesSubject.next(this.invoices);
        }
        console.log('Factura actualizada con éxito');
      },
      error: (error) => {
        console.error('Error al actualizar factura', error);
      }
    });
  }

  deleteInvoice(invoiceId: number) {
    const url = `${this.apiUrl}/invoices/${invoiceId}`;
    this.http.delete(url, this.httpOptions).subscribe({
      next: () => {
        this.invoices = this.invoices.filter(i => i.id !== invoiceId);
        this.invoicesSubject.next(this.invoices);
        console.log('Factura eliminada con éxito');
      },
      error: (error) => {
        console.error('Error al eliminar la factura', error);
      }
    });
  }

  getInvoiceById(invoiceId: number): Observable<Invoice | undefined> {
    return this.http.get<Invoice[]>(`${this.apiUrl}/invoices`).pipe(
      map(invoices => invoices.find(invoice => invoice.id === invoiceId))
    );
  }
}
