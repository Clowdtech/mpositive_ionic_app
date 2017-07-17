import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';

@Injectable()
export class Utils {

    public keyboardOpened: boolean = false;

    constructor(private toastCtrl: ToastController, public keyboard: Keyboard) {
        this.setKeyBoardStateDetection();
    }

    showToast(msg: string) {
        let toast = this.toastCtrl.create({
            message: msg,
            duration: 3000,
            position: 'top'
        });
        toast.present();
    }

    /**
     * Add listeners for keyboard open/hide to have ability detect and update keyboard state
     */
    private setKeyBoardStateDetection() {
        this.keyboard.onKeyboardShow().subscribe(() => {
            this.setKeyboardState(true);
        });
        this.keyboard.onKeyboardHide().subscribe(() => {
            this.setKeyboardState(false);
        });
    }

    private setKeyboardState(isOpened: boolean) {
        this.keyboardOpened = isOpened;
    }

    /**
     * Wait till keyboard is closed to avoid rendering issue
     * when navigate to other pages
     */
    public safeKeyboardClose() {
        return new Promise(resolve => {
            if (this.keyboardOpened) {
                this.keyboard.close();
                this.keyboard.onKeyboardHide().subscribe(() => resolve());
                return;
            }
            resolve();
        });
    }
}