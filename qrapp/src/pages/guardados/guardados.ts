import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { HistorialProvider } from '../../providers/historial/historial'
import { ScanData } from '../../models/scan-data.model';

/**
 * Generated class for the GuardadosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-guardados',
  templateUrl: 'guardados.html',
})
export class GuardadosPage {

  historial: ScanData[];

  constructor(public _historialProvider: HistorialProvider) {
    this.historial = this._historialProvider.historial;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GuardadosPage');
  }

  abrirScan( i: number ) {
    this._historialProvider.abrirScan(i);
  }

}
