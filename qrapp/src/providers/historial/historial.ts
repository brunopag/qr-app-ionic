import { Injectable } from '@angular/core';
import { ScanData } from '../../models/scan-data.model';

// Controls
import { ModalController, Platform, ToastController } from 'ionic-angular';

// plugins
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { MapaPage } from '../../pages/mapa/mapa';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';
import { EmailComposer } from '@ionic-native/email-composer';

/*
  Generated class for the HistorialProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class HistorialProvider {

  historial: ScanData[] = [];

  constructor( private iab: InAppBrowser, 
                public modalCtrl: ModalController, 
                private contacts: Contacts,
                public toastCtrl: ToastController,
                public platform: Platform,
                private emailComposer: EmailComposer ) {
    
  }

  agregarScan(text: string) {
    let scan: ScanData = new ScanData(text);

    this.historial.unshift(scan);
    console.log(this.historial);

    this.abrirScan(0);

  }

  abrirScan(index: number) {
    console.log(index);
    switch(this.historial[index].tipo) {
      case 'http://': {
        this.iab.create(this.historial[index].info);
            break;
      }
      case 'map': {
        const modal = this.modalCtrl.create(MapaPage, {coords: this.historial[index].info});
        modal.present();
      }
      case 'Contacto': {
        this.agregarContacto(this.historial[index].info);
      }
      case 'Mail': {
        this.abrirEmail(this.historial[index].info);
      }
            
    }
  }

  abrirEmail(text: string) {

    text = text.replace('MATMSG:', '');

    let infoMail: any[] = text.split(';');
  
    let email = {
      to: infoMail[0].replace('TO:', ''),
      subject: infoMail[1].replace('SUB:', ''),
      body: infoMail[2].replace('BODY:', ''),
      isHtml: false
    };
    
    // Send a text message using default options
    this.emailComposer.open(email);
  }

  agregarContacto(texto: string) {
    let contacto: any = this.parse_vcard(texto);
    console.log(contacto);
    if(!this.platform.is('cordova')) {
      console.warn('No es un celular');
      return;
    }

    let contact: Contact = this.contacts.create();

    contact.name = new ContactName(null, contacto.fn );
    contact.phoneNumbers = [new ContactField('mobile', contacto.tel[0].value[0])];
    contact.save().then(
      () => this.presentToast('Contacto creado correctamente!'),
      (error: any) => console.error('Error saving contact.', error)
    );
  }

  private parse_vcard( input:string ) {

    var Re1 = /^(version|fn|title|org):(.+)$/i;
    var Re2 = /^([^:;]+);([^:]+):(.+)$/;
    var ReKey = /item\d{1,2}\./;
    var fields = {};

    input.split(/\r\n|\r|\n/).forEach(function (line) {
        var results, key;

        if (Re1.test(line)) {
            results = line.match(Re1);
            key = results[1].toLowerCase();
            fields[key] = results[2];
        } else if (Re2.test(line)) {
            results = line.match(Re2);
            key = results[1].replace(ReKey, '').toLowerCase();

            var meta = {};
            results[2].split(';')
                .map(function (p, i) {
                var match = p.match(/([a-z]+)=(.*)/i);
                if (match) {
                    return [match[1], match[2]];
                } else {
                    return ["TYPE" + (i === 0 ? "" : i), p];
                }
            })
                .forEach(function (p) {
                meta[p[0]] = p[1];
            });

            if (!fields[key]) fields[key] = [];

            fields[key].push({
                meta: meta,
                value: results[3].split(';')
            })
        }
    });

    return fields;
};

presentToast(message: string) {
  const toast = this.toastCtrl.create({
    message: message,
    duration: 2500
  });
  toast.present();
}

}
