import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the MapaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mapa',
  templateUrl: 'mapa.html',
})
export class MapaPage {

  lat: number;
  lng: number;
  zoom: number = 16;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    console.log(this.navParams.get('coords'));
    let text: string =this.navParams.get('coords');
    let array: any[] = text.split(',');
    console.log(array);
    this.lat = Number(array[0].replace('geo:', '')) ;
    this.lng = Number(array[1]);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapaPage');
  }
  
  cerrarModal() {
    this.viewCtrl.dismiss();
  }

}
