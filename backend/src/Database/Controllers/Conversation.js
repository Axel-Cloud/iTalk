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

const NewMessage = async ({ConversationID, UserID, Message}, SocketIO) => {
    await ConversationSchema.findById(ConversationID, async (Error, Conversation) => {
        if(Conversation !== null){
            let NewConversation = Conversation.Conversation;
            let NewMessage = {UserID, Message, Date: new Date(), Readed: false};
            NewConversation.push(NewMessage);

            Conversation.Conversation = NewConversation;
            Conversation.save();

            SocketIO.emit("Message", NewMessage);
        }
        else{
            await ConversationSchema.create({
                _id: ConversationID,
                Conversation: [
                    {
                        UserID,
                        Message,
                        Date: new Date(),
                        Readed: false
                    }
                ]
            });

            SocketIO.emit("Message", {UserID, Message, Date: new Date(), Readed: false});
        }
    })
}

export default {Recieve, NewMessage};