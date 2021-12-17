export class InternalError extends Error{
    constructor(public message: string, protected code: number = 500, protected description?:string){
        super(message)
        this.name = this.constructor.name
        //Jogando a class fora
        Error.captureStackTrace(this, this.constructor)
    }
}