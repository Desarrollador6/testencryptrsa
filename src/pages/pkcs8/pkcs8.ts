import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HomePage } from '../home/home';
import * as NodeRSA from "node-rsa";

/**
 * Generated class for the Pkcs8Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pkcs8',
  templateUrl: 'pkcs8.html',
})
export class Pkcs8Page {

  public publicKeyService: string;
  public privateKeyService: string;

  public appLlavePublica;
  public appLlavePrivada;
  public encryptedWord;desEncryptedWord;palabraDesencriptada;

  public rsa: any;

  constructor(
    public navCtrl: NavController, public navParams: NavParams,
    public formBuilder: FormBuilder,
  ) {
    this.rsa = this.formBuilder.group({
      text1: [, Validators],
      text2: [, Validators.required]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Pkcs8Page');

    this.publicKeyService =
      '-----BEGIN PUBLIC KEY-----\n' +
      'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqn8RlHfIY63RPDw2IuI8\n' +
      'QhbwLh1q7HR8Hzjru6290qradf8NmqqzLgbzHABmbm9Hk+slJntHjeYcxJ/jFiPQ\n' +
      'NEWVr8UnYhFQG6rbxuw4cU+lG8kUbkAdEjcrrd3GZwQUD4u1rPMgesp91d8rDp4D\n' +
      'nJ+CWWIa6v91T0E0uxYRjmjOhIELLHO8khbX0LKkE65H8xx3eC8hk8SCi7iHLo5P\n' +
      'U/1cejSYXeu0XuEnHX+xgy4QfS/jl/qmauEbus97QenStT5rXQgaeHXP4TKAhhjr\n' +
      'tlrT94U2xjPX0+fO1n44/NjilxwC7aj1xE1h66xkQSpkYLL9qiHVpBBwernT07sy\n' +
      'IQIDAQAB\n' +
      '-----END PUBLIC KEY-----';

    this.privateKeyService =
      '-----BEGIN PRIVATE KEY-----\n' +
      'MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCqfxGUd8hjrdE8\n' +
      'PDYi4jxCFvAuHWrsdHwfOOu7rb3Sqtp1/w2aqrMuBvMcAGZub0eT6yUme0eN5hzE\n' +
      'n+MWI9A0RZWvxSdiEVAbqtvG7DhxT6UbyRRuQB0SNyut3cZnBBQPi7Ws8yB6yn3V\n' +
      '3ysOngOcn4JZYhrq/3VPQTS7FhGOaM6EgQssc7ySFtfQsqQTrkfzHHd4LyGTxIKL\n' +
      'uIcujk9T/Vx6NJhd67Re4Scdf7GDLhB9L+OX+qZq4Ru6z3tB6dK1PmtdCBp4dc/h\n' +
      'MoCGGOu2WtP3hTbGM9fT587Wfjj82OKXHALtqPXETWHrrGRBKmRgsv2qIdWkEHB6\n' +
      'udPTuzIhAgMBAAECggEAMlOZy9pjs1Cub3pSfI+NO/DraqFSW4Oy08CIjPinDJVU\n' +
      'MPpdeKckhtSUVFKl6bk9RqNlbut63p7rJPsRHArsPVHA8oZerqrvm4senqRBsOjS\n' +
      'ktYTCswwCJ1ybjsFgokIpuIVeXy2vKgi5sueOQ1ZgZTv9BRqX62SYhecShEkk4VO\n' +
      'ThqpQ1Qrsn5YxsY5Tn2eKAnEQiaO1gcEL+GzkdNXp9ztZrzMahOsLUpMBp/6llj5\n' +
      'RN6vevsWG50aWPI9c2EY2x/uUi3WwKIJEk5/KNP8bn/VDLKDiO/URVf0YPDoEOmm\n' +
      'Yv4szTBMGc6DcVzXH9K4m+RRJLi0LUGJ1LrtnxsgwQKBgQDocT817HwQN8bbMz15\n' +
      'r07vXzdvRsJtEkyoC1noO/hxuheHynj9Oz0eQnn2HuoG1voKrukfuTmuXz2ztBY4\n' +
      '4DQd5s9mp6ymcXZNb+pclv2NPU8UxtFskTH7OCWNDTeDM7vYx7yXrHWhi7Fkx6V1\n' +
      'fgVn1vSMd8Ekf7g3vdSy7o9t+QKBgQC7xp9+feukzQuelxeoSP5ZkyQw6c7UtUQA\n' +
      'k0S0NOmPe1In5whUydTyVcAW0eHV1e8U7wDSbmhzF/FMcn0YVLvbUAf2zHXrwcAj\n' +
      'g80QSpZiGwhJIM0x5eFHRG29LP/Rl2LXK6sQUr8mMaq6P2BzO6ZZtM5teko8ehZp\n' +
      'KyVHgoGPaQKBgQCtkfMrpx21VpEtmgOr3BbLdISGmYYRwHpxeZh3bGDHO7jac30J\n' +
      'S7UF5YoBGXCUDu/EDnySbdP+u6vthuqZKgKA2ZvCAi9QUqWOiaWt4ioPz9o/n38+\n' +
      '3OU/vNt9ioMLfBQnem7/q45jRVb/9H0/UQ1kTwVp5vrY8G51YVF1E+MSsQKBgBN+\n' +
      'p4hmYlSVxSMN5LLgASgjkppRa9vBhfHZWEStSaJP11O1NLQ40BbouCymVZ/xugSe\n' +
      'W6N9OvLYBYE+UaZ5BZfbUzhYOdXkI6KMSHnshHhi/hU5hpQrnZvcitgdF+IWqXhV\n' +
      'XEkxjg7VETiM4+KSys59awEKtTJaKoF4rUIjVnghAoGBANQ5nvNIc6lncdyA6Cyn\n' +
      '9tIFPVbmYL1Eka4twrkkc0gSJ2AQqxavjxFFvu0gdOrGRJbbThbf5+9kea9uLP7C\n' +
      'puyJxtQdSVDF0/DytESjiS8u03Ju7AS46eUrNg8RKeOPPw9ZauA7eVHYP4iwESkL\n' +
      'dNLzd37FPmQnIPe469px8oHx\n' +
      '-----END PRIVATE KEY-----';

  }

  pkcs() {
    this.navCtrl.setRoot(HomePage);
  }

  crearLlaves() {
    var key = new NodeRSA({ b: 2048 });
    this.appLlavePublica = key.exportKey("pkcs8-public");
    this.appLlavePrivada = key.exportKey("pkcs8-private");
    console.log("Llaves creadas");
    console.log(this.appLlavePublica);
    console.log(this.appLlavePrivada);
    key.importKey(this.appLlavePublica, "pkcs8-public");
    key.importKey(this.appLlavePrivada, "pkcs8-private");
  }

  encriptar() {
    let Palabra = this.rsa.value.text1;
    
    var key1 = new NodeRSA();
    key1.importKey(this.publicKeyService, "pkcs8-public");
    key1.importKey(this.privateKeyService, "pkcs8-private");

    console.log(this.publicKeyService);
    console.log(this.privateKeyService);

    console.log('Palabra: ', Palabra);
    this.encryptedWord = key1.encrypt(Palabra, 'base64');
    console.log('encrypted: ', this.encryptedWord);
  }

  desencriptar() {

    this.desEncryptedWord = this.rsa.value.text2;

    var key2 = new NodeRSA();
    key2.importKey(this.publicKeyService, "pkcs8-public");
    key2.importKey(this.privateKeyService, "pkcs8-private");

    console.log(this.publicKeyService);
    console.log(this.privateKeyService);
    console.log(this.encryptedWord);

    this.palabraDesencriptada = key2.decrypt(this.desEncryptedWord, 'utf-8');
    //var desencriptarFromServicePublic = key.decryptPublic(this.encryptedWord, 'utf-8');
    console.log('this.palabraDesencriptada:', this.palabraDesencriptada);
    console.log(this.palabraDesencriptada);
    //console.log('desencriptarFromServicePublic: ', desencriptarFromServicePublic);
  }

}
