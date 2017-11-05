import { Injectable, EventEmitter } from '@angular/core';
import { Diagnostic } from '@ionic-native/diagnostic';
import {Utils} from "./utils";

@Injectable()
export class Bluetooth {

    public isEnabled: boolean = false;
    public stateChanged: EventEmitter<boolean> = new EventEmitter();

    constructor(private diagnostic: Diagnostic, private utils: Utils) {
        this.getState();

        this.diagnostic.registerBluetoothStateChangeHandler(state => {
            this.isEnabled = state == this.diagnostic.bluetoothState.POWERED_ON;
            this.stateChanged.emit();
            console.log(`BT enabled: ${this.isEnabled}`);
        });
    }

    getState() {
        return this.diagnostic.getBluetoothState().then(state => {
            console.log(`BT enabled: ${this.isEnabled}`);
            this.isEnabled = state == this.diagnostic.bluetoothState.POWERED_ON;
        }, error => {
            console.warn(error);
            this.isEnabled = false;
        });
    }

}