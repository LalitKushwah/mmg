import { Injectable } from "@angular/core";
import { ApiServiceProvider } from "../api-service/api-service";

@Injectable()
export class GenericService {
    parentCategories = [];

    constructor (private apiService: ApiServiceProvider) { }

    getParentCategories (): Promise<any> {
        return new Promise((resolve, reject) => {
            this.apiService.getParentCategoryList(0, 20)
                .subscribe((res) => {
                    this.parentCategories = res.body;
                    resolve(this.parentCategories);
                }, err => {
                    console.error('Error while getting parent Categories: Generic Service ', err);
                    reject(err);
                })
        })
    }
}