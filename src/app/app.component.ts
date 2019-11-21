import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  name = 'Angular Colombo';
  image;
  noFace;
  thing;
  result;
  fileToUpload: File;
  output : any;
  constructor(private http: HttpClient) {}

   removeImage() {
    this.image = '';
    this.noFace = false;
    this.thing = {};
    this.result = '';
    this.fileToUpload = undefined;
  }

  fileUpload(fileList: FileList) {
    if (fileList.length <= 0) return;

    this.fileToUpload = fileList.item(0);
    this.createImage();
  }

  makeRequest() {
    let data, contentType;
    if (typeof this.image === 'string' && !this.image.startsWith('data')) {
      data = { url: this.image };
      contentType = 'application/json';
    } else {
      data = this.fileToUpload;
      contentType = 'application/octet-stream';
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': contentType,
        'Ocp-Apim-Subscription-Key': 'eb491c18bd874d2f9d410eedde346366'
      })
    };

    this.http
      .post(
        'https://eastus.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=false&returnFaceAttributes=emotion',
        data,
        httpOptions
      )
      .subscribe(body => {
        if (body && body[0]) {
          console.log(body);
          this.output = body;
          this.thing = body[0].faceAttributes.emotion;
          this.result = this.getTop();
          this.noFace = false;
        } else {
          this.noFace = true;
        }
      });
  }

  createImage() {
    var reader = new FileReader();
    reader.onload = e => {
      this.image = reader.result;
      this.makeRequest();
    };
    reader.readAsDataURL(this.fileToUpload);
  }

  getTop() {
    let max = 0;
    let maxkey = '';
    for (var key in this.thing) {
      if (this.thing[key] > max) {
        max = this.thing[key];
        maxkey = key;
      }
    }
    return maxkey;
  }
}
