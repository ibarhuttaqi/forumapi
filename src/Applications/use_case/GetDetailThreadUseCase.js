const DetailComment = require("../../Domains/threads/entities/DetailComment");

class GetDetailThreadUseCase {
	constructor({ threadRepository }) {
		this._threadRepository = threadRepository;
	}

	async execute(threadId) {
		const detailThread = await this._threadRepository.getDetailThread(threadId);
		// console.log("detailThread: ", detailThread);
    	const commentsRaw = await this._threadRepository.getCommentsByThreadId(threadId);
		// console.log("commentsRaw: ", commentsRaw);
    	const comments = commentsRaw.map(comment => new DetailComment(comment));
		// console.log("comments: ", comments);
    	detailThread.comments = comments;
		// console.log("detailThread: ", detailThread);
    return detailThread;
	}
}

module.exports = GetDetailThreadUseCase;
