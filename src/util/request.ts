import axios,{AxiosRequestConfig} from "axios";

export interface RequestConfig extends AxiosRequestConfig{

}

export class Request{
    constructor(private request = axios){}

    public get<T>(url: string, config:RequestConfig={});
}