const InvariantError = require("../../../Commons/exceptions/InvariantError");

class AddComment {
	constructor(payload) {
		this._verifyPayload(payload);

		const { content, owner, threadId } = payload;

		this.content = content;
		this.owner = owner;
		this.threadId = threadId;
	}

	_verifyPayload(payload) {
		const { content, owner, threadId } = payload;

		if (!content || !owner || !threadId) {
			throw new InvariantError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
		}

		if (typeof content !== 'string' || typeof owner !== 'string' || typeof threadId !== 'string') {
			throw new InvariantError('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
		}
	}
}

module.exports = AddComment;
