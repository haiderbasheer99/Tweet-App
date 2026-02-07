import { Injectable, UnsupportedMediaTypeException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {
    v2.config({
      //configuration for the Cloudinary
      cloud_name: this.configService.get('CLOUDINARY_KEYNAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(
    filePath: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      v2.uploader.upload(
        filePath,
        { folder: 'Cloudinary-Profile' }, //your folder in the Cloudinary which save the pictures
        (error, result) => {
          if (result) resolve(result);
          else reject(new UnsupportedMediaTypeException(error));
        },
      );
    });
  }
}
