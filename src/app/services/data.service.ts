import { Injectable } from '@angular/core';
import { addDoc, collection, Firestore, getDoc, getDocs, updateDoc, collectionData, doc, query, where, orderBy, setDoc, onSnapshot } from
'@angular/fire/firestore';
import { BehaviorSubject, Observable, groupBy, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

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
    const q = query(userCollection, where('Especialista', '==', userName));
  
    return new Observable<any[]>((observer) => {
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const messages = querySnapshot.docs.map((doc) => doc.data());
        observer.next(messages);
      });

      return () => unsubscribe();
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
    const userCollection = collection(this.firestore, 'User');
    const q = query(userCollection, where('UserName', '==', especialistaUserName));
    const querySnapshot = await getDocs(q);
  
    if (querySnapshot.empty) 
    {
      return null;
    }

    const especialidades = querySnapshot.docs.map(doc => doc.data()['Especialidad']);

    return especialidades;
  }

  public SaveTurno(turno : any)
  {
    const col = collection(this.firestore, 'Turno');
    addDoc(col, turno);
  }

  public async getUserByUserName(userName : string)
  {
    const userCollection = collection(this.firestore, 'User');
    const q = query(userCollection, where('UserName', '==', userName));
    const querySnapshot = await getDocs(q);
    const userDoc = querySnapshot.docs[0];
    return userDoc.data();
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
