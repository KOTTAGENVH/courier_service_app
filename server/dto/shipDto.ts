// dto/shipment.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsBoolean,
  IsOptional,
  Length,
  IsNumber,
  Min,
  IsEmail,
} from 'class-validator';

// Local enum matching Prisma schema values
export enum ShipmentStatus {
  PENDING = 'PENDING',
  ON_ROUTE_TO_COLLECT = 'ON_ROUTE_TO_COLLECT',
  COLLECTED = 'COLLECTED',
  SHIPPED = 'SHIPPED',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}

export class CreateShipmentDto {
  @IsNotEmpty()
  @IsString()
  senderAddress!: string;

  @IsNotEmpty()
  @IsString()
  receiverFirstName!: string;

  @IsNotEmpty()
  @IsString()
  receiverLastName!: string;

  @IsNotEmpty()
  @IsString()
  receiverAddress!: string;

  @IsNotEmpty()
  @IsString()
  @Length(10, 15)
  receiverTelephone!: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Must be a valid email' })
  userEmail!: string;

  @IsNotEmpty()
  @IsNumber({}, { message: 'Weight must be a number' })
  @Min(0, { message: 'Weight must be at least 0' })
  weight!: number;
}


export class UpdateShipmentStatusDto {
  @IsNotEmpty()
  @IsEnum(ShipmentStatus)
  status!: ShipmentStatus;
}


export class CancelShipmentDto {
  @IsOptional()
  @IsBoolean()
  requestCancel?: boolean;
}