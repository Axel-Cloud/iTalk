import ConversationSchema from "../Models/Conversation";

const Recieve = async (Data, ConversationResponse) => {
    console.log(Data.query);
    await ConversationSchema.findById(Data.query.ID, (Error, Conversation) => {
        if(!Error){
            if(Conversation !== null){
                console.log(Conversation);
            }
            else{
                ConversationSchema.create({
                    _id: Data.query.ID,
                    Conversation: {}
                })
            }
        }
        else{
            ConversationResponse.send(`Error: ${Error.message}`)
        }
    });
};

export default {Recieve};