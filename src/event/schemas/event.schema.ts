/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class TempEvent {

    @Prop({ required: true })
    engineId: string;
    @Prop()
    location: string;
    @Prop()
    temperature: number;
    @Prop()
    timestamp: Date;
    
}

export const EventSchema = SchemaFactory.createForClass(TempEvent);
