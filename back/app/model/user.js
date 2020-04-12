'use strict'
module.exports = (app) => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const UserSchema = new Schema(
    {
      __v: { type: Number, select: false },
      email: { type: String, required: true },
      password: { type: String, required: true, select: false },
      nickname: { type: String, required: true },
      avatar: { type: String, required: false, default: '/user.png' },
      // 关注的人，
      following: {
        type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
      },
      likeArticle: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Article' }],
      },
      dislikeArticle: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Article' }],
      },
      // 点赞文章
      // 点赞的答案
    },
    { timestamps: true }
  )

  return mongoose.model('User', UserSchema)
}
