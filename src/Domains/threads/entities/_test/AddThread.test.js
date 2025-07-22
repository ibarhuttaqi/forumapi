const InvariantError = require('../../../../Commons/exceptions/InvariantError');
const AddThread = require('../AddThread');

describe('an AddThread entity', () => {
  it('should throw error when payload does not contain needed properties', () => {
    // Arrange
    const payload = {
      title: 'Judul thread',
      // body missing
      owner: 'user-123',
    };

    // Act & Assert
    expect(() => new AddThread(payload)).toThrowError(InvariantError);
    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload properties do not meet data type specification', () => {
    // Arrange
    const payload = {
      title: 123,
      body: [],
      owner: {},
    };

    // Act & Assert
    expect(() => new AddThread(payload)).toThrowError(InvariantError);
    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddThread object correctly', () => {
    // Arrange
    const payload = {
      title: 'Judul valid',
      body: 'Isi body thread',
      owner: 'user-123',
    };

    // Act
    const addThread = new AddThread(payload);

    // Assert
    expect(addThread.title).toEqual(payload.title);
    expect(addThread.body).toEqual(payload.body);
    expect(addThread.owner).toEqual(payload.owner);
  });
});
