export interface Ilogger{
    log();
}
export class BaseLogger implements Ilogger{
    log(){

    }
}
export class FileLogger extends BaseLogger{
    log(){
        console.log("file");
    }
}
export class EmailLogger extends BaseLogger{
    log(){
        console.log('Email');
    }
}