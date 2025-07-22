class AddedThread {
  constructor(payload) {
    console.log("payload2: ", payload);
    this._verifyPayload(payload);

    const { id, title, body, owner } = payload;

    this.id = id;
    this.title = title;
    // this.body = body;
    this.owner = owner;
  }

  _verifyPayload({ id, title, owner }) {
    if (!id || !title || !owner) {
      throw new Error('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof title !== 'string' || typeof owner !== 'string') {
      throw new Error('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddedThread;
