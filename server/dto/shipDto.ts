// dto/shipment.dto.ts
// dto/shipment.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsEnum,
  IsBoolean,
  IsOptional,
  Length,
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
  @IsInt()
  userId!: number;
}

export class UpdateShipmentStatusDto {
  @IsNotEmpty()
  @IsEnum(ShipmentStatus)
  status!: ShipmentStatus;
}

export class DelayShipmentDto {
  @IsNotEmpty()
  @IsBoolean()
  delayFlag!: boolean;
}

export class CancelShipmentDto {
  @IsOptional()
  @IsBoolean()
  requestCancel?: boolean;
}