/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";

export class CreateEventDto {
    constructor(engineId: string,
        location: string,
        temperature: number,
        timestamp: Date) {
        this.engineId = engineId;
        this.location = location;
        this.temperature = temperature;
        this.timestamp = timestamp;
    }

    @ApiProperty()
    engineId: string;
    @ApiProperty()
    location: string;
    @ApiProperty()
    temperature: number;
    @ApiProperty()
    timestamp: Date;
}
