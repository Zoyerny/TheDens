import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class NewTokenReponse {

    @Field()
    accessToken: string;

    @Field()
    refreshToken: string;
}