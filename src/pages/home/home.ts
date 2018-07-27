import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as NodeRSA from "node-rsa";

import { Pkcs8Page } from '../pkcs8/pkcs8';
//https://www.npmjs.com/package/node-rsa


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public MattsPublicKeyString: string;
  public publicKeyService: string;
  public privateKeyService: string;
  public word;
  public encryptedWord;desEncryptedWord;palabraDesencriptada;
  public rsa: any;

  public appLlavePublica;
  public appLlavePrivada;

  constructor(
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    //public Crypt: CryptoJS,
    //public Crypt: cryptico,
  ) {
    this.rsa = this.formBuilder.group({
      text1: [, Validators],
      text2: [, Validators]
    });

  }

  ionViewDidLoad() {
    
    this.publicKeyService =
      '-----BEGIN RSA PUBLIC KEY-----\n' +
      'MIIBCgKCAQEAzpNOFXHAtw07Gq18C/x4uXDPFWUwPBGyBVSyLy8rute6utN+Yuot\n' +
      'DT53J29GSmzVBx3QgrtpT1uUKAAs4X8NglZCRBG+Kt5OJYlkAl9IfqUmoDnBzwJN\n' +
      'O2aAvf722mTBRGDCdhiQNHtb7rxUbaELqFmXVgPB4w72FSpO+ljMLA+rjLAtUBMk\n' +
      's+V1naodYmfWPyGy09RxtK7wNveAf1zMlKOO2W+Wnlx1jp5kO2MfKiPP8/qsUVwV\n' +
      'JLj/otAgXj2gwkEbADDT57WhCZrpTK0Urf8kbOKd3uobo9rFAGdy/W53bk8k2SHF\n' +
      'oMatHOzrpRldDF+ichWoHJmMHwfPB/eYGQIDAQAB\n' +
      '-----END RSA PUBLIC KEY-----';

    this.privateKeyService =
      '-----BEGIN RSA PRIVATE KEY-----\n' +
      'MIIEowIBAAKCAQEAzpNOFXHAtw07Gq18C/x4uXDPFWUwPBGyBVSyLy8rute6utN+\n' +
      'YuotDT53J29GSmzVBx3QgrtpT1uUKAAs4X8NglZCRBG+Kt5OJYlkAl9IfqUmoDnB\n' +
      'zwJNO2aAvf722mTBRGDCdhiQNHtb7rxUbaELqFmXVgPB4w72FSpO+ljMLA+rjLAt\n' +
      'UBMks+V1naodYmfWPyGy09RxtK7wNveAf1zMlKOO2W+Wnlx1jp5kO2MfKiPP8/qs\n' +
      'UVwVJLj/otAgXj2gwkEbADDT57WhCZrpTK0Urf8kbOKd3uobo9rFAGdy/W53bk8k\n' +
      '2SHFoMatHOzrpRldDF+ichWoHJmMHwfPB/eYGQIDAQABAoIBAG/wQJq8Nlq7D7EI\n' +
      'GzT/jYenSn/kgju6twXOfHO3EvI/Xk9Ita7yCJGprLWwxZ0k1lbx4ABHf+xhyqnW\n' +
      'Vnum9nIPPf9Wwf7G0f/jME9cxJLj+UdPpOcA70rl45ORKsDzYgskh5uo+dOGmS2H\n' +
      '3hQ99Ww3iBszFAhvHgggEgX0wkaJCeJtcBV4849TfdQh7J9qs18IdH2yULHOqCcS\n' +
      'kFx2TJfL46+4M7ovmStNo4hLnvBvIlpmSrSb7AZ4I3lBU/QE96qATxFCeRRLGUTx\n' +
      'stsuWGuRm0wHWgaFeT4DEniWlToWaf8D0xU1QVkVFk6ZE/wR417ViRkn8hF5EGP5\n' +
      'WOqeZwUCgYEA7iU4Hlgg9m9jPPontEaeWZbZHs3nvFKyhPNXWG29FcIX5o5Qv6Bu\n' +
      'KX13pFep5irEw75O0ETdiUfSlpVkfYgF3VqRh4UIh+mynqcCV9WhRLI+rtl59HR3\n' +
      '7V6Mov/jdHXHC3MryZF6r0fHsql9BDsBw3nyw6PTE8K8MhHIssEbjwsCgYEA3hAn\n' +
      '34sq5eI/XC/p5GcHRDOIqL1Zfblb+DsXtzezyi8jCtS75e6/Q/cX85GUgeXjZHYG\n' +
      'enzqYgG8JYbAE5HsgesgzhyprpuiY1VrOF4ELm50jatwDrSErgaWfys0Z7ae7Bbz\n' +
      'RjknWK3S8fnRTYB/XWsAgOawlrg7Wm77pUxze+sCgYEA1fDh5YDOvBV9Vb52BOKc\n' +
      'R2fZTm80jF7OudnS0kJj6DQiPKIFsOFzlhp9bUrD+17YvfEt5LS5QScg7N7xFEUq\n' +
      '350JuHGvJEqyiQ0IcdgdtRVccsA1a4NmafzS42x27p0QYBzrbX4gdW9K3BqfkTlh\n' +
      'cDcR/OgkLFB5uZF4d/47v9kCgYAo21wauyZHaZsywPYNug8SM1EfisceZK5RO74f\n' +
      'TbZcqtONuJphsc2rGZlkjRJ/2+Y8o6KJgtY09hDB7ssETsLvHG3KvmdR4vy7vgme\n' +
      'M14dlOEI99QEQJ5wznF+MFrSAj23PnnAH9/nZwP61XX3Bn9olrle/hLbiEYTW3wd\n' +
      'a7WLxQKBgA6w1bv5EFN6QDPKmR52IQgasfW2UaMduL+fQdSLLP8teX0zGYY0ZGsb\n' +
      '6U7eBqhhQVo5/SSqMY+y3iEdEwm/hyiIPIELDX+eXHlqsvGD2MKCML7XKF8sMBoh\n' +
      'FonYlOefrlMUINg8d+WZZPMR2BPaq7OaPnbQbs/7UKwvcN/2NsK3\n' +
      '-----END RSA PRIVATE KEY-----';

    //console.log("key.getKeySize()", key.getKeySize());
    //console.log("key.getMaxMessageSize()", key.getMaxMessageSize());
    //console.log("key.isPrivate()", key.isPrivate());
    //console.log("key.isEmpty()", key.isEmpty());
    //this.crearLlaves();
  }

  crearLlaves() {
    var key = new NodeRSA({ b: 2048 });
    //this.appLlavePrivada = key.exportKey("pkcs8-private");
    //this.appLlavePublica = key.exportKey("pkcs8-public-pem");
    this.appLlavePublica = key.exportKey("pkcs1-public");
    this.appLlavePrivada = key.exportKey("pkcs1-private");
    console.log("Llaves creadas");
    console.log(this.appLlavePublica);
    console.log(this.appLlavePrivada);
    key.importKey(this.appLlavePublica, "pkcs1-public");
    key.importKey(this.appLlavePrivada, "pkcs1-private");
  }

  encriptar() {
    let Palabra = this.rsa.value.text1;
    
    var key1 = new NodeRSA();
    key1.importKey(this.publicKeyService, "pkcs1-public");
    key1.importKey(this.privateKeyService, "pkcs1-private");

    console.log(this.publicKeyService);
    console.log(this.privateKeyService);

    console.log('Palabra: ', Palabra);
    this.encryptedWord = key1.encrypt(Palabra, 'base64');
    console.log('encrypted: ', this.encryptedWord);
  }

  desencriptar() {

    this.desEncryptedWord = this.encryptedWord;

    var key2 = new NodeRSA();
    key2.importKey(this.publicKeyService, "pkcs1-public");
    key2.importKey(this.privateKeyService, "pkcs1-private");

    console.log(this.publicKeyService);
    console.log(this.privateKeyService);
    console.log(this.encryptedWord);

    this.palabraDesencriptada = key2.decrypt(this.desEncryptedWord, 'utf-8');
    //var desencriptarFromServicePublic = key.decryptPublic(this.encryptedWord, 'utf-8');
    console.log('this.palabraDesencriptada: ', this.palabraDesencriptada);
    //console.log('desencriptarFromServicePublic: ', desencriptarFromServicePublic);
  }

  ejemplo() {
    const ejemplo = new NodeRSA({ b: 2048 });
    this.appLlavePrivada = ejemplo.exportKey("pkcs1-private");
    this.appLlavePublica = ejemplo.exportKey("pkcs1-public");
    console.log(this.appLlavePrivada);
    console.log(this.appLlavePublica);

    const text = 'Hello RSA!';
    const encrypted = ejemplo.encrypt(text, 'base64');
    console.log('encrypted: ', encrypted);
    const decrypted = ejemplo.decrypt(encrypted, 'utf8');
    console.log('decrypted: ', decrypted);
  }

  pkcs(){
    this.navCtrl.setRoot(Pkcs8Page);
  }

}
