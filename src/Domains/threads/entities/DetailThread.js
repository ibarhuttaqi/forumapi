const InvariantError = require("../../../Commons/exceptions/InvariantError");

class DetailThread {
	constructor(payload) {
		this._verifyPayload(payload);

		const { id, title, body, date, username } = payload;

		this.id = id;
		this.title = title;
		this.body = body;
		// this.comments = comments;
		this.date = date;
		this.username = username;
	}

	_verifyPayload(payload) {
		if (!payload.id || !payload.title || !payload.body || !payload.date || !payload.username) {
				throw new InvariantError('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
		}
	}
}

module.exports = DetailThread;
