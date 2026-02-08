import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument } from "mongoose"

export type HelpCenterDoucment = HydratedDocument<HelpCenter> 

@Schema({timestamps: true})
export class HelpCenter {
    @Prop({required: true})
    email: string 

    @Prop()
    listingUrl: string

    @Prop({required: true})
    subject: string 

    @Prop({required: true})
    description: string

    @Prop([
        {
            url: String,
            name: String
        }
    ])
    attachments: {
        url: string
        name: string
    }[]

    @Prop([String])
    attachmentUrls: string[]
}

export const HelpCenterSchema = SchemaFactory.createForClass(HelpCenter)

// {
//     "email": "dasd@gmail.com",
//     "listingUrl": "https:/dasdas.com",
//     "subject": "SD",
//     "description": "FJDSIFDSSFDSF",
//     "attachments": [
//         {
//             "url": "https://utfs.io/f/mKUaycPGkZo3CrGyfyVufmBGiyjR9PvwpSlr5HxLkoaYZ62b",
//             "name": "ChatGPT Image Feb 8, 2026, 07_05_09 PM.png"
//         }
//     ],
//     "attachmentUrls": [
//         "https://utfs.io/f/mKUaycPGkZo3CrGyfyVufmBGiyjR9PvwpSlr5HxLkoaYZ62b"
//     ]
// }