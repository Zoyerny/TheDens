import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class LogoutReponse{
    
    @Field()
    loggedOut: boolean;

}