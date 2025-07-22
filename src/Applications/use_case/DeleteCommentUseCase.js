class DeleteCommentUseCase {
	constructor({ threadRepository }) {
		this._threadRepository = threadRepository;
	}

	async execute(useCasePayload) {
		const { commentId, threadId, owner } = useCasePayload;
		await this._threadRepository.verifyCommentInThread(commentId, threadId);
		await this._threadRepository.verifyCommentOwner(commentId, owner);
		return this._threadRepository.deleteComment(commentId);
	}
}

module.exports = DeleteCommentUseCase;
