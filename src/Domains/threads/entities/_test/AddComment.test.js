const AddComment = require('../AddComment');
const InvariantError = require('../../../../Commons/exceptions/InvariantError');

describe('an AddComment entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'sebuah komentar',
      threadId: 'thread-123',
      // owner missing
    };

    // Act & Assert
    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 'komentar',
      owner: true, // should be string
      threadId: 123, // should be string
    };

    // Act & Assert
    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddComment object correctly', () => {
    // Arrange
    const payload = {
      content: 'komentar bagus',
      owner: 'user-123',
      threadId: 'thread-456',
    };

    // Act
    const { content, owner, threadId } = new AddComment(payload);

    // Assert
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
    expect(threadId).toEqual(payload.threadId);
  });
});
