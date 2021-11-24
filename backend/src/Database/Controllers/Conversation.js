import UserSchema from "../Models/Users";
import ConversationSchema from "../Models/Conversation";

const Recieve = async (Data, ConversationResponse) => {
    await ConversationSchema.findById(Data.query.ID, (Error, Conversation) => {
        if(!Error){
            ConversationResponse.send(Conversation);
        }
        else{
            ConversationResponse.send(`Error: ${Error.message}`)
        }
    });
};

const NewMessage = async ({ConversationID, EmitterID, RecieverID, Message}, Socket) => {
    await ConversationSchema.findById(ConversationID, async (Error, Conversation) => {
        if(Conversation !== null){
            //Falta retornar el id del mensaje
            let NewConversation = Conversation.Conversation;
            let NewMessage = {UserID: EmitterID, Message, Date: new Date(), Readed: false};
            NewConversation.push(NewMessage);

            Conversation.Conversation = NewConversation;
            Conversation.save();

            Socket.emit("Message", NewMessage);
        }
        else{
            await ConversationSchema.create({
                _id: ConversationID,
                Conversation: [
                    {
                        UserID: EmitterID,
                        Message,
                        Date: new Date(),
                        Readed: false
                    }
                ]
            });
            
            await UserSchema.findById(EmitterID, (Error, User) => {
                User.Conversations.push(ConversationID);
                User.save();

                Socket.emit("Message", {UserID: EmitterID, Message, Date: new Date(), Readed: false});
            });
        }
    })
};

export default {Recieve, NewMessage};