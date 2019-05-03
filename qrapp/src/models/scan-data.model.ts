export class ScanData {
    info: string;
    tipo: string;

    constructor(text: string) {
        this.info = text;
        this.tipo = 'no asignado';

        if(text.startsWith('http://')){
            this.tipo = 'http://';
        } else if(text.startsWith('geo:')) {
            this.tipo = 'map';
        } else if(text.startsWith('BEGIN:VCARD')){
            this.tipo = 'Contacto';
        } else if (text.startsWith('MATMSG:')) {
            this.tipo = 'Mail';
        }
        
    }
}