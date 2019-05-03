import { Component } from '@angular/core';

// Servicios
import { HistorialProvider } from '../../providers/historial/historial'

// Components
import { ToastController, Platform } from 'ionic-angular';

// Plugin
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(private barcodeScanner: BarcodeScanner,
              public toastCtrl: ToastController,
              public platform: Platform,
              public _historialProvider: HistorialProvider) {

  }

  scan() {
    if(!this.platform.is('cordova')) {
      console.log('no es cordova')
      //this._historialProvider.agregarScan('geo:-32.9623639,-60.63026960000002');
      this._historialProvider.agregarScan( `BEGIN:VCARD
VERSION:2.1
N:Kent;Clark
FN:Clark Kent
ORG:
TEL;HOME;VOICE:12345
TEL;TYPE=cell:67890
ADR;TYPE=work:;;;
EMAIL:clark@superman.com
END:VCARD` );
      return;
    }

    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);
      console.log(barcodeData.text);
      if(!barcodeData.cancelled &&  barcodeData.text != null) {
        this._historialProvider.agregarScan(barcodeData.text);
      }
     }).catch(err => {
         console.log('Error', err);
         this.presentToast(err);
     });
  }

  presentToast(message: string) {
    const toast = this.toastCtrl.create({
      message: message,
      duration: 2500
    });
    toast.present();
  }

}
