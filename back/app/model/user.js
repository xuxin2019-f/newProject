module.exports = app=>{
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const UserSchema = new Schema({
    email: {type:String, require:true},
    password: {type:String, require:true},
    nickname: {type:String, require:true},
    
    // 关注的人，
    // 点赞文章
    // 点赞的答案

  }, { timestamps:true } )

  return mongoose.model('User', UserSchema )
}