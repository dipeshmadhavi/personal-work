import { Component, Injector } from '@angular/core';
import { BaseLogger } from '../Utility/Utility.Loggre';
import { FileUploader, FileItem } from 'ng2-file-upload';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { formArrayNameProvider } from '@angular/forms/src/directives/reactive_directives/form_group_name';
@Component({
  templateUrl: './Supplier.Supplier.html'
})
export class SupplierComponent {
  loggerObj: BaseLogger = null;
  /**
   *
   */
  // constructor(_logger:BaseLogger) {
  //   this.loggerObj = _logger;
  //   this.loggerObj.log();
  // }
  constructor(_injector: Injector, public _http: HttpClient) {
    this.loggerObj = _injector.get('1');
    this.loggerObj.log();
  }

  public uploader: FileUploader = new FileUploader({
    method: 'POST',
    url: 'http://localhost:3000/api/imagelibrary/uploaddoc',
    additionalParameter: { user_id: '5c7923445a03e30017cf25a9' },
    headers: [
      { name: 'user_id', value: '5c7923445a03e30017cf25a9' },
      { name: 'Content-Type', value: 'application/json' }
    ]
  });
  /*   title = 'xlsfileuploadpoc';
  fileToUpload: File = null;
  public header = {
    'Content-Type': 'application/json',
    user_id: '5c7923445a03e30017cf25a9'
  };
  public apipath = 'http://localhost:3000/api/imagelibrary/uploaddoc';
  public uploader: FileUploader = new FileUploader({
    url: this.apipath,
    additionalParameter: this.header,
    disableMultipart: true,
    authToken: this.header.user_id,
    allowedFileType: ['xls'],
    removeAfterUpload: true
  });
  call() {
    this.uploader.onBuildItemForm = (fileItem: any) ;
  } */
}
