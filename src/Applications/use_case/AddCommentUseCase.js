const AddComment = require("../../Domains/threads/entities/AddComment");
const AddedComment = require("../../Domains/threads/entities/AddedComment");

class AddCommentUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    // console.log("useCasePayload: ", useCasePayload);
    const comment = new AddComment(useCasePayload);
    // console.log("comment: ", comment);
    await this._threadRepository.verifyAvailableThread(comment.threadId);
    const addedCommentData = await this._threadRepository.addComment(comment);
    return new AddedComment(addedCommentData);
  }
}

module.exports = AddCommentUseCase;
