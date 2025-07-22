const DetailThread = require('../DetailThread');
const InvariantError = require('../../../../Commons/exceptions/InvariantError');

describe('DetailThread entity', () => {
  it('should create DetailThread object correctly when given valid payload', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'Sample Thread',
      body: 'This is the body of the thread',
      date: '2025-07-21T10:00:00.000Z',
      username: 'user123',
    };

    // Act
    const detailThread = new DetailThread(payload);

    // Assert
    expect(detailThread.id).toEqual(payload.id);
    expect(detailThread.title).toEqual(payload.title);
    expect(detailThread.body).toEqual(payload.body);
    expect(detailThread.date).toEqual(payload.date);
    expect(detailThread.username).toEqual(payload.username);
  });

  it('should throw InvariantError when payload does not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'Thread title',
      // body is missing
      date: '2025-07-21T10:00:00.000Z',
      username: 'user123',
    };

    // Act & Assert
    expect(() => new DetailThread(payload)).toThrowError(InvariantError);
    expect(() => new DetailThread(payload)).toThrowError('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should not throw error if all properties exist and are valid', () => {
    // Arrange
    const payload = {
      id: 'thread-456',
      title: 'Valid Thread',
      body: 'A complete body',
      date: '2025-07-21T11:00:00.000Z',
      username: 'validuser',
    };

    // Act & Assert
    expect(() => new DetailThread(payload)).not.toThrow();
  });
});
