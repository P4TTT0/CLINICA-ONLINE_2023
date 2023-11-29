import { Injectable } from '@angular/core';
import { addDoc, collection, Firestore, getDoc, getDocs, updateDoc, collectionData, doc, query, where, orderBy, setDoc, onSnapshot, Timestamp } from
'@angular/fire/firestore';
import { BehaviorSubject, Observable, groupBy, map } from 'rxjs';
import { DateTimeFormatOptions } from 'intl';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public mesesOrdenados : string[] = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  constructor(private firestore : Firestore) { }

  public async GetUserEmailByUserName(userName: string): Promise<string | null> {
    const userCollection = collection(this.firestore, 'User');
    const q = query(userCollection, where('UserName', '==', userName));
    const querySnapshot = await getDocs(q);
  
    if (querySnapshot.empty) 
    {
      return null;
    }
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();
  
    if (userData && userData['Email']) {
      console.log(userData['Email']);
      return userData['Email'];
    } else {
      return null;
    }
  }


  public async getUserNameByUID(UIDUser: string)
  {
    const userCollection = collection(this.firestore, 'User');
    const userDoc = doc(userCollection, UIDUser);
    const userDocSnapshot = await getDoc(userDoc);
    if (userDocSnapshot.exists()) {
      const userData = userDocSnapshot.data();
      return userData['UserName'];
    } 
    else 
    {
      console.log('User not found');
      return '';
    }
  }

  public async userExist(userName : string)
  {
    const userCollection = collection(this.firestore, 'User');
    const q = query(userCollection, where('UserName', '==', userName));
    const querySnapshot = await getDocs(q);
  
    if (querySnapshot.empty) 
    {
      return false;
    }
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();
  
    if (userData['UserName'] == userName) 
    {
      return true;
    } 
    else 
    {
      return false;
    }
  }

  public async SaveUser(userUID : string, userData : any)
  {
    const userCollection = collection(this.firestore, 'User');
    const docRef = doc(userCollection, userUID);

    userData['JoinDate'] = new Date();

    await setDoc(docRef, userData);
  }

  public async UpdateValidationUser(userUID: string, validated : boolean): Promise<void> {
    const userCollection = collection(this.firestore, 'User');
    const docRef = doc(userCollection, userUID);

    await updateDoc(docRef, 
    {
      Validated: validated,
    });
  }

  public async UpdateHoursEspecialist(userUID: string, hours : any): Promise<void> {
    const userCollection = collection(this.firestore, 'User');
    const docRef = doc(userCollection, userUID);

    await updateDoc(docRef, hours);
  }

  public async getUIDByUserName(userName: string)
  {
    const userCollection = collection(this.firestore, 'User');
    const querySnapshot = await getDocs(query(userCollection, where('UserName', '==', userName)));
    
    if (querySnapshot.size === 0) {
      return null;
    }
    
    const userDoc = querySnapshot.docs[0];
    const userUID = userDoc.id;
    return userUID;
  }

  public async GetUsersNotAccepted(): Promise<any | null> {
    const userCollection = collection(this.firestore, 'User');
    const q = query(userCollection, where('Rol', '==', 'Especialista'));
    const querySnapshot = await getDocs(q);
  
    if (querySnapshot.empty) 
    {
      return null;
    }

    const users = querySnapshot.docs.map(doc => doc.data());

    return users;
  }

  public async getTurnoIdByDateTime(date : any, time : any)
  {
    const userCollection = collection(this.firestore, 'Turno');
    const querySnapshot = await getDocs(query(userCollection, where('Dia', '==', date.day), where('Mes', '==', date.monthText), where('Año', '==', date.year), where('Horario', '==', time)));
    
    if (querySnapshot.size === 0) {
      return null;
    }
    
    const userDoc = querySnapshot.docs[0];
    const userUID = userDoc.id;
    return userUID;
  }

  public async updateEstadoTurno(id : any, mensaje : string = "", estado : string)
  {
    const userCollection = collection(this.firestore, 'Turno');
    const docRef = doc(userCollection, id);

    await updateDoc(docRef, {
      Estad: estado,
      Mensaje: mensaje,
    });
  }

  public async updateRatingTurnoByTurnoId(id : any, rating : string, opinion : string)
  {
    const userCollection = collection(this.firestore, 'Turno');
    const docRef = doc(userCollection, id);

    await updateDoc(docRef, {
      Rating: rating,
      Opinion: opinion
    });
  }

  public async updateEncuestaByTurnoId(id : any, encuesta : any)
  {
    const userCollection = collection(this.firestore, 'Turno');
    const docRef = doc(userCollection, id);

    await updateDoc(docRef, {
      Encuesta: encuesta,
    });
  }
  

  public async getTurnosByUserName(userName : string): Promise<any | null> {
    const userCollection = collection(this.firestore, 'Turno');
    const q = query(userCollection, where('Paciente', '==', userName));
    const querySnapshot = await getDocs(q);
  
    if (querySnapshot.empty) 
    {
      return null;
    }

    const users = querySnapshot.docs.map(doc => doc.data());

    return users;
  }

  public getTurnosByEspecialistaUserName(userName: string): Observable<any[]> {
    const userCollection = collection(this.firestore, 'Turno');
    const q = query(userCollection, 
      where('Especialista', '==', userName),
      orderBy('Año'),
      orderBy('Mes'),  
      orderBy('Dia', ),  
      orderBy('Horario')  
    );

    return new Observable<any[]>((observer) => {
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const messages = querySnapshot.docs.map((doc) => doc.data());
        const sortedMessages = this.sortByCustomOrder(messages, this.mesesOrdenados, 'Mes');
        observer.next(sortedMessages);
      });

      return () => unsubscribe();
    });
  }

  public getTurnosByUserUserName(userName: string): Observable<any[]> {
    const userCollection = collection(this.firestore, 'Turno');
    const q = query(userCollection, 
      where('Paciente', '==', userName),
      orderBy('Año'),
      orderBy('Mes'),  
      orderBy('Dia', ),  
      orderBy('Horario')  
    );

    return new Observable<any[]>((observer) => {
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const messages = querySnapshot.docs.map((doc) => doc.data());
        const sortedMessages = this.sortByCustomOrder(messages, this.mesesOrdenados, 'Mes');
        observer.next(sortedMessages);
      });

      return () => unsubscribe();
    });
  }

  public getTurnos(): Observable<any[]> {

    const userCollection = collection(this.firestore, 'Turno');
    const q = query(userCollection,
      orderBy('Año'),
      orderBy('Mes'),  
      orderBy('Dia', ),  
      orderBy('Horario')  
    );

    return new Observable<any[]>((observer) => {
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const messages = querySnapshot.docs.map((doc) => doc.data());
        const sortedMessages = this.sortByCustomOrder(messages, this.mesesOrdenados, 'Mes');
        observer.next(sortedMessages);
      });

      return () => unsubscribe();
    });
  }

  public getTurnosToChart(): Observable<any[]> {
    const turnoCollection = collection(this.firestore, 'Turno');
    const q = query(turnoCollection,
      orderBy('Año'),
      orderBy('Mes'),  
      orderBy('Dia'),  
      orderBy('Horario')  
    );
  
    return new Observable<any[]>((observer) => {
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const turnos = querySnapshot.docs.map((doc) => doc.data());
  
        const turnosPorEspecialidad = this.groupAndCountBy(turnos, 'Especialidad');
  
        observer.next(turnosPorEspecialidad);
      });
  
      return () => unsubscribe();
    });
  }
  
  private groupAndCountBy(array: any[], property: string): any[] {
    const grouped = array.reduce((groups, item) => {
      const groupKey = item[property];
      groups[groupKey] = groups[groupKey] || { [property]: groupKey, count: 0 };
      groups[groupKey].count += 1;
      return groups;
    }, {});
  
    return Object.values(grouped);
  }

  private sortByCustomOrder(data: any[], customOrder: string[], field: string): any[] {
    return data.sort((a, b) => {
      const aValue = customOrder.indexOf(a[field]);
      const bValue = customOrder.indexOf(b[field]);
      return aValue - bValue;
    });
  }

  public async GetUsersToFab(): Promise<any | null> {
    const userCollection = collection(this.firestore, 'User');
    const q = query(userCollection, where('Fab', '==', true), orderBy('Rol', 'asc'));
    const querySnapshot = await getDocs(q);
  
    if (querySnapshot.empty) 
    {
      return null;
    }

    const users = querySnapshot.docs.map(doc => doc.data());

    return users;
  }

  public async GetUsuarios() : Promise<any | null> 
  {
    const userCollection = collection(this.firestore, 'User');
    const q = query(userCollection, where('Rol', '==', 'Usuario'));
    const querySnapshot = await getDocs(q);
  
    if (querySnapshot.empty) 
    {
      return null;
    }

    const users = querySnapshot.docs.map(doc => doc.data());

    return users;
  }

  public async GetEspecialistas(especialidad : string) : Promise<any | null> 
  {
    const userCollection = collection(this.firestore, 'User');
    const q = query(userCollection, where('Rol', '==', 'Especialista'), where('Especialidad', '==', especialidad));
    const querySnapshot = await getDocs(q);
  
    if (querySnapshot.empty) 
    {
      return null;
    }

    const users = querySnapshot.docs.map(doc => doc.data());

    return users;
  }

  public async GetPacientes(especialistaUserName: string, especialidad: string): Promise<string[] | null> {
    const userCollection = collection(this.firestore, 'Turno');
    const q = query(userCollection, where('Especialista', '==', especialistaUserName), where('Especialidad', '==', especialidad));
    const querySnapshot = await getDocs(q);
  
    if (querySnapshot.empty) {
      return null;
    }
  
    const pacientesSet = new Set<string>();
  
    querySnapshot.forEach((doc) => {
      const pacienteData = doc.data();
      const paciente = pacienteData['Paciente'];
      pacientesSet.add(paciente);
    });
  
    const pacientesList = Array.from(pacientesSet.values());
  
    return pacientesList;
  }

  public async GetPacientesByEspecialistaUserName(especialistaUserName: string): Promise<any[] | null> {
    const turnoCollection = collection(this.firestore, 'Turno');
    const turnoQuery = query(turnoCollection, where('Especialista', '==', especialistaUserName));
  
    try {
      const turnoQuerySnapshot = await getDocs(turnoQuery);
      
      if (turnoQuerySnapshot.empty) {
        return null;
      }
      
      const pacientesSet = new Set<string>();
      const pacientesPromises: Promise<any>[] = [];
      
      turnoQuerySnapshot.forEach((turnoDoc) => {
        const pacienteUserName = turnoDoc.data()['Paciente'];
        pacientesSet.add(pacienteUserName);
      });

  
      pacientesSet.forEach((pacienteUserName: string) => {
        const userCollection = collection(this.firestore, 'User');
        const pacienteQuery = query(userCollection, where('UserName', '==', pacienteUserName));
  
        const pacientePromise = getDocs(pacienteQuery).then((pacienteQuerySnapshot) => {
          if (!pacienteQuerySnapshot.empty) {
            return pacienteQuerySnapshot.docs[0].data();
          } else {
            return null;
          }
        });
  
        pacientesPromises.push(pacientePromise);
      });
  
      const pacientes = await Promise.all(pacientesPromises);
  
      const filteredPacientes = pacientes.filter((paciente) => paciente != null);
  
      return filteredPacientes.length > 0 ? filteredPacientes : null;
    } catch (error) {
      console.error('Error al obtener pacientes:', error);
      return null;
    }
  }
  
  
  

  public async IsDayOccupied(especialidad : string, especialista : string, day : any, month : any, year : any)
  {
    const userCollection = collection(this.firestore, 'Turno');
    const q = query(userCollection, where('Especialidad', '==', especialidad), where('Especialista', '==', especialista), where('Dia', '==', day), where('Mes', '==', month), where('Año', '==', year));
    const querySnapshot = await getDocs(q);
  
    if (querySnapshot.empty) 
    {
      return false;
    }
    else
    {
      return true;
    }
  }

  public async IsHourOcuppied(especialidad : string, especialista : string, day : any, month : any, year : any, hour : any)
  {
    const userCollection = collection(this.firestore, 'Turno');
    const q = query(userCollection, where('Especialidad', '==', especialidad), where('Especialista', '==', especialista), where('Dia', '==', day), where('Mes', '==', month), where('Año', '==', year), where('Horario', '==', hour));
    const querySnapshot = await getDocs(q);
  
    if (querySnapshot.empty) 
    {
      return false;
    }
    else
    {
      return true;
    }
  }

  public async GetEspecialidades() : Promise<any | null> 
  {
    const userCollection = collection(this.firestore, 'Especialidades');
    const q = query(userCollection);
    const querySnapshot = await getDocs(q);
  
    if (querySnapshot.empty) 
    {
      return null;
    }

    const especialidades = querySnapshot.docs.map(doc => doc.data());

    return especialidades;
  }

  public async GetEspecialidadesByEspecialistaUserName(especialistaUserName : string) : Promise<any | null> 
  {
    const userCollection = collection(this.firestore, 'Turno');
    const q = query(userCollection, where('UserName', '==', especialistaUserName));
    const querySnapshot = await getDocs(q);
  
    if (querySnapshot.empty) 
    {
      return null;
    }

    const especialidades = querySnapshot.docs.map(doc => doc.data()['Especialidad']);

    return especialidades;
  }

  public async GetEspecialidadesByPacienteUserName(pacienteUserName: string): Promise<string[] | null> {
    const userCollection = collection(this.firestore, 'Turno');
    const q = query(userCollection, where('Paciente', '==', pacienteUserName));
    const querySnapshot = await getDocs(q);
  
    if (querySnapshot.empty) {
      return null;
    }
  
    const especialidadesSet = new Set<string>();
  
    querySnapshot.forEach((doc) => {
      const especialidad = doc.data()['Especialidad'];
      const historiaClinica = doc.data()['HistoriaClinica'];
  
      if (especialidad && historiaClinica) {
        especialidadesSet.add(especialidad);
      }
    });
  
    const especialidades = Array.from(especialidadesSet);
  
    return especialidades;
  }
  

  public SaveTurno(turno : any)
  {
    const col = collection(this.firestore, 'Turno');
    addDoc(col, turno);
  }

  public async saveLog(log: any)
  {
    const col = collection(this.firestore, 'Log');
    addDoc(col, log);
  }

  public async getDaysToLog(): Promise<string[]> {
    const logCollection = collection(this.firestore, 'Log');

    // Consulta para obtener logs con un UserName específico
    const q = query(logCollection, orderBy('Date', 'asc'));

    // Obtener los documentos que coinciden con la consulta
    const querySnapshot = await getDocs(q);

    // Conjunto para almacenar fechas únicas
    const uniqueDates = new Set<string>();

    // Recorrer los documentos y formatear las fechas
    querySnapshot.forEach(doc => {
      const logData = doc.data();
      const date = logData?.['Date']?.toDate(); // Suponiendo que 'Date' es un objeto tipo Timestamp en Firestore

      if (date instanceof Date) {
        const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

        // Agregar la fecha al conjunto para asegurar unicidad
        uniqueDates.add(formattedDate);
      }
    });

    // Convertir el conjunto a un array antes de devolverlo
    const formattedDates = Array.from(uniqueDates);

    return formattedDates;
  }

  public async getCountsToLog(): Promise<number[]> {
    const logCollection = collection(this.firestore, 'Log');
  
    // Consulta para obtener logs con un UserName específico
    const q = query(logCollection, orderBy('Date', 'asc'));
  
    // Obtener los documentos que coinciden con la consulta
    const querySnapshot = await getDocs(q);
  
    // Objeto para almacenar la cantidad de registros por día
    const logsCountByDay: { [date: string]: number } = {};
  
    // Recorrer los documentos y contar registros por día
    querySnapshot.forEach(doc => {
      const logData = doc.data();
      const date = logData?.['Date']?.toDate(); // Suponiendo que 'Date' es un objeto tipo Timestamp en Firestore
  
      if (date instanceof Date) {
        // Formatear la fecha sin el horario
        const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  
        // Incrementar el contador para la fecha correspondiente
        logsCountByDay[formattedDate] = (logsCountByDay[formattedDate] || 0) + 1;
      }
    });
  
    // Convertir los valores del objeto a un array de números antes de devolverlo
    const resultArray = Object.values(logsCountByDay);
  
    return resultArray;
  }

  public async getLogs(dateString : string): Promise<number[]> {
    const logCollection = collection(this.firestore, 'Log'); 
    const dateParts = dateString.split('/');
    const dateObject = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
    dateObject.setDate(dateObject.getDate() + 1);
    const startOfRequestedDate = new Date(dateObject);
    startOfRequestedDate.setHours(0, 0, 0, 0); 
    const endOfRequestedDate = new Date(dateObject);
    endOfRequestedDate.setHours(23, 59, 59, 999);
    console.log(startOfRequestedDate, endOfRequestedDate);

    const q = query(logCollection, where('Date', '>=', startOfRequestedDate), where('Date', '<=', endOfRequestedDate));

    const querySnapshot = await getDocs(q);

    // Array para almacenar los resultados
    const logs: any[] = [];

    // Recorrer los documentos y almacenar la información
    querySnapshot.forEach(doc => {
      const logData = doc.data();
      logs.push(logData);
    });

    return logs;
  }

  public async getTurnosToChartByMes(nombreMes: string): Promise<{ Dia: number; CantidadTurnos: number }[]> {
    const turnoCollection = collection(this.firestore, 'Turno');
  
    // Obtener el número del mes
    const numeroMes = this.obtenerNumeroMes(nombreMes);
  
    // Consulta para obtener turnos del mes y ordenar por día
    const q = query(
      turnoCollection,
      where('Mes', '==', nombreMes),
      orderBy('Dia')
    );
  
    // Obtener los documentos que coinciden con la consulta
    const querySnapshot = await getDocs(q);
  
    // Objeto para almacenar la cantidad de turnos por día
    const turnosPorDia: { [dia: number]: number } = {};
  
    // Recorrer los documentos y contar la cantidad de turnos por día
    querySnapshot.forEach((doc) => {
      const turnoData = doc.data();
      const dia = turnoData?.['Dia'];
  
      if (dia) {
        // Incrementar la cantidad de turnos para el día
        turnosPorDia[dia] = (turnosPorDia[dia] || 0) + 1;
      }
    });
  
    // Convertir el objeto a un array de objetos con las propiedades Dia y CantidadTurnos
    const result = Object.entries(turnosPorDia).map(([dia, cantidadTurnos]) => ({
      Dia: parseInt(dia),
      CantidadTurnos: cantidadTurnos,
    }));
  
    return result;
  }
  
  private obtenerNumeroMes(nombreMes: string): number {
    const mesesOrdenados = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return mesesOrdenados.indexOf(nombreMes) + 1;
  }

  public async getTurnosToChartEspecialista(fechaDesde: Date, fechaHasta: Date, estado : boolean): Promise<{ Especialista: string; CantidadTurnos: number }[]> {
    const turnoCollection = collection(this.firestore, 'Turno');
  
    // Obtener el rango de fechas en formato Timestamp de Firestore
    const fechaDesdeFirestore = this.timeStampConvert(new Date(fechaDesde));
    const fechaHastaFirestore = this.timeStampConvert(new Date(fechaHasta));
    let q : any;
    if(estado)
    {
      q = query(turnoCollection,
        where('FechaCompleta', '>=', fechaDesdeFirestore),
        where('FechaCompleta', '<=', fechaHastaFirestore),
        where('Estad', '==', 'finalizado'),
      );
    }
    else
    {
      q = query(turnoCollection,
        where('FechaCompleta', '>=', fechaDesdeFirestore),
        where('FechaCompleta', '<=', fechaHastaFirestore),
      );
    }
  
    // Obtener los documentos que coinciden con la consulta
    const querySnapshot = await getDocs(q);
  
    // Objeto para almacenar la cantidad de turnos por especialista
    const turnosPorEspecialista: { [especialista: string]: number } = {};
  
    // Recorrer los documentos y contar la cantidad de turnos por especialista
    querySnapshot.forEach((doc) => {
      const turnoData : any = doc.data();
      const especialista = turnoData?.['Especialista'];
  
      if (especialista) {
        // Incrementar la cantidad de turnos para el especialista
        turnosPorEspecialista[especialista] = (turnosPorEspecialista[especialista] || 0) + 1;
      }
    });
  
    // Convertir el objeto a un array de objetos con las propiedades Especialista y CantidadTurnos
    const result = Object.entries(turnosPorEspecialista).map(([especialista, cantidadTurnos]) => ({
      Especialista: especialista,
      CantidadTurnos: cantidadTurnos,
    }));
  
    return result;
  }
  
  private timeStampConvert(fecha: Date): Timestamp {
    if (!(fecha instanceof Date)) {
      console.error('El valor pasado a timeStampConvert no es una instancia de Date:', fecha);
    }
  
    return Timestamp.fromDate(fecha);
  }

  public async getUserByUserName(userName : string)
  {
    const userCollection = collection(this.firestore, 'User');
    const q = query(userCollection, where('UserName', '==', userName));
    const querySnapshot = await getDocs(q);
    const userDoc = querySnapshot.docs[0];
    return userDoc.data();
  }

  public async getHistoriasByUserName(userName: string) {
    const userCollection = collection(this.firestore, 'Turno');
    const q = query(userCollection, where('Paciente', '==', userName));
    const querySnapshot = await getDocs(q);
  
    const historiasClinicas : any = [];
  
    querySnapshot.forEach((doc) => {
      historiasClinicas.push(doc.data()['HistoriaClinica']);
    });
  
    return historiasClinicas;
  }

  public async getJoinDateByUserName(userName : string)
  {
    const userCollection = collection(this.firestore, 'User');
    const q = query(userCollection, where('UserName', '==', userName));
    const querySnapshot = await getDocs(q);
    const userDoc = querySnapshot.docs[0];
    let user =  userDoc.data();
    return user['JoinDate'];
  }

  public async SaveEspecialidad(especialidad : string, userUID : string)
  {
    const userCollection = collection(this.firestore, 'User');
    const docRef = doc(userCollection, userUID);

    await updateDoc(docRef, {
      Especialidad: especialidad
    });
  }

  public async SaveHistoriaClinicaByUserName(historiaClinica : any)
  {
    const userCollection = collection(this.firestore, 'Turno');
    const docRef = doc(userCollection);

    await setDoc(docRef, historiaClinica);
  }

  public async saveHistoriaClinicaByTurnoId(id : any, historiaClinica : any)
  {
    const userCollection = collection(this.firestore, 'Turno');
    const docRef = doc(userCollection, id);

    await updateDoc(docRef, {
      HistoriaClinica: historiaClinica,
    });
  }

  public async SaveDNI(dni : string, userUID : string)
  {
    const userCollection = collection(this.firestore, 'User');
    const docRef = doc(userCollection, userUID);

    await updateDoc(docRef, {
      DNI: dni
    });
  }

  /**
   * This TypeScript function retrieves the role of a user based on their email or username.
   * @param {string} emailOrUsername - The parameter `emailOrUsername` is a string that represents
   * either an email address or a username.
   * @returns the value of the 'Rol' property from the user data.
   */
  public async getUserRolByEmailOrUserName(emailOrUsername: string)
  {
    try
    {
      const userCollection = collection(this.firestore, 'User');
      let q = query(userCollection, where('Email', '==', emailOrUsername));
      let querySnapshot = await getDocs(q);

      if (!emailOrUsername.includes('@')) 
      {
        q = query(userCollection, where('UserName', '==', emailOrUsername));
        querySnapshot = await getDocs(q);
      }
  
      if (querySnapshot.empty) 
      {
        return '';
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
    
      return userData['Rol'];
    }
    catch(error : any)
    {
      console.log('Error: ' + error);
    }
  }

  public async getValidationStateByUID(UIDUser: string)
  {
    try
    {
      const userCollection = collection(this.firestore, 'User');
      const userDoc = doc(userCollection, UIDUser);
      const userDocSnapshot = await getDoc(userDoc);
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        return userData['Validated'];
      } 
      else 
      {
        console.log('User not found');
        return '';
      }
    }
    catch(error : any)
    {
      console.log('Error: ' + error);
    }
  }
}
