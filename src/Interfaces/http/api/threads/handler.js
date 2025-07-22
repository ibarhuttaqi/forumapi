const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');
const GetDetailThreadUseCase = require('../../../../Applications/use_case/GetDetailThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
    this.getDetailThreadHandler = this.getDetailThreadHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const owner = request.auth.credentials.id;
    const payloadWithOwner = {
      ...request.payload,
      owner,
    };
    // console.log("sdfdsf", payloadWithOwner);

    const addedThread = await addThreadUseCase.execute(payloadWithOwner);
    
    // console.log("addedThread: ", addedThread);
    
    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    // console.log('response: ', response);
    return response;
  }

  async postCommentHandler(request, h) {
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
    const owner = request.auth.credentials.id;
    const threadId = request.params.threadId;
    const payloadWithOwner = {
      ...request.payload,
      owner,
      threadId,
    };
    console.log("payloadWithOwner: ", payloadWithOwner);
    const addedComment = await addCommentUseCase.execute(payloadWithOwner);

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler(request, h) {
    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
    const { threadId, commentId } = request.params;
    const owner = request.auth.credentials.id;
    await deleteCommentUseCase.execute({ commentId, threadId, owner });
    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }

  async getDetailThreadHandler(request, h) {
    const { threadId } = request.params;
    // console.log("threadId: ", threadId);
    const getDetailThreadUseCase = this._container.getInstance(GetDetailThreadUseCase.name);
    // console.log("getDetailThreadUseCase: ", getDetailThreadUseCase);
    const thread = await getDetailThreadUseCase.execute(threadId);
    const response = h.response({
      status: 'success',
      data: {
        thread,
      },
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadsHandler;
