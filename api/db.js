export default {
  DB: `${process.env.MONGO_URL}${process.env.DB_NAME}:${process.env.DB_PASSWORD}@cluster0.54hna.mongodb.net/${process.env.DB_COLLECTION_NAME}?retryWrites=true&w=majority`,
};
