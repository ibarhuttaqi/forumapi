class DetailComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, username, date, content, is_deleted } = payload;

    this.id = id;
    this.username = username;
    this.date = date;
    this.content = is_deleted ? '**komentar telah dihapus**' : content;
  }

  _verifyPayload({ id, username, date, content, is_deleted }) {
    if (!id || !username || !date || typeof is_deleted !== 'boolean') {
      throw new Error('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }
  }
}

module.exports = DetailComment;
