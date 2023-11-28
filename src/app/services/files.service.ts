import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import { HttpClient } from '@angular/common/http';
import autoTable from 'jspdf-autotable'


@Injectable({
  providedIn: 'root'
})
export class FilesService {

  public logoPath : string = "./../../../assets/Isotipo_NoBCK_GREN.png";

  constructor(private http : HttpClient) { }

  public downloadArrayToXLSX(array : any[])
  {
    const worksheet = XLSX.utils.json_to_sheet(array);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    saveAs(
      new Blob([excelBuffer]),
      'sas.xlsx',
    );
  }


  public async downloadPDF(arrayInfo : any[])
  {
    const pdf = new jsPDF();

    var fecha = "Reporte emitido el " + new Date().toLocaleDateString();
    var title = "Historias clinicas de " + arrayInfo[0].Paciente;

    // Obtener las dimensiones de la página
    const pageSize = pdf.internal.pageSize;
    const pageWidth = pageSize.getWidth();
    const pageHeight = pageSize.getHeight();

    let logoBase64 = await this.convertImageToBase64(this.logoPath);

    const logoWidth = 100;
    const logoHeight = 100;
    const logoX = (pageWidth - logoWidth) / 2;
    const logoY = (pageHeight - logoHeight) / 2;

    pdf.addImage(logoBase64, 'JPEG', logoX, logoY, logoWidth, logoHeight);

    pdf.setFontSize(25);
    pdf.setFont("helvetica", "bold");
    pdf.text(title, pageWidth / 2, 50, { align: "center" });
   
    // Configurar fuente y tamaño para el texto de la fecha
    pdf.setFontSize(25);
    pdf.setFont("helvetica", "normal");
    pdf.text(fecha, pageWidth / 2, pageHeight - 30, { align: "center" });
   
    pdf.addPage();

    const clavesUnicas = new Set<string>();

    for (let i = 0; i < arrayInfo.length; i++) {
      const objeto = arrayInfo[i];
    
      for (const clave in objeto) {
        if (objeto.hasOwnProperty(clave)) {
          clavesUnicas.add(clave);    
        }
      }
    }

    const columns = Array.from(clavesUnicas);
    let filas : any[] = [];

    for (var i = 0; i < arrayInfo.length; i++) {
      filas.push(Object.values(arrayInfo[i]));
    }

    autoTable(pdf, {
        columns: columns,
        body: filas,
        theme: 'grid',
        styles: { fontSize: 8 }
    });    

    pdf.save(arrayInfo[0].Paciente + '_' + arrayInfo[0].Especialidad + '.pdf');
  }

  convertImageToBase64(imagen: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.http.get(imagen, { responseType: 'blob' }).subscribe((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result;
          resolve(base64data as string);
        };
        reader.onerror = () => {
          reject('Error al leer la imagen');
        };
        reader.readAsDataURL(blob);
      }, reject);
    });
  }
}
