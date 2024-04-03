import {Expose, Transform} from "class-transformer";
import {IsLatitude, IsLongitude, IsNumber, IsString, Max, Min} from "class-validator";

export class ReportDto {
  @Expose()
  id: number;

  @Expose()
  approved: boolean;

  @Expose()
  make: string;

  @Expose()
  model: string;

  @Expose()
  year: number;

  @Expose()
  lat: number;

  @Expose()
  lng: number;

  @Expose()
  mileage: number;

  @Expose()
  price: number;

  @Transform(({obj}) => obj.user.id)
  @Expose()
  userId: number;
}
