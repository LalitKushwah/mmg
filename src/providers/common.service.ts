import { Injectable } from "@angular/core";
import { StorageServiceProvider } from "./storage-service/storage-service";
@Injectable()
export class CommonService {

    constructor (private strorageService: StorageServiceProvider) {}

    async isAuthorized () {
        const loggedInUser: any = await this.strorageService.getFromStorage('profile')
        if (loggedInUser.isAuthorized) {
          return true
        } else {
            return false
        }
    }

    async getLoggedInUser () {
        const loggedInUser = await this.strorageService.getFromStorage('profile')
        return loggedInUser
    }
}