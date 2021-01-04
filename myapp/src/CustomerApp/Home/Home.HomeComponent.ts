import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, ResponseContentType, Headers } from '@angular/http';
import { DomSanitizer } from '@angular/platform-browser';
import { download } from 'image-downloader';
import { saveAs } from 'file-saver';

// import {} from './../../assets/images1.jpg'

@Component({
  templateUrl: './Home.Home.html'
})

/* export class HomeComponent implements OnInit {
  imageData: any;
  imageUrl =
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQArwyrotMyhHuQ7JJif9C_bZCRKNWgGHcpQYn45jPdBHzCCBjd';

  constructor(private sanitizer: DomSanitizer, private http: Http) {}
  ngOnInit() {
    this.http
      .get(this.imageUrl, {
        responseType: ResponseContentType.Blob
      })
      .toPromise()
      .then((res: any) => {
        const blob = new Blob([res._body], {
          type: res.headers.get('Content-Type')
        });

        const urlCreator = window.URL;
        this.imageData = this.sanitizer.bypassSecurityTrustUrl(
          urlCreator.createObjectURL(blob)
        );
      });
  }
}
 */
export class HomeComponent {
  // name = 'Image';
  imageUrl =
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQArwyrotMyhHuQ7JJif9C_bZCRKNWgGHcpQYn45jPdBHzCCBjd';

  download(url, name) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.onload = function() {
      saveAs(xhr.response, name + '.jpg');
    };
    xhr.onerror = function() {
      console.error('could not download file');
    };
    xhr.send();
  }
}
