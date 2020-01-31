import {
    Length,
    IsObject,
    IsUrl,
    IsOptional,
    IsArray,
    IsString
} from 'class-validator';

export interface GeoCoord {
    latitude: number;
    longitude: number;
}

export interface Contact {
    name: string;
    phone: string;
}

export class OrganizationModel {
    @IsUrl()
    url: string;

    @IsOptional()
    @IsArray()
    contacts?: Contact[];

    @IsOptional()
    @IsString()
    remark?: string;
}

export class PlaceModel extends OrganizationModel {
    @Length(3)
    province: string;

    @Length(3)
    city: string;

    @Length(2)
    district: string;

    @Length(5)
    address: string;

    @IsObject()
    coords: GeoCoord;
}
