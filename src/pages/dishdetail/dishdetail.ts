import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ModalController } from 'ionic-angular';

import { CommentPage } from '../comment/comment';


import { Dish } from '../../shared/dish';
import { Comment } from '../../shared/comment';

import { FavoriteProvider } from '../../providers/favorite/favorite';

import { ActionSheetController } from 'ionic-angular';

/**
 * Generated class for the DishdetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dishdetail',
  templateUrl: 'dishdetail.html',
})
export class DishdetailPage {

  dish: Dish;
  errMess: string;
  avgstars: string;
  numcomments: number;

  favorite: boolean;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    @Inject('BaseURL') private BaseURL,
    private favoriteservice: FavoriteProvider,
    private toastCtrl: ToastController,
    public actionSheetCtrl: ActionSheetController,
    public modalCtrl: ModalController) {

      this.dish = navParams.get('dish');
      this.favorite = favoriteservice.isFavorite(this.dish.id);
      this.numcomments = this.dish.comments.length;
      let total = 0;
      this.dish.comments.forEach(comment => total += comment.rating );
      this.avgstars = (total/this.numcomments).toFixed(2);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DishdetailPage');
  }

  addToFavorites() {
    console.log('Adding to Favorites', this.dish.id);
    this.favorite = this.favoriteservice.addFavorite(this.dish.id);
    this.toastCtrl.create({
      message: 'Dish ' + this.dish.id + ' added as favorite successfully',
      position: 'middle',
      duration: 3000}).present();
  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Actions',
      buttons: [
        {
          text: 'Add to Favorites',
          //role: 'destructive',
          handler: () => {
            console.log('Add to Favorites');
            this.addToFavorites();
          }
        },{
          text: 'Add a Comment',
          //role: 'destructive',
          handler: () => {
            console.log('Add a Comment');
            this.openComment();
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel');
          }
        }
      ]
    });
    actionSheet.present();
  }


  openComment() {
    let commentModal = this.modalCtrl.create(CommentPage);

    commentModal.onDidDismiss(comment => {
      console.log(comment);
      this.dish.comments.push(comment);
    });
    commentModal.present();
  }

}
