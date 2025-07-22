const DetailComment = require('../DetailComment'); // sesuaikan path

describe('DetailComment entity', () => {
  it('should create DetailComment object correctly when comment is not deleted', () => {
    const payload = {
      id: 'comment-123',
      username: 'user1',
      date: '2024-07-21T00:00:00.000Z',
      content: 'Komentar asli',
      is_deleted: false,
    };

    const detailComment = new DetailComment(payload);

    expect(detailComment.id).toEqual(payload.id);
    expect(detailComment.username).toEqual(payload.username);
    expect(detailComment.date).toEqual(payload.date);
    expect(detailComment.content).toEqual(payload.content);
  });

  it('should create DetailComment object with "**komentar telah dihapus**" when comment is deleted', () => {
    const payload = {
      id: 'comment-123',
      username: 'user1',
      date: '2024-07-21T00:00:00.000Z',
      content: 'Komentar asli',
      is_deleted: true,
    };

    const detailComment = new DetailComment(payload);

    expect(detailComment.content).toEqual('**komentar telah dihapus**');
  });

  it('should throw error when payload does not contain needed property', () => {
    const payload = {
      username: 'user1',
      date: '2024-07-21T00:00:00.000Z',
      content: 'Komentar asli',
      is_deleted: false,
    };

    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when is_deleted is not boolean', () => {
    const payload = {
      id: 'comment-123',
      username: 'user1',
      date: '2024-07-21T00:00:00.000Z',
      content: 'Komentar asli',
      is_deleted: 'false', // salah
    };

    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });
});
