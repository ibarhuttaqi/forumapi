const AddedThread = require('../AddedThread');

describe('an AddedThread entity', () => {
  it('should throw error when payload does not contain needed properties', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'Judul thread',
      // owner missing
    };

    // Act & Assert
    expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload properties do not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      title: true,
      owner: {},
    };

    // Act & Assert
    expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'Judul thread valid',
      body: 'Ini isi body',
      owner: 'user-123',
    };

    // Act
    const addedThread = new AddedThread(payload);

    // Assert
    expect(addedThread.id).toEqual(payload.id);
    expect(addedThread.title).toEqual(payload.title);
    expect(addedThread.owner).toEqual(payload.owner);

    // optional: cek bahwa properti body memang tidak ikut disimpan
    expect(addedThread.body).toBeUndefined();
  });
});
