import { Injectable, OnDestroy } from '@angular/core';
import { Network } from '@ionic-native/network';
import { Utils } from "./utils";

@Injectable()
export class NetworkService implements OnDestroy{

    public connectSubscription;
    public disconnectSubscription;

    private noConnection: string = 'No internet connection. Synchronization is disabled';
    private withConnection: string = 'Internet connection available. Synchronization is enabled';

    constructor(private network: Network, private utils: Utils) {
        if (!navigator.onLine) this.utils.showToast(this.noConnection);

        this.disconnectSubscription = this.network.onDisconnect();
        this.connectSubscription = this.network.onConnect();

        this.disconnectSubscription.subscribe(() => {
            this.utils.showToast(this.noConnection);
        });

        this.connectSubscription.subscribe(() => {
            this.utils.showToast(this.withConnection);
        });
    }

    ngOnDestroy() {
        this.disconnectSubscription.unsubscribe();
        this.connectSubscription.unsubscribe();
    }
}
